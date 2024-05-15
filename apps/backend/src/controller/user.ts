import { createTaskSchema } from "@repo/schemas/schemas";
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
  const taskData = createTaskSchema.safeParse(req.body);

  if (!taskData.success) {
    return res.status(400).json({
      success: false,
      message: "Wrong Inputs",
    });
  }

  try {
    const { title, options } = taskData.data;

    const task = await db.task.create({
      data: {
        title,
        amount: 20, // Assuming this is a static value, you can change as needed
        signature: "random string", // Assuming this is a static value, you can change as needed
        options: {
          create: options.map((option) => ({
            imageUrl: option.imageUrl,
            optionId: String(option.index),
          })),
        },
        userId: req.user.id,
      },
      include: {
        User: true,
        options: true,
      },
    });

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const getTask = async (req: Request, res: Response) => {
  const taskId = req.query.taskId as string;
  try {
    const task = await db.task.findMany({
      where: {
        userId: req.user.id,
        ...(taskId && { id: parseInt(taskId) }), // Conditionally add taskId to the where clause
      },
      include: {
        ...(taskId && { options: true }), // Conditionally add taskId to the where clause
      },
    });

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default { signIn, createTask, presignedUrl, getTask };
