import { z } from "zod";

export const AddressSchema = z.object({
  id: z.string().optional(), // Optional untuk kasus update atau create baru
  fullAddress: z.string().optional(),
  rt: z.string().max(100).optional(),
  rw: z.string().max(100).optional(),
  village: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  regency: z.string().max(100).optional(),
  province: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  postalCode: z.string().max(100).optional(),
});
