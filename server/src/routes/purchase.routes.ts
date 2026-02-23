import { requireAuth } from "@clerk/express";
import express from "express";
import { requireUser } from "../middlewares/requireUser.js";
import { getSalesByUser } from "../controllers/purchase.controller.js";
import { createCheckoutSession } from "../controllers/stripe.controller.js";
const router = express.Router();

router.route("/user").get(requireAuth(), requireUser, getSalesByUser);
router
  .route("/checkout")
  .post(requireAuth(), requireUser, createCheckoutSession);

export default router;
