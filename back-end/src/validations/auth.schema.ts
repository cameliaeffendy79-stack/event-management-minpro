import { z } from "zod";
import { Role } from "@prisma/client";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Nama minimal 3 karakter"),

    email: z
      .string()
      .email("Format email tidak valid"),

    password: z
      .string()
      .min(
        6,
        "Password minimal 6 karakter"
      ),

    confirmPassword: z.string(),

    role: z
      .enum([
        Role.CUSTOMER,
        Role.ORGANIZER,
      ])
      .optional(),
  })

  .refine(
    (data) =>
      data.password ===
      data.confirmPassword,
    {
      message: "Password tidak sama",
      path: ["confirmPassword"],
    }
  );


  export const loginSchema = z.object({
  email: z
    .string()
    .email("Format email tidak valid"),

  password: z
    .string()
    .min(
      6,
      "Password minimal 6 karakter"
    ),
});
