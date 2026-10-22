import mongoose from "mongoose";

// ==========================================
// BHOPAL AREAS — Backend Validation
// ==========================================
const BHOPAL_AREAS = [
  "MP Nagar",
  "Arera Colony",
  "Habibganj",
  "TT Nagar",
  "New Market",
  "Kolar Road",
  "Shahpura",
  "Bairagarh",
  "Hoshangabad Road",
  "BHEL",
  "Misrod",
  "Ayodhya Nagar",
  "Govindpura",
  "Ashoka Garden",
  "Piplani",
  "Berasia Road",
  "Karond",
  "Bittan Market",
  "Nehru Nagar",
  "Trilanga",
];

const becomeTutorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    qualification: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      default: 0,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    subjects: {
      type: [String],
      default: [],
    },

    classes: {
      type: Number,
      required: true,
    },

    classesList: {
      type: [String],
      default: [],
    },

    fees: {
      type: Number,
      required: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      default: "Bhopal",
      enum: ["Bhopal"],
      index: true,
    },

    // Area in Bhopal
    area: {
      type: String,
      required: true,
      trim: true,
      enum: BHOPAL_AREAS,
      index: true,
    },

    time: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    about: {
      type: String,
      default: "",
    },

    photo: {
      type: String,
      default: "",
    },

    certificate: {
      type: String,
      default: "",
    },

    // Verification Badges
    verifiedBadge: {
      type: Boolean,
      default: false,
    },

    identityVerified: {
      type: Boolean,
      default: false,
    },

    qualificationVerified: {
      type: Boolean,
      default: false,
    },

    // Tutor Application Status
    status: {
      type: String,
      enum: ["pending", "interview_scheduled", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    // Offline Interview Details & Evaluation
    interview: {
      status: {
        type: String,
        enum: ["none", "scheduled", "completed", "rescheduled"],
        default: "none",
      },
      date: {
        type: String,
        default: "",
      },
      time: {
        type: String,
        default: "",
      },
      location: {
        type: String,
        default: "DestinyGurukul Office, Indore",
      },
      instructions: {
        type: String,
        default:
          "Please arrive 10–15 minutes before your scheduled interview time and bring your resume and relevant educational documents.",
      },
      scheduledAt: {
        type: Date,
      },
      evaluation: {
        subjectKnowledge: {
          type: Number,
          min: 1,
          max: 5,
        },
        communicationSkills: {
          type: Number,
          min: 1,
          max: 5,
        },
        teachingSkills: {
          type: Number,
          min: 1,
          max: 5,
        },
        confidence: {
          type: Number,
          min: 1,
          max: 5,
        },
        remarks: {
          type: String,
          default: "",
        },
        evaluatedAt: {
          type: Date,
        },
      },
    },

    // Rejection reason
    rejectionReason: {
      type: String,
      default: "",
    },

    // Notification for tutor
    notification: {
      type: String,
      default: "",
    },

    // Rating & Reviews
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    reviews: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        studentName: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          default: "",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index for fast queries (e.g. approved tutors by subject/area in Bhopal)
becomeTutorSchema.index({ status: 1, subject: 1, area: 1 });

const BecomeTutor = mongoose.model("BecomeTutor", becomeTutorSchema);

export default BecomeTutor;
