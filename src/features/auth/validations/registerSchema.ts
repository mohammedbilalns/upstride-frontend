import z from "zod";

export const registerSchema = z.object({
	name: z.string().min(3, 'Name must be atleast 3 characters long'),
	email: z.email('Please entere a valid email address'),
	password: z.string().min(6,'Password must be atleast 6 characters long'),
	confirmPassword: z.string().min(6,'Password must be atleast 6 characters long')
}).refine(data => data.password === data.confirmPassword, { message:'Passwords do not match ', path:["confirmPassword"]})

export type RegisterFormValues  = z.infer<typeof registerSchema>