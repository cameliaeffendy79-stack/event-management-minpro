import { Request, Response } from "express";
import {
  registerUser,
  loginUser as loginService, // 🔥 rename biar tidak bentrok
} from "../services/auth.service";

// ✅ REGISTER
export async function registerController(
  req: Request,
  res: Response
) {
  try {
    const result = await registerUser(req.body);

    res.status(201).json({
      message: "Register success",
      data: result,
    });
  } catch (error: any) {
  console.error(error);

  return res.status(500).json({
    message: error.message || "Internal server error",
  });
}
}

// ✅ LOGIN
export async function loginController(
  req: Request,
  res: Response
) {
  try {
    const result = await loginService(req.body);

    res.status(200).json({
      message: "Login success",
      data: result,
    });
  } catch (error: any) {
  console.error("LOGIN ERROR:", error);

  return res.status(400).json({
    message: error.message,
    error,
  });
}
}