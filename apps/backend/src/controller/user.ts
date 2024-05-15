import { userSchema } from "@repo/schemas/schemas";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sign as jwtSign } from "jsonwebtoken";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
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
  const userId = req.user.id;
  // const userId = "bhanu";
  const s3client = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET_KEY!,
    },
  });
  const { fields, url } = await createPresignedPost(s3client, {
    Bucket: process.env.BUCKET_NAME!,
    Key: `${process.env.BUCKET_KEY}/${userId}/${Date.now()}-image.jpg`,
    Conditions: [["content-length-range", 0, 5 * 1024 * 1024]],
    Fields: {
      "Content-Type": "image/png",
    },
    Expires: 3600,
  });
  console.log({ url, fields });
  return res.json({
    success: true,
    data: {
      url,
      fields,
    },
  });
};
export const createTask = async (req: Request, res: Response) => {
  // userSchema;
};

export default { signIn, createTask, presignedUrl };
