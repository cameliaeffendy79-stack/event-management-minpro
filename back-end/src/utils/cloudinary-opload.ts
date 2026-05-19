import cloudinary from "../lib/cloudinary";

import streamifier from "streamifier";

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string
): Promise<string> => {
  return new Promise<string>(
    (resolve, reject) => {
      const stream =
        cloudinary.uploader.upload_stream(
          {
            folder,
          },

          (error, result) => {
            if (error) {
              reject(error);

              return;
            }

            if (!result) {
              reject(
                new Error(
                  "Upload failed"
                )
              );

              return;
            }

            resolve(result.secure_url);
          }
        );

      streamifier
        .createReadStream(fileBuffer)
        .pipe(stream);
    }
  );
};