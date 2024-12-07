import { z } from "zod";
import { AddressSchema } from "./address";
import { familyRelationType, gender, nationality } from "@/server/db/schema";

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

export const EditUserSchema = z
  .object({
    id: z.string(),
    name: z.string().min(2, {
      message: "Nama harus diisi minimal 2 karakter.",
    }),
    birthPlace: z
      .string()
      .min(1, {
        message: "Tempat lahir harus diisi.",
      })
      .optional(),
    birthDate: z
      .string()
      .min(1, {
        message: "Tanggal lahir harus diisi.",
      })
      .optional(),
    gender: z
      .enum(gender.enumValues, {
        required_error: "Jenis kelamin harus dipilih.",
      })
      .optional(),
    registrationNumber: z.string().optional(),
    email: z.string().optional(),
    nationality: z
      .enum(nationality.enumValues, {
        required_error: "Kewarganegaraan harus dipilih.",
      })
      .optional(),
    nik: z.string().optional(),
    nkk: z.string().optional(),
    nisn: z.string().optional(),
    passport: z.string().optional(),
    country: z.string().optional(),
    address: AddressSchema.optional(),
    domicile: AddressSchema.optional(),
    domicileSameAsAddress: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.nationality === "WNI") {
        return data.nik?.length === 16 && data.nkk?.length === 16;
      }
      if (data.nationality === "WNA") {
        return !!data.passport && !!data.country;
      }
      return true;
    },
    {
      message: "Data tidak lengkap sesuai kewarganegaraan yang dipilih",
    },
  );


  export const createUserFamilyRelationSchema = z.object({
    userId:z.string(),
    relatedUserId:z.string(),
    relationType:z.enum(familyRelationType.enumValues)
  })