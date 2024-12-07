import { cashflowType, paymentMethod } from "@/server/db/schema";
import { z } from "zod";

export const RegistrationUserSavingSchema = z.object({
  createdBy: z.string(),
  nik: z.string().min(16).max(16),
  balance: z.string().min(6),
});

export const CashflowSavingAccountSchema = z.object({
  userId: z.string(),
  name: z.string().max(32),
  type: z.enum(cashflowType.enumValues),
  amount: z.string(),
  createdBy: z.string(),
  note: z.string().max(46),
  paymentMethod: z.enum(paymentMethod.enumValues),
  paymentNote: z.string().max(46),
});
