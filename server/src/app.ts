import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { clerkMiddleware } from "@clerk/express";
import productRoutes from "./routes/product.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import purchaseRoutes from "./routes/purchase.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import type { NextFunction, Request, Response } from "express";

const app = express();

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});
app.head("/health", (_req: Request, res: Response) => {
  res.sendStatus(200);
});

// middlewares
app.use(clerkMiddleware());
app.use(
  cors({
    origin: ["http://localhost:5173", env.FRONTEND_URL],
    credentials: true, // Allow cookies
  }),
);
app.use("/api/webhooks", webhookRoutes);
app.use(express.json());

// routes
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((err: Error, _: Request, res: Response, _next: NextFunction) => {
  const message = err.message || "Something went wrong";

  res.json({
    success: false,
    message,
    stack: err.stack ? err.stack : {},
  });
});

export default app;
