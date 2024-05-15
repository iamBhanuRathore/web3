import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sign as jwtSign } from "jsonwebtoken";
const db = new PrismaClient();
export const signIn = async (req: Request, res: Response) => {
  const walletAddress = "chjvhjdfgyugthesryuiotghwoe";
  const name = "Bhanu";
  const worker = await db.worker.upsert({
    where: {
      address: walletAddress,
    },
    create: {
      address: walletAddress,
      name,
    },
    update: {
      address: walletAddress,
    },
  });
  const token = jwtSign(
    {
      userId: worker.id,
    },
    process.env.JWT_SECRET!
  );
  return res.json({
    success: true,
    token,
  });
};

export default { signIn };
