import multer from "multer";
import { Request } from "express";

// ✅ Simpan file di memory
const storage = multer.memoryStorage();

// ✅ Filter hanya image
function fileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  if (
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "File harus berupa gambar"
      )
    );
  }
}

// ✅ Multer config
export const upload = multer({
  storage,

  limits: {
    // maksimal 5MB
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter,
});