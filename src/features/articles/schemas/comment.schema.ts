import z from "zod";

export const commentSchema = z.object({
	content: z
		.string()
		.min(5, "Comment must be at least 5 characters")
		.max(1000, "Comment must be less than 1000 characters"),
});

export type CreateCommentData = z.infer<typeof commentSchema>;
