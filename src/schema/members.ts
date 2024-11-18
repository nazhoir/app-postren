import { z } from "zod";

// Schema untuk ID berdasarkan kebangsaan
const IDByNationality = z.discriminatedUnion("nationality", [
  z.object({
    nationality: z.literal("WNA"),
    country: z.string().min(1),
    passport: z.string().min(1),
    nik: z.string(),
    nkk: z.string(),
  }),
  z.object({
    nationality: z.literal("WNI"),
    country: z.string().default("indonesia"),
    passport: z.string().optional(),
    nik: z
      .string()
      .length(16, { message: "Nomor Induk Kependudukan harus 16 digit." }),
    nkk: z
      .string()
      .length(16, { message: "Nomor Kartu Keluarga harus 16 digit." }),
  }),
]);

// Base schema sebagai ZodObject
const BaseSchema = z.object({
  name: z.string().min(2, {
    message: "Nama harus diisi minimal 2 karakter.",
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
});

// Schema utama
export const CreateMemberSchema = z.discriminatedUnion("role", [
  // Schema untuk student
  z.object({
    role: z.literal("student"),
    nisn: z.string().min(1, {
      message: "NISN harus diisi untuk peserta didik.",
    }),
    ...BaseSchema.shape, // Gunakan `.shape` untuk menyebarkan shape dari `BaseSchema`
    identity: IDByNationality,
  }),
  // Schema untuk employee
  z.object({
    role: z.literal("employee"),
    nisn: z.string().optional(),
    ...BaseSchema.shape,
    identity: IDByNationality,
  }),
  // Schema untuk guardian
  z.object({
    role: z.literal("guardian"),
    nisn: z.string().optional(),
    ...BaseSchema.shape,
    identity: IDByNationality,
  }),
]);

export const GetUserByNIKSchema = z.object({
  nik: z.string().length(16, {
    message: "NIK harus 16 digit.",
  }),
});
