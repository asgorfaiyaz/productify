import { requireAuth } from "@clerk/express";
import express from "express";
import { requireUser } from "../middlewares/requireUser.js";
const router = express.Router();

router.route("/").get(requireAuth(), requireUser);

export default router;
