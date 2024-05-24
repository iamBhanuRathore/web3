import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(5, "Title atleast need to be 5 Chars."),
  signature: z.string(),
  options: z
    .array(
      z.object({
        imageUrl: z.string(),
        index: z.number().int().positive(),
      })
    )
    .min(2, "Minimum two Options are needed"),
});
export const submitTaskSchema = z.object({
  taskId: z.number(),
  optionId: z.number(),
});
