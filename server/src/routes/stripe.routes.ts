import express from "express";
import { requireUser } from "../middlewares/requireUser.js";
import { requireAuth } from "@clerk/express";
import { createPaymentIntent } from "../controllers/stripe.controller.js";
const router = express.Router();

router
  .route("/create-payment-intent")
  .post(requireAuth(), requireUser, createPaymentIntent);

export default router;
