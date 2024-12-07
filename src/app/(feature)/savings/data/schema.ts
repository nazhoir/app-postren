import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const savingcCahsflowSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["credit", "debit"]),
  amount: z.number(),
  createdAt: z.date(),
  paymentMethod: z.enum(["cash", "bank_transfer"]).nullable(),
  user: z.string(),
});

export type Task = z.infer<typeof savingcCahsflowSchema>;
