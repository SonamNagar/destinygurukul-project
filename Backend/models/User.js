import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // ==========================================
    // NAME
    // ==========================================
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long."],
      maxlength: [50, "Name cannot exceed 50 characters."],
    },

    // ==========================================
    // EMAIL
    // ==========================================
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,

      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address.",
      ],
    },

    // ==========================================
    // PASSWORD
    // ==========================================
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [6, "Password must be at least 6 characters long."],
      select: false,
    },

    // ==========================================
    // PHONE NUMBER
    // ==========================================
    phoneNumber: {
      type: String,
      default: "",
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^[6-9]\d{9}$/.test(v);
        },
        message: "Please enter a valid 10-digit Indian phone number.",
      },
    },

    // ==========================================
    // PHOTO
    // ==========================================
    photo: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // ROLE
    // ==========================================
    role: {
      type: String,
      enum: {
        values: ["student", "teacher", "admin"],
        message: "Role must be student, teacher or admin.",
      },
      default: "student",
      index: true,
    },

    // ==========================================
    // PASSWORD RESET
    // ==========================================
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpire: {
      type: Date,
      default: null,
    },

    // ==========================================
    // EXTENDED PROFILE
    // ==========================================
    city: {
      type: String,
      default: "",
      trim: true,
    },
    qualification: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters."],
    },
  },

  {
    timestamps: true,

    // ==========================================
    // HIDE PASSWORD FROM JSON RESPONSE
    // ==========================================
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },

    // ==========================================
    // HIDE PASSWORD FROM OBJECT
    // ==========================================
    toObject: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);


// ==========================================
// PASSWORD HASHING
// ==========================================

userSchema.pre("save", async function () {
  // Password change nahi hua
  // to dobara hash nahi karna
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// ==========================================
// PASSWORD COMPARE
// ==========================================

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(
    password,
    this.password
  );
};


// ==========================================
// CREATE USER MODEL
// ==========================================

const User = mongoose.model("User", userSchema);

export default User;