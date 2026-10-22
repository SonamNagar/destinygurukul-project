import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const isCloudinaryConfigured = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (apiSecret && apiSecret.includes("*")) {
    console.warn("⚠️ Warning: CLOUDINARY_API_SECRET contains asterisks ('*'). Please paste your real API Secret from Cloudinary console.");
    return false;
  }

  return Boolean(cloudName && apiKey && apiSecret);
};

export default cloudinary;
