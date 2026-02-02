import express from "express";
import { requireUser } from "../middlewares/requireUser.js";
import { requireAuth } from "@clerk/express";
import { createCheckoutSession } from "../controllers/stripe.controller.js";
const router = express.Router();

router
  .route("/checkout")
  .post(requireAuth(), requireUser, createCheckoutSession);

export default router;
