import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
export const getNextTask = async (workerId: number) => {
  const nextTask = await db.task.findFirst({
    where: {
      submissions: {
        none: {
          workerId: workerId,
        },
      },
      active: true, // to not get the done tasks
    },
    // include: {
    //   options: true,
    // },
    select: {
      id: true,
      title: true,
      options: true,
      amount: true,
    },
  });
  return nextTask;
};
