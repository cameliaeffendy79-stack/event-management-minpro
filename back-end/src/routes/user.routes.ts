import { Router } from "express";
import { changePassword } from "../controllers/user.controller";

import {
  updateProfile,
  uploadProfilePicture,
} from "../controllers/user.controller";

import { authMiddleware }
from "../middlewares/auth.middleware";

import { upload }
from "../middlewares/upload.middleware";

const router = Router();

router.patch(
  "/profile",
  authMiddleware,
  updateProfile
);

router.patch(
  "/profile-picture",
  authMiddleware,
  upload.single("image"),
  uploadProfilePicture
);

router.patch(
  "/change-password",
  authMiddleware,
  changePassword
);

export default router;