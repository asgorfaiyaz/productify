import {
  getSalesByUserIdFromDB,
  insertOrder,
} from "../services/purchase.service.js";
import { getParam } from "../utils/getParam.js";
import handleAsync from "../utils/handleAsync.js";
import type { Request, Response } from "express";

export const createOrder = handleAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const productId = getParam(req.params.productId);
  if (!productId) {
    return res.status(400).send("Product ID is required");
  }
  const { priceInCents } = req.body;
  if (!priceInCents) {
    return res.status(400).send("Price is required, failed to place order");
  }

  const purchase = await insertOrder({
    userId,
    productId,
    priceInCents,
  });

  return res.status(201).json(purchase);
});

export const getSalesByUserId = handleAsync(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user;

    const { totalSales, totalSalesAmount, averageSaleValue } =
      await getSalesByUserIdFromDB(userId);

    return res
      .status(201)
      .json({ totalSales, averageSaleValue, totalSalesAmount });
  },
);
