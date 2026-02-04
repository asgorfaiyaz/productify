import { requireAuth } from "@clerk/express";
import express from "express";
import { requireUser } from "../middlewares/requireUser.js";
import { getSalesByUser } from "../controllers/purchase.controller.js";
const router = express.Router();

router.route("/user/:userId").get(requireAuth(), requireUser, getSalesByUser);

export default router;
