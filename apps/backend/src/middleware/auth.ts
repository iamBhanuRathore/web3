import { NextFunction, Response, Request } from "express";
import { verify as jwtVerify } from "jsonwebtoken";
type JWTPayload = {
  userId?: string;
};
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization") ?? "";
  if (!authHeader) {
    return res.json({
      success: "false",
      message: "Auth header is not present",
    });
  }
  try {
    const decoded = jwtVerify(
      authHeader,
      process.env.JWT_SECRET!
    ) as JWTPayload;
    if (decoded.userId) {
      req.userId = decoded.userId;
      next();
      return;
    } else {
      return res.status(403).json({
        success: "false",
        message: "Unauthorized",
      });
    }
  } catch (error) {
    return res.status(403).json({
      success: "false",
      message: "Unauthorized",
    });
  }
};
