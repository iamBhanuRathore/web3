import { PrismaClient } from "@prisma/client";
import { NextFunction, Response, Request } from "express";
import { verify as jwtVerify } from "jsonwebtoken";

type JWTPayload = {
  userId?: number;
};
const db = new PrismaClient();
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization") ?? "";
  if (!authHeader) {
    return res.json({
      success: false,
      message: "Auth header is not present",
    });
  }
  try {
    const decoded = jwtVerify(
      authHeader,
      process.env.JWT_SECRET!
    ) as JWTPayload;
    if (!decoded.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const user = await db.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
