import { Request, Response } from "express";
import bcrypt from "bcrypt";


import prisma
from "../prisma/client";
import { uploadToCloudinary } from "../services/upload.service";

//////////////////////////////////////////////////
// ✅ UPDATE PROFILE
//////////////////////////////////////////////////
export const updateProfile =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const user =
        (req as any).user;

      const {
        name,
      } = req.body;

      const updated =
        await prisma.users.update({
          where: {
            id: user.id,
          },

          data: {
            name,
          },
        });

      res.status(200).json({
        message:
          "Profile updated",

        data: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  //////////////////////////////////////////////////
// ✅ UPLOAD PROFILE PICTURE
//////////////////////////////////////////////////
export const uploadProfilePicture =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const user =
        (req as any).user;

      if (!req.file) {
        res.status(400).json({
          message:
            "Image is required",
        });

        return;
      }

      // upload image
      const imageUrl =
        await uploadToCloudinary(
          req.file,
          "profile-pictures"
        );

      // update db
      const updated =
        await prisma.users.update({
          where: {
            id: user.id,
          },

          data: {
            profile_picture:
              imageUrl,
          },
        });

      res.status(200).json({
        message:
          "Profile picture updated",

        data: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  //////////////////////////////////////////////////
// ✅ CHANGE PASSWORD
//////////////////////////////////////////////////
export const changePassword =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const user =
        (req as any).user;

      const {
        currentPassword,
        newPassword,
      } = req.body;

      // validasi input
      if (
        !currentPassword ||
        !newPassword
      ) {
        res.status(400).json({
          message:
            "All fields are required",
        });

        return;
      }

      // cari user
      const existingUser =
        await prisma.users.findUnique({
          where: {
            id: user.id,
          },
        });

      if (!existingUser) {
        res.status(404).json({
          message: "User not found",
        });

        return;
      }

      // cek password lama
      const isValid =
        await bcrypt.compare(
          currentPassword,
          existingUser.password
        );

      if (!isValid) {
        res.status(400).json({
          message:
            "Current password incorrect",
        });

        return;
      }

      // hash password baru
      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      // update password
      await prisma.users.update({
        where: {
          id: user.id,
        },

        data: {
          password:
            hashedPassword,
        },
      });

      res.status(200).json({
        message:
          "Password changed successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  };