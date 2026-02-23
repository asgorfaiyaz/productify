import type { Request, Response, NextFunction } from "express";
import { isUserAdmin } from "../services/clerk.service.js";

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const admin = await isUserAdmin(req.user.clerkId);

  if (!admin) {
    res.status(401).send("Only admin user is required");
    return;
  }
  next();
}
