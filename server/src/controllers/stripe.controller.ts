import type { Request, Response } from "express";
import db from "../db/index.js";
import { eq, inArray } from "drizzle-orm";
import { ProductsTable, PurchasesTable } from "../db/schema.js";
import { stripe } from "../lib/stripe.js";
import Stripe from "stripe";
import {
  insertPurchase,
  insertPurchaseItem,
} from "../services/purchase.service.js";
import { getProductsByIds } from "../services/product.service.js";

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
    allow_promotion_codes: true,
    success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
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
  type CheckoutProduct = {
    id: string;
    quantity: number;
  };
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
      const existingSessionId = await db.query.PurchasesTable.findFirst({
        where: eq(PurchasesTable.stripeSessionId, session.id),
      });
      if (existingSessionId !== undefined) {
        return res.json({ received: true });
      }

      try {
        const userId = session.metadata?.userId;
        const totalAmount = session.amount_total;
        const products: CheckoutProduct[] = session.metadata?.productIds
          ? JSON.parse(session.metadata.productIds)
          : [];

        console.log("👤 UserId:", userId); // Add this
        console.log("💵 Total:", totalAmount); // Add this
        console.log("📦 Products:", products); // Add this

        if (!userId || !totalAmount || !products || products.length === 0) {
          console.error("❌ Validation failed:", {
            userId,
            totalAmount,
            products,
          }); // Add this
          throw new Error("invalid");
        }

        const productIds = products.map((product) => product.id);
        const updatedProducts = await getProductsByIds(productIds);
        const latestProducts = updatedProducts.map((p) => {
          return {
            ...p,
            quantity: products.find((pr) => pr.id === p.id)?.quantity,
          };
        });
        const purchase = await insertPurchase({
          userId,
          stripeSessionId: session.id,
          isPaid: true,
          totalAmount,
        });

        await Promise.all(
          latestProducts.map((product) =>
            insertPurchaseItem({
              purchaseId: purchase.id,
              productId: product.id,
              quantity: product.quantity!,
              priceInCents: product.priceInCents!,
            }),
          ),
        );

        console.log(`✅ Order created for user ${userId}`);
      } catch (err) {
        console.error("❌ Failed to create order in DB:", err);
        console.error("❌ Full error details:", JSON.stringify(err, null, 2)); // Add this
        return res.status(500).send("DB error");
      }
      break;

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`✅ Payment succeeded: ${paymentIntent.id}`);
      // Add any additional logic if needed
      break;

    case "charge.succeeded":
      const charge = event.data.object as Stripe.Charge;
      console.log(`✅ Charge succeeded: ${charge.id}`);
      break;

    case "payment_intent.created":
    case "charge.updated":
      // Acknowledge but don't process
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.json({ received: true });
};
