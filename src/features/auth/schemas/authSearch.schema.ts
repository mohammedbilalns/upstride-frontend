import { z } from "zod";

export const authSearchSchema = z.object({
  error: z.string().optional(),
});
