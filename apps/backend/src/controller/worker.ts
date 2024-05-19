import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sign as jwtSign } from "jsonwebtoken";
const db = new PrismaClient();
export const signIn = async (req: Request, res: Response) => {
  const walletAddress = "wewewew";
  const name = "Bhanu";
  const worker = await db.worker.upsert({
    where: {
      address: walletAddress,
    },
    create: {
      address: walletAddress,
      name,
      // Balance:{
      //   create:{}
      // }
    },
    update: {
      address: walletAddress,
    },
  });
  const token = jwtSign(
    {
      userId: worker.id,
    },
    process.env.JWT_SECRET_WORKER!
  );
  return res.json({
    success: true,
    token,
  });
};
export const nextTask = async (req: Request, res: Response) => {
  const nextTask = await db.task.findFirst({
    where: {
      submissions: {
        none: {
          workerId: req.worker.id,
        },
      },
      active: true, // to not get the done tasks
    },
    // include: {
    //   options: true,
    // },
    select: {
      title: true,
      options: true,
    },
  });

  if (!nextTask) {
    return res.status(411).json({
      success: false,
      message: "No More task left for you to review !",
    });
  }
  return res.json({
    success: true,
    nextTask,
  });
};
export const postSubmission = async (req: Request, res: Response) => {};

export default { signIn, nextTask, postSubmission };
