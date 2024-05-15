import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string(),
  signature: z.string(),
  options: z.array(
    z.object({
      imageUrl: z.string(),
      index: z.number().int().positive(),
    })
  ),
});
