import type { Request, Response } from "express";
import db from "../db/index.js";
import { inArray } from "drizzle-orm";
import { ProductsTable } from "../db/schema.js";
import { stripe } from "../lib/stripe.js";
import Stripe from "stripe";

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { id: userId } = req.user;

  const clientProducts = req.body.products as {
    id: string;
    quantity: number;
  }[];

  if (!Array.isArray(clientProducts) || clientProducts.length == 0) {
    return res.status(400).json({
      error: "failed to create checkout session, products required",
    });
  }

  const productIds = clientProducts.map((p) => p.id);

  const dbProducts = await db.query.ProductsTable.findMany({
    where: inArray(ProductsTable.id, productIds),
    columns: {
      id: true,
      title: true,
      description: true,
      priceInCents: true,
    },
  });

  const finalProducts = dbProducts.map((p) => ({
    ...p,
    quantity: clientProducts.find((cp) => cp.id === p.id)?.quantity || 1,
  }));

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
    finalProducts.map((product) => {
      return {
        price_data: {
          currency: "usd",
          unit_amount: product.priceInCents!,
          product_data: {
            name: product.title,
            description: product.description!,
          },
        },
        quantity: product.quantity,
      };
    });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    metadata: {
      userId,
      productIds: JSON.stringify(
        finalProducts.map((p) => ({ id: p.id, quantity: p.quantity })),
      ),
    },
    payment_method_types: ["card"],
  });

  return res.status(200).json({ url: session.url });
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    // Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;

      try {
        const userId = session.metadata?.userId;
        const products = session.metadata?.productIds
          ? JSON.parse(session.metadata.productIds)
          : [];

        // Insert order in your DB
        // await db.insert(OrdersTable).values({
        //   userId,
        //   stripeSessionId: session.id,
        //   products: JSON.stringify(products),
        //   totalAmount: session.amount_total || 0,
        //   status: "paid",
        //   createdAt: new Date(),
        // });

        console.log(`✅ Order created for user ${userId}`);
      } catch (err) {
        console.error("❌ Failed to create order in DB:", err);
        return res.status(500).send("DB error");
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.json({ received: true });
};
