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

export const passwordSchema = z
	.object({
		oldPassword: z
			.string()
			.min(1, "Current password is required")
			.min(8, "Password must be at least 8 characters"),
		newPassword: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
			.regex(/[a-z]/, "Password must contain at least one lowercase letter")
			.regex(/[0-9]/, "Password must contain at least one number"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export type PasswordFormData = z.infer<typeof passwordSchema>;

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
