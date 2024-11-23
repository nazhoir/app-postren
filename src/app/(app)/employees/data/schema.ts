import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  status: z.enum(["PNS", "PPPK", "NON-ASN"]).optional().nullable(),
  name: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  nik: z.string().nullable().optional(),
  nkk: z.string().nullable().optional(),
  birthPlace: z.string().nullable().optional(),
  birthDate: z.string().nullable().optional(),
});

export type Task = z.infer<typeof taskSchema>;
