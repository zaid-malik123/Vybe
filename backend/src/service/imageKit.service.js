import ImageKit from "imagekit";
import dotenv from "dotenv"
dotenv.config()

var imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.URL_END_POINT,
});

export const uploadImage = (img) => {
  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file: img.buffer,
        fileName: img.originalname,
        folder: "Vybe",
      },
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};