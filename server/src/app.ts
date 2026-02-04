import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import { clerkMiddleware } from "@clerk/express";
import clerkRoutes from "./routes/clerk.routes.js";
import productRoutes from "./routes/product.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import purchaseRoutes from "./routes/purchase.routes.js";
import stripeRoutes from "./routes/stripe.routes.js";
import type { NextFunction, Request, Response } from "express";
import { handleStripeWebhook } from "./controllers/stripe.controller.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});
app.head("/health", (_req: Request, res: Response) => {
  res.sendStatus(200);
});

// middlewares
app.use(clerkMiddleware());
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", env.FRONTEND_URL],
    credentials: true, // Allow cookies
  }),
);

// routes
app.use("/api/webhooks", clerkRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/stripe", stripeRoutes);

// SPA fallback
app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.use((err: Error, _: Request, res: Response, _next: NextFunction) => {
  const message = err.message || "Something went wrong";

  res.json({
    success: false,
    message,
    stack: err.stack ? err.stack : {},
  });
});

export default app;
