import type { Request, Response } from "express";
import db from "../db/index.js";
import { inArray } from "drizzle-orm";
import { ProductsTable } from "../db/schema.js";
import { stripe } from "../lib/stripe.js";
import Stripe from "stripe";

export const createCheckoutSession = async (req: Request, res: Response) => {
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
  });

  return res.status(200).json({ url: session.url });
};
