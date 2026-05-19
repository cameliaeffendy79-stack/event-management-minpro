import { Role } from "@prisma/client";

export interface Auth {
  name: string;

  email: string;

  password: string;

  confirmPassword?: string;

  role?: Role;

  referral_code?: string;
}