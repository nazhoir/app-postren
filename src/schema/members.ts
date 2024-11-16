import { z } from "zod";

const BaseSchema = {
  name: z.string().min(2, {
    message: "Nama harus diisi minimal 2 karakter.",
  }),
  nik: z
    .string()
    .max(16, {
      message: "Nomor Kartu Keluarga harus 16 digit.",
    })
    .min(16, {
      message: "Nomor Kartu Keluarga harus 16 digit.",
    }),
  nkk: z
    .string()
    .max(16, {
      message: "Nomor Kartu Keluarga harus 16 digit.",
    })
    .min(16, {
      message: "Nomor Kartu Keluarga harus 16 digit.",
    }),
  birthPlace: z.string().min(1, {
    message: "Tempat lahir harus diisi.",
  }),
  birthDate: z.string().min(1, {
    message: "Tanggal lahir harus diisi.",
  }),
  gender: z.enum(["L", "P"], {
    required_error: "Jenis kelamin harus dipilih.",
  }),
  address: z.string().optional(),
  createdBy: z.string(),
};

export const CreateMemberSchema = z.discriminatedUnion("role", [
  // Schema untuk student
  z.object({
    ...BaseSchema,
    role: z.literal("student"),
    nisn: z.string().min(1, {
      message: "NISN harus diisi untuk peserta didik.",
    }),
  }),
  // Schema untuk employee
  z.object({
    ...BaseSchema,
    role: z.literal("employee"),
    nisn: z.string().optional(),
  }),
  // Schema untuk guardian
  z.object({
    ...BaseSchema,
    role: z.literal("guardian"),
    nisn: z.string().optional(),
  }),
]);

export const GetUserByNIKSchema = z.object({
  nik: z.string().length(16, {
    message: "NIK harus 16 digit.",
  }),
});
