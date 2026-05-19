import prisma from "../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Auth } from "../types/auth";

import { generateReferralCode } from "../utils/generateReferral";


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// ✅ REGISTER
export async function registerUser(
  data: Auth
) {
  // cek email
  const existingUser =
    await prisma.users.findUnique({
      where: {
        email: data.email,
      },
    });

  if (existingUser) {
    throw new Error(
      "Email already registered"
    );
  }

    // ✅ CHECK REFERRAL
  let referrer = null;

  if (data.referral_code) {
    referrer =
      await prisma.users.findUnique({
        where: {
          referral_code:
            data.referral_code,
        },
      });

    if (!referrer) {
      throw new Error(
        "Invalid referral code"
      );
    }
  }

  // ✅ GENERATE REFERRAL CODE
  const myReferralCode =
    generateReferralCode(data.name);

  // hash password
  const hashedPassword =
    await bcrypt.hash(data.password, 10);

  // create user
  const user =
    await prisma.users.create({
      data: {
        name: data.name,

        email: data.email,

        password: hashedPassword,

        role:
          data.role || "CUSTOMER",

        referral_code:
          myReferralCode,

        referred_by_id:
          referrer?.id,
      },
    });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,

    referral_code:
      user.referral_code,
  };
}

// ✅ LOGIN
export async function loginUser(
  data: Auth
) {
  const user =
    await prisma.users.findUnique({
      where: {
        email: data.email,
      },
    });

  if (!user) {
    throw new Error(
      "User not registered"
    );
  }

  // compare password
  const isValid =
    await bcrypt.compare(
      data.password,
      user.password
    );

  if (!isValid) {
    throw new Error(
      "Invalid password"
    );
  }

  // generate token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile_picture:
        user.profile_picture,
    },
  };
}