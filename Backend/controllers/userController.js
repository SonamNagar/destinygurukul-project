import User from "../models/User.js";
import BecomeTutor from "../models/BecomeTutor.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// ==========================================
// REGISTER USER
// ==========================================
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber, photo } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "This email is already registered.",
      });
    }

    // Check if approved tutor application exists for this email
    const approvedTutor = await BecomeTutor.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
      status: "approved",
    });

    const role = approvedTutor ? "teacher" : "student";

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: password,
      phoneNumber: phoneNumber || "",
      photo: photo || "",
      role: role,
    });

    res.status(201).json({
      message: "User registered successfully",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        photo: user.photo,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// LOGIN USER
// ==========================================
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Password comparison User model ke method se hoga
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid password.",
      });
    }

    // ==========================================
    // ACCESS TOKEN (15 min)
    // ==========================================
    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    // ==========================================
    // REFRESH TOKEN (7 days)
    // ==========================================
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const isProduction = process.env.NODE_ENV === "production";

    // ==========================================
    // SET httpOnly COOKIES (XSS safe)
    // ==========================================
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        photo: user.photo,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// REFRESH ACCESS TOKEN
// ==========================================
export const refreshAccessToken = async (req, res, next) => {
  try {
    // Cookie se refreshToken lo (httpOnly)
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const newAccessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Naya accessToken cookie mein set karo
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      message: "Token refreshed successfully",
    });
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};

// ==========================================
// LOGOUT USER
// ==========================================
export const logoutUser = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

// ==========================================
// GET USER PROFILE
// ==========================================
export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      photo: user.photo,
      city: user.city || "",
      qualification: user.qualification || "",
      address: user.address || "",
      bio: user.bio || "",
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// UPDATE USER PROFILE
// ==========================================
export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { name, phoneNumber, photo, city, qualification, address, bio } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name) user.name = name.trim();
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (photo !== undefined) user.photo = photo;
    if (city !== undefined) user.city = city;
    if (qualification !== undefined) user.qualification = qualification;
    if (address !== undefined) user.address = address;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        photo: user.photo,
        city: user.city,
        qualification: user.qualification,
        address: user.address,
        bio: user.bio,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// FORGOT PASSWORD
// ==========================================
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email address is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        message: "No user account found with this email",
      });
    }

    // Generate random 20-byte hex token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token & set expiry (15 minutes from now)
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    // Construct reset URL for frontend
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const isDev = process.env.NODE_ENV !== "production";

    res.status(200).json({
      message: "Password reset link generated. Please check your email or use the link.",
      ...(isDev && { resetToken, resetUrl }),
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// RESET PASSWORD
// ==========================================
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long",
      });
    }

    // Hash parameter token to compare with DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired password reset token",
      });
    }

    // Update password (pre-save hook will hash it)
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.status(200).json({
      message: "Password has been reset successfully. You can now login.",
    });
  } catch (err) {
    next(err);
  }
};