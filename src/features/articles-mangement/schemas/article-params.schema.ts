import z from "zod";

export const articlesParamsSchema = z.object({
	query: z.string().optional(),
	category: z.string().trim().optional(),
	sortBy: z.string().trim().optional(),
	tag: z.string().trim().optional(),
});
