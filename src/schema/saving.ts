import { z } from "zod";

export const RegistrationUserSavingSchema = z.object({
  createdBy: z.string(),
  nik: z.string().min(16).max(16),
  balance: z.string().min(6),
});

export const TransactionUserSavingAccountSchema = z.object({
  userId: z.string(),
  name: z.string(),
  type: z.enum(["credit", "debit"]),
  amount: z.string(),
  createdBy: z.string(),
});
