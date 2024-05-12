import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sign as jwtSign } from "jsonwebtoken";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const db = new PrismaClient();
const signIn = async (req: Request, res: Response) => {
  const walletAddress = "FJX3mwRGYdmUMmGVAUHTKDGwUHUzTsrrYfKc1Q9u8zzR";
  const name = "Bhanu";
  const user = await db.user.upsert({
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
      userId: user.id,
    },
    process.env.JWT_SECRET!
  );
  return res.json({
    success: true,
    token,
  });
};

export const presignedUrl = async (req: Request, res: Response) => {
  const userId = req.userId;
  // const userId = "bhanu";
  const s3client = new S3Client();
  const command = new PutObjectCommand({
    Bucket: "web3-kirat-pes",
    Key: `web3-kirat-images/${userId}`,
  });
  const preSignedUrl = await getSignedUrl(s3client, command, {
    expiresIn: 3600,
  });
};

export default { signIn, presignedUrl };
