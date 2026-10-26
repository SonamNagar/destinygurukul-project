
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    // 1. Environment variables
    const {
      MONGO_URI,
      ADMIN_NAME,
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
      ADMIN_PHONE,
    } = process.env;

    // 2. Validate required variables
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Admin details are missing in .env");
    }

    // Minimum password length validation (relaxed to 8 characters for admin setup)
    if (ADMIN_PASSWORD.length < 8) {
      throw new Error(
        "ADMIN_PASSWORD must contain at least 8 characters."
      );
    }

    // 3. Connect to MongoDB
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected successfully.");

    // 4. Normalize email
    const email = ADMIN_EMAIL.toLowerCase().trim();

    // 5. Check existing user
    // 5. Check existing user
const existingUser = await User.findOne({ email }).select("+password");

if (existingUser) {
  // Promote user to admin
  existingUser.role = "admin";

  // Update admin details
  existingUser.name = ADMIN_NAME;

  // Set new password
  existingUser.password = ADMIN_PASSWORD;

  // Save changes; User.js pre-save hook will hash the password
  await existingUser.save();

  console.log("Existing user updated successfully.");
  console.log("Admin role and password updated.");
} else {
  // 6. Create new Admin
  await User.create({
    name: ADMIN_NAME,
    email,
    password: ADMIN_PASSWORD,
    role: "admin",
    ...(ADMIN_PHONE ? { phoneNumber: ADMIN_PHONE } : {}),
  });

  console.log("Admin created successfully.");
}


    console.log("Admin created successfully.");
  } catch (error) {
    console.error("Admin seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    // 7. Close MongoDB connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

seedAdmin();
