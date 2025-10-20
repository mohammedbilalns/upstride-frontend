import z from "zod";

export const articlesParamsSchema = z.object({
	category: z.string().trim().optional().default(""),
	sortBy: z.string().trim().optional().default(""),
	tag: z.string().trim().optional().default(""),
});
