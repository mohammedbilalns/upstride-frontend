import z from "zod";

export const createExpertiseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name should be atleast 3 characters long")
    .max(50, "Name should be atmost 50 characters long"),
  description: z
    .string()
    .trim()
    .min(3, "Description should be atleast 3 characters long")
    .max(200, "Description should be atmost 200 characters long"),
  skills: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .min(1, "Atleast one skill is required")
    .max(20, "No more than 20 skills can be added")
    .refine(
      (skills) => {
        const seen = new Set<string>();
        for (const s of skills) {
          const normalized = s.value.toLowerCase();
          if (seen.has(normalized)) return false;
          seen.add(normalized);
        }
        return true;
      },
      {
        message: "Skills must be unique (case-insensitive)",
      },
    ),
});

export const updateExpertiseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name should be atleast 3 characters long")
    .max(50, "Name should be atmost 50 characters long"),
  description: z
    .string()
    .trim()
    .min(3, "Description should be atleast 3 characters long")
    .max(200, "Description should be atmost 200 characters long"),
});
export type updateExpertiseFormValues = z.infer<typeof updateExpertiseSchema>;

export type FormValues = z.infer<typeof createExpertiseSchema>;

export const createSkillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name should be atleast 3 characters long")
    .max(50, "Name should be atmost 50 characters long"),
});

export type createSkillFormValues = z.infer<typeof createSkillSchema>;
