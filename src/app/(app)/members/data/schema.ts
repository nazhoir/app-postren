import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  registrationNumber: z.string().nullable(),
  name: z.string().nullable(),
  gender: z.string().nullable(),
  nik: z.string().nullable(),
  nkk: z.string().nullable(),
  birthPlace: z.string().nullable(),
  birthDate: z.string().nullable(),
});

export type Task = z.infer<typeof taskSchema>;
