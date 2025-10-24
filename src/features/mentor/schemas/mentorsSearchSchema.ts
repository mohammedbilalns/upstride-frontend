import { z } from "zod";

export const MentorsSearchSchema = z.object({
	query: z.string().optional(),
	expertiseId: z.string().optional(),
	skillId: z.string().optional(),
});

export type MentorsSearchSchema = z.infer<typeof MentorsSearchSchema>;
