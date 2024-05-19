import { getNextTask } from "./../utils/getNextTask";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sign as jwtSign } from "jsonwebtoken";
import { submitTaskSchema } from "@repo/schemas/schemas";
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
  const nextTask = await getNextTask(req.worker.id);
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
export const postSubmission = async (req: Request, res: Response) => {
  const body = req.body;
  const { success, data } = submitTaskSchema.safeParse(body);
  if (!success) {
    return res.status(411).json({
      succes: false,
      message: "Incorrect Inputs",
    });
  }
  // this is the task which the worker have to submit to get to the next task
  const dbTask = await getNextTask(req.worker.id);
  if (!dbTask || dbTask.id !== parseInt(data.taskId)) {
    return res.status(411).json({
      succes: false,
      mwssage: "Incorrect Inputs",
    });
  }
  const submitTask = db.task.update({
    where: {
      id: parseInt(data.taskId),
    },
    data: {
      submissions: {
        create: {
          workerId: req.worker.id,
        },
      },
    },
  });
};

export default { signIn, nextTask, postSubmission };
