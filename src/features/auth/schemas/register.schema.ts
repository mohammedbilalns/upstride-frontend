import z from "zod";

export const registerSchema = z
	.object({
		name: z.string().min(3, "Name must be atleast 3 characters long"),
		email: z.email("Please entere a valid email address"),
		phone: z
			.string()
			.regex(/^\d{10}$/, { message: "Must be exactly 10 digits" }),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
			.regex(/[a-z]/, "Password must contain at least one lowercase letter")
			.regex(/[0-9]/, "Password must contain at least one number")
			.regex(
				/[^A-Za-z0-9]/,
				"Password must contain at least one special character (!@#$%^&* etc.)",
			),
		confirmPassword: z
			.string()
			.min(8, "Password must be atleast 8 characters long"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match ",
		path: ["confirmPassword"],
	});

export type RegisterFormValues = z.infer<typeof registerSchema>;
