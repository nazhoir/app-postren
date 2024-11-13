import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z
    .string({
      required_error: "Nama tidak boleh kosong",
      invalid_type_error: "Nama harus berupa teks string",
    })
    .min(2, {
      message: "Nama tidak boleh kosong",
    }),
  // username: z
  //   .string({
  //     required_error: "username tidak boleh kosong",
  //     invalid_type_error: "username harus berupa teks string",
  //   })
  //   .min(5, {
  //     message: "username tidak boleh kurang dari 5 karakter",
  //   })
  //   .max(30, {
  //     message: "username tidak boleh lebih dari 30 karakter",
  //   }),
  // password: z
  //   .string({
  //     required_error: "password tidak boleh kosong",
  //     invalid_type_error: "password harus berupa teks string",
  //   })
  //   .min(8, {
  //     message: "password tidak boleh kurang dari 8 karakter",
  //   }),
  // email: z
  //   .string({
  //     required_error: "email tidak boleh kosong",
  //     invalid_type_error: "email harus berupa teks string",
  //   })
  //   .email()
  //   .min(1, {
  //     message: "email tidak boleh kosong",
  //   }),
  // phoneNumber: z.string().min(10).max(20).optional(),
  // phoneNumberCode: z.string().optional(),
  // image: z.string().optional(),
  // nik: z.string().min(16).max(16).optional(),
  // nkk: z.string().min(16).max(16).optional(),
  // passportNumber: z.string().optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
  birthPlace: z.string().min(3),
  birthDate: z.string(),
  citizenship: z.string(),
  gender: z.enum(["female", "male"]),

  type: z.enum(["indonesia", "other"], {
    required_error: "Kamu perlu memilih jenis kewarganegaraan",
  }),

  identityNumber: z.string().max(16),
  identityType: z.enum(["nik", "pasport"], {
    required_error: "Kamu perlu memilih jenis kertu identitas",
  }),

  organizationId: z.string(),
  institutionId: z.string().optional(),

  createType: z.enum(["student", "employee"], {
    required_error: "Kamu perlu memilih jenis user",
  }),

  employeeStatus: z
    .enum(["tetap", "tidak_tetap"], {
      required_error: "Status Pekerja wajib diisi",
    })
    .optional(),

  employeeStart: z
    .string({ required_error: "TMT Pekerja wajib diisi " })
    .optional(),
});

export const CreateStudentSchema = z.object({
  name: z
    .string({
      required_error: "Nama tidak boleh kosong",
      invalid_type_error: "Nama harus berupa teks string",
    })
    .min(2, {
      message: "Nama tidak boleh kosong",
    }),
  role: z.enum(["USER", "ADMIN"]).optional(),
  birthPlace: z.string().min(3),
  birthDate: z.string(),
  citizenship: z.string(),
  gender: z.enum(["female", "male"]),

  type: z.enum(["indonesia", "other"], {
    required_error: "Kamu perlu memilih jenis kewarganegaraan",
  }),

  identityNumber: z.string().max(16),
  identityType: z.enum(["nik", "pasport"], {
    required_error: "Kamu perlu memilih jenis kertu identitas",
  }),
  nisn: z.string().min(10).max(13),
  organizationId: z.string(),
  institutionId: z.string().optional(),
});
