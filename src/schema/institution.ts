import * as z from "zod";

export const registerInstitutionSchema = z.object({
  name: z
    .string({
      required_error: "Tidak boleh kosong",
    })
    .min(1, {
      message: "Tidak boleh kosong",
    })
    .max(50, {
      message: "Tidak boleh lebih dari 50 karakter",
    })
    .toUpperCase(),
  educationalUnitId: z.string(),
  organizationId: z.string(),
  statistic: z.string().min(5),
  statisticType: z.enum(["NSPP", "NSS", "NSM"]),
});

export const createInstitutionSchema = z.object({
  name: z
    .string({
      required_error: "Tidak boleh kosong",
    })
    .min(1, {
      message: "Tidak boleh kosong",
    })
    .max(50, {
      message: "Tidak boleh lebih dari 50 karakter",
    })
    .toUpperCase(),
  shortname: z.string(),
  type: z.string(),
  statistic: z.string().min(5),
  statisticType: z.enum(["NSPP", "NSS", "NSM"]),
  userId: z.string(),
});
