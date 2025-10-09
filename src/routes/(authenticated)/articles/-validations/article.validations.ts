import z from "zod";

const titleSchema = z
	.string()
	.min(5, "Title must be at least 5 characters")
	.max(200, "Title must be less than 200 characters");

const contentSchema = z
	.string()
	.min(10, "Content must be at least 10 characters")
	.max(5000, "Content must be less than 5000 characters");

const tagsSchema = z
	.array(z.string())
	.max(5, "You can have a maximum of 5 tags");

const featuredImageSchema = z.object({
	public_id: z.string(),
	original_filename: z.string(),
	resource_type: z.string(),
	secure_url: z.url(),
	bytes: z.number(),
	asset_folder: z.string(),
}).optional();

const baseArticleSchema = z.object({
	title: titleSchema,
	content: contentSchema,
	tags: tagsSchema,
	featuredImage: featuredImageSchema,
});

export const articleCreateSchema = baseArticleSchema;
export const articleUpdateSchema = baseArticleSchema.partial();

export type articleCreateData = z.infer<typeof articleCreateSchema>;
export type articleUpdateData = z.infer<typeof articleUpdateSchema>;
