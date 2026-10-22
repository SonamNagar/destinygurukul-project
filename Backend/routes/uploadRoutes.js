import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";
import fs from "fs";

const router = express.Router();

// Helper to stream upload file to Cloudinary
const uploadToCloudinary = (fileBuffer, fileName, mimetype) => {
  return new Promise((resolve, reject) => {
    const resourceType = mimetype.startsWith("image/") ? "image" : "auto";
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "destinygurukul_uploads",
        resource_type: resourceType,
        public_id: `${Date.now()}-${fileName.replace(/\.[^/.]+$/, "")}`,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// ==========================================
// UPLOAD SINGLE FILE (Cloudinary + Local Fallback)
// ==========================================
router.post("/single", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded. Please upload a valid image or document.",
      });
    }

    // Check if Cloudinary credentials are set in .env
    if (isCloudinaryConfigured()) {
      try {
        // Read file buffer from disk/multer
        const fileBuffer = fs.readFileSync(req.file.path);

        // Upload directly to Cloudinary CDN
        const cloudResult = await uploadToCloudinary(
          fileBuffer,
          req.file.originalname,
          req.file.mimetype
        );

        // Clean up temporary local file
        fs.unlink(req.file.path, () => {});

        return res.status(200).json({
          message: "File uploaded successfully to Cloudinary CDN",
          provider: "cloudinary",
          url: cloudResult.secure_url,
          filename: cloudResult.public_id,
          mimetype: req.file.mimetype,
          size: cloudResult.bytes,
        });
      } catch (cloudErr) {
        console.error("Cloudinary Upload Error:", cloudErr);
        // Fallback to local server URL if Cloudinary call fails
      }
    }

    // Local Server Fallback URL
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    res.status(200).json({
      message: "File uploaded successfully to Local Server",
      provider: "local",
      filename: req.file.filename,
      url: fileUrl,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  } catch (error) {
    console.error("Upload route error:", error);
    res.status(500).json({
      message: error.message || "File upload failed",
    });
  }
});

// ==========================================
// UPLOAD MULTIPLE FILES
// ==========================================
router.post("/multiple", upload.array("files", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "No files uploaded.",
      });
    }

    const isCloud = isCloudinaryConfigured();
    const fileResults = [];

    for (const file of req.files) {
      if (isCloud) {
        try {
          const fileBuffer = fs.readFileSync(file.path);
          const cloudResult = await uploadToCloudinary(
            fileBuffer,
            file.originalname,
            file.mimetype
          );
          fs.unlink(file.path, () => {});

          fileResults.push({
            provider: "cloudinary",
            filename: cloudResult.public_id,
            url: cloudResult.secure_url,
            mimetype: file.mimetype,
            size: cloudResult.bytes,
          });
          continue;
        } catch (err) {
          console.error("Cloudinary multiple upload error:", err);
        }
      }

      // Local fallback
      fileResults.push({
        provider: "local",
        filename: file.filename,
        url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        mimetype: file.mimetype,
        size: file.size,
      });
    }

    res.status(200).json({
      message: `${fileResults.length} files uploaded successfully`,
      files: fileResults,
    });
  } catch (error) {
    console.error("Upload multiple error:", error);
    res.status(500).json({
      message: error.message || "File upload failed",
    });
  }
});

export default router;
