import { getNextTask } from "./../utils/getNextTask";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sign as jwtSign } from "jsonwebtoken";
import { submitTaskSchema } from "@repo/schemas/schemas";
import { TOTAL_SUBMISSIONS } from "../constants";
const db = new PrismaClient();

export const signIn = async (req: Request, res: Response) => {
  const walletAddress = "woodbox";
  const name = "Bhanu Worker 3";
  const worker = await db.worker.upsert({
    where: {
      address: walletAddress,
    },
    create: {
      address: walletAddress,
      name,
      Balance: {
        create: {},
      },
    },
    update: {},
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
  const { success, data, error } = submitTaskSchema.safeParse(body);
  if (!success) {
    return res.status(411).json({
      success: false,
      message: "Incorrect Inputs",
      error: error,
    });
  }
  // this is the task which the worker have to submit to get to the next task
  const dbTask = await getNextTask(req.worker.id);
  if (!dbTask || dbTask.id !== data.taskId) {
    return res.status(411).json({
      success: false,
      message: "No task found with this taskId",
    });
  }
  try {
    // Amount need to send to a single worker on submission --
    const amount = dbTask.amount / TOTAL_SUBMISSIONS;
    const [submission, option] = await db.$transaction([
      db.submission.create({
        data: {
          workerId: req.worker.id,
          taskId: data.taskId,
          optionId: data.optionId,
          amount, // TODO : need to calculate by the amount and no. of submission
        },
      }),
      db.balance.update({
        where: {
          workerId: req.worker.id,
        },
        data: {
          pendingAmount: {
            increment: amount,
          },
        },
      }),
      db.options.update({
        where: {
          id: data.optionId,
          taskId: data.taskId,
        },
        data: {
          submissionCount: {
            increment: 1, // Increment the submission count by 1
          },
        },
      }),
    ]);
    return res.json({
      success: true,
      data: {
        submission,
        option,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const payout = async (req: Request, res: Response) => {
  const worker = await db.worker.findUnique({
    where: {
      id: req.worker.id,
    },
    include: {
      Balance: true,
    },
  });
  return res.json({
    success: true,
    data: worker,
  });
};

export default { signIn, nextTask, postSubmission, payout };
