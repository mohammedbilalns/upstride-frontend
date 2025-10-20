import { z } from "zod";

export const expertiseSchema = z.object({
	_id: z.string(),
	name: z.string(),
});

export const skillSchema = z.object({
	_id: z.string(),
	name: z.string(),
});

export const profileSchema = z.object({
	id: z.string(),
	name: z.string().min(1, "Name is required"),
	profilePicture: z.string().optional(),
	profilePictureType: z.string().optional(),
	interestedExpertises: z.array(z.string()).optional(),
	interestedSkills: z.array(z.string()).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema> & {
	profilePicture?:
		| string
		| {
				public_id: string;
				original_filename: string;
				resource_type: string;
				secure_url: string;
				bytes: number;
				asset_folder: string;
		  };
};
