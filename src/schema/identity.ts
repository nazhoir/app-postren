import { z } from "zod";

export const RegisterIndentitySchema = z.object({
  label: z.string().optional(),
  userNIK: z.coerce
    .string({
      required_error: "NIK tidak boleh kosong",
    })
    .min(16, {
      message: "NIK tidak boleh kurang dari 16 digit",
    })
    .max(16),
  identity: z
    .string({
      required_error: "Nomor identitas tidak boleh kosong",
    })
    .optional()
    .or(
      z.string().min(1, {
        message: "Nomor identitas tidak boleh kosong",
      }),
    ),
  pinPassword: z
    .string({
      required_error: "PIN password tidak boleh kosong",
    })
    .optional()
    .or(
      z
        .string()
        .min(8, {
          message: "PIN tidak boleh kurang dari 8 digit",
        })
        .max(20, {
          message: "PIN tidak boleh lebih dari 20 digit",
        }),
    ),
  rfid: z.coerce.string().optional(),
  organizationId: z.string(),
});

export const GetIndentityByValueAndProviderSchema = z.object({
  value: z.string(),
  provider: z.enum(["nfc", "qrcode", "barcode"]),
});
