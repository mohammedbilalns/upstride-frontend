import { z } from 'zod'

export const mentorRegistrationSchema = z.object({
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
  currentRole: z.string().min(1, { message: "Current role is required" }),
  organisation: z.string().min(1, { message: "Organisation is required" }),
  yearsOfExperience: z.number().min(0, { message: "Years of experience must be at least 0" }).max(100, { message: "Years of experience must be at most 100" }),
  educationalQualifications: z.array(z.string()).min(1, { message: "At least one qualification is required" }),
  personalWebsite: z.url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  expertise: z.string().min(1, { message: "Please select an expertise" }),
  skills: z.array(z.string()).min(1, { message: "At least one skill is required" }),
  resume: z.instanceof(File).refine(file => file.size <= 5000000, `Max file size is 5MB.`).refine(file => file.type === 'application/pdf', 'Only PDF files are accepted'),
  termsAccepted: z.boolean().refine(val => val === true, { message: "You must accept the terms and conditions" })
})

export type mentorRegistrationFormValues = z.infer<typeof mentorRegistrationSchema>
