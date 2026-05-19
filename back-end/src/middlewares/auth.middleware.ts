import {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "secret";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        message: "Unauthorized",
      });

      return;
    }

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        message: "Token missing",
      });

      return;
    }

    const decoded = jwt.verify(
  token,
  JWT_SECRET
);

(req as any).user = decoded;

next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
}