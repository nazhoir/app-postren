import { z } from "zod";

export const createOrgBillItemSchema = z.object({
  name: z
    .string({
      required_error: "Tidak boleh kosong",
    })
    .min(1, {
      message: "Tidak boleh kosong",
    })
    .max(50, {
      message: "Tidak boleh lebih dari 50 karakter",
    }),
  amount: z.string(),
  createdBy: z.string().min(1),
});

export const createUserBillSchema = z.object({
  billId: z.string({
    required_error: "Tidak boleh kosong",
  }),
  discount: z.string(),
  userId: z.string(),
  createdBy: z.string().min(1),
});
