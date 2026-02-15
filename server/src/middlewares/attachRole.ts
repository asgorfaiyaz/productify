import { clerkClient } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";

export const attachRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const user = await clerkClient.users.getUser(req.user.clerkId);
  req.role = user.publicMetadata.role;
  next();
};
