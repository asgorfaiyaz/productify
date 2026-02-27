import type { NextFunction, Request, Response } from "express";

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.role!)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
};
