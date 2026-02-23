import { getSalesDataFromDB } from "../services/purchase.service.js";
import handleAsync from "../utils/handleAsync.js";
import type { Request, Response } from "express";

export const getSalesByUser = handleAsync(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user;

    const orders = await getSalesDataFromDB(userId);
    return res.status(200).json(orders);
  },
);
