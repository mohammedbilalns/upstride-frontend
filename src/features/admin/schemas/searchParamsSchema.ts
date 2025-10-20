import z from "zod";

export const paramsSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	rowsPerPage: z.coerce
		.number()
		.refine((v) => [5, 10, 20].includes(v))
		.default(10),
	search: z.string().trim().optional().default(""),
});

export type RowsPerPage = z.infer<typeof paramsSchema>["rowsPerPage"];
