import z from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be atleast 3 characters long"),
    email: z.email("Please entere a valid email address"),
    phone: z
      .string()
      .regex(/^\d{10}$/, { message: "Must be exactly 10 digits" }),
    password: z.string().min(8, "Password must be atleast 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be atleast 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match ",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
