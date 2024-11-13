import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string({
      required_error: "Email tidak boleh kosong",
    })
    .email({
      message: "Harus berupa email",
    }),
  password: z.string({
    required_error: "Kata sandi tidak boleh kosong",
  }),
});

export const ResetPasswordSchema = z.object({
  email: z
    .string({
      required_error: "Email tidak boleh kosong",
    })
    .email({
      message: "Harus berupa email",
    }),
});

const passwordValidation = new RegExp(
  /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
);

export const NewPasswordSchema = z
  .object({
    email: z
      .string({
        required_error: "Email tidak boleh kosong",
      })
      .email({
        message: "Harus berupa email",
      }),
    password: z
      .string({
        required_error: "Kata sandi tidak boleh kosong",
      })
      .min(8, {
        message: "Kata sandi tidak boleh kurang dari 8 karakter",
      })
      .regex(passwordValidation, {
        message:
          "Kata sandi harus terdiri dari kombinasi antara angka, huruf, simbol dan minimal 1 huruf kapital",
      }),
    confirmPassword: z
      .string({
        required_error: "Kata sandi tidak boleh kosong",
      })
      .min(8, {
        message: "Kata sandi tidak boleh kurang dari 8 karakter",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi kata sandi harus sama dengan kata sandi baru",
  });
