import express from "express";
import { requireUser } from "../middlewares/requireUser.js";
import { requireAuth } from "@clerk/express";
import { handleStripeWebhook } from "../controllers/stripe.controller.js";
import handleClerkWebhook from "../controllers/clerk.controller.js";
const router = express.Router();

router.route("/clerk").post(requireAuth(), requireUser, handleClerkWebhook);

router
  .route("/stripe")
  .post(express.raw({ type: "application/json" }), handleStripeWebhook);

export default router;
