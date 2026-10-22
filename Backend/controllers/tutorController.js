import BecomeTutor from "../models/BecomeTutor.js";
import User from "../models/User.js";

// ==========================================
// GET ALL TUTORS / APPLICATIONS
// ==========================================
export const getAllTutors = async (req, res) => {
  try {
    // Only return approved tutors for public directory
    const filter = { status: "approved" };

    // If authenticated admin, allow querying all or by status
    if (req.user && req.user.role === "admin" && req.query.status) {
      filter.status = req.query.status;
    }

    const tutors = await BecomeTutor.find(filter)
      .select("-certificate -rejectionReason")
      .sort({ createdAt: -1 });

    res.status(200).json(tutors);
  } catch (error) {
    console.log("getAllTutors error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllTutor = getAllTutors;

// ==========================================
// GET SINGLE TUTOR BY ID
// ==========================================
export const getTutorById = async (req, res) => {
  try {
    const tutor = await BecomeTutor.findById(req.params.id);

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    res.status(200).json(tutor);
  } catch (error) {
    console.log("getTutorById error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSingleTutor = getTutorById;

// ==========================================
// CREATE TUTOR APPLICATION
// ==========================================
export const createTutor = async (req, res) => {
  try {
    const tutor = new BecomeTutor({
      ...req.body,
      status: "pending",
      notification:
        "Your tutor application has been submitted and is waiting for admin approval.",
    });

    await tutor.save();

    res.status(201).json({
      message: "Tutor application submitted successfully",
      tutor,
    });
  } catch (error) {
    console.log("createTutor error:", error);

    // Duplicate email check
    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "This email is already registered. Please use another email.",
      });
    }

    res.status(400).json({
      message: error.message,
    });
  }
};

export const addBecomeTutor = createTutor;

// ==========================================
// UPDATE TUTOR
// ==========================================
export const updateTutor = async (req, res) => {
  try {
    const tutor = await BecomeTutor.findById(req.params.id);

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    // Authorization: User must be an admin OR the tutor themselves
    const isOwner =
      req.user &&
      req.user.email?.toLowerCase() === tutor.email?.toLowerCase();
    const isAdmin = req.user && req.user.role === "admin";

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: "You are not authorized to update this tutor profile.",
      });
    }

    // If not admin, prevent tampering with status or verification badges
    const updates = { ...req.body };
    if (!isAdmin) {
      delete updates.status;
      delete updates.verifiedBadge;
      delete updates.identityVerified;
      delete updates.qualificationVerified;
      delete updates.rejectionReason;
    }

    Object.assign(tutor, updates);
    await tutor.save();

    res.status(200).json(tutor);
  } catch (error) {
    console.log("updateTutor error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

// ==========================================
// DELETE TUTOR
// ==========================================
export const deleteTutor = async (req, res) => {
  try {
    const tutor = await BecomeTutor.findById(req.params.id);

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    const isOwner =
      req.user &&
      req.user.email?.toLowerCase() === tutor.email?.toLowerCase();
    const isAdmin = req.user && req.user.role === "admin";

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: "You are not authorized to delete this tutor profile.",
      });
    }

    await BecomeTutor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Tutor deleted successfully",
    });
  } catch (error) {
    console.log("deleteTutor error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// GET TUTOR BY EMAIL
// ==========================================
export const getTutorByEmail = async (req, res) => {
  try {
    const tutor = await BecomeTutor.findOne({
      email: req.params.email,
    });

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor application not found",
      });
    }

    res.status(200).json(tutor);
  } catch (error) {
    console.log("getTutorByEmail error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const teacherDashboard = getTutorByEmail;

// ==========================================
// GET TUTOR STATS
// ==========================================
export const getTutorStats = async (req, res) => {
  try {
    const verifiedTutors = await BecomeTutor.countDocuments({
      status: "approved",
    });

    const happyStudents = await User.countDocuments({
      role: "student",
    });

    const subjects = await BecomeTutor.distinct("subject", {
      status: "approved",
    });

    // Real average rating DB se calculate karo
    const ratingResult = await BecomeTutor.aggregate([
      {
        $match: {
          status: "approved",
          numReviews: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    const averageRating =
      ratingResult.length > 0
        ? parseFloat(ratingResult[0].avgRating.toFixed(1))
        : 0;

    res.status(200).json({
      verifiedTutors,
      happyStudents,
      subjects: subjects.length,
      averageRating,
    });
  } catch (err) {
    console.log("getTutorStats error:", err);

    res.status(500).json({
      message: "Unable to get stats",
    });
  }
};


// ==========================================
// GET POPULAR SUBJECTS
// ==========================================
export const getPopularSubjects = async (req, res) => {
  try {
    const subjects = await BecomeTutor.aggregate([
      {
        $match: {
          status: "approved",
        },
      },

      {
        $group: {
          _id: "$subject",
          count: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          count: -1,
        },
      },

      {
        $limit: 8,
      },
    ]);

    const formatted = subjects.map((item) => ({
      name: item._id,
      tutorsCount: item.count,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.log("getPopularSubjects error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================================
// APPROVE TUTOR
// ==========================================
export const approveTutor = async (req, res) => {
  try {
    const tutor = await BecomeTutor.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        rejectionReason: "",
        notification:
          "Congratulations! Your tutor application has been approved. You can now start teaching.",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    res.status(200).json({
      message: "Tutor application approved successfully",
      tutor,
    });
  } catch (error) {
    console.log("approveTutor error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// REJECT TUTOR
// ==========================================
export const rejectTutor = async (req, res) => {
  try {
    const reason =
      req.body.reason || "Application rejected by admin.";

    const tutor = await BecomeTutor.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        rejectionReason: reason,
        notification:
          `Your tutor application was rejected. Reason: ${reason}`,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    res.status(200).json({
      message: "Tutor application rejected successfully",
      tutor,
    });
  } catch (error) {
    console.log("rejectTutor error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// ADD TUTOR REVIEW & RATING
// ==========================================
export const addTutorReview = async (req, res) => {
  try {
    const {
      rating,
      comment,
      studentName,
    } = req.body;

    // Validate rating
    if (
      !rating ||
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      return res.status(400).json({
        message: "Valid rating between 1 and 5 is required",
      });
    }

    // Find tutor
    const tutor = await BecomeTutor.findById(
      req.params.id
    );

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    // Reviewer name
    const reviewerName =
      studentName ||
      (req.user && req.user.name) ||
      "Student";

    // Student ID
    const studentId =
      (req.user &&
        (req.user.id || req.user._id)) ||
      null;

    // Create review
    const review = {
      studentId,
      studentName: reviewerName,
      rating: Number(rating),
      comment: comment || "",
      createdAt: new Date(),
    };

    // Add review
    tutor.reviews.push(review);

    // Update number of reviews
    tutor.numReviews = tutor.reviews.length;

    // Calculate average rating
    tutor.rating = Number(
      (
        tutor.reviews.reduce(
          (acc, item) => acc + item.rating,
          0
        ) / tutor.reviews.length
      ).toFixed(1)
    );

    // Save tutor
    await tutor.save();

    res.status(201).json({
      message: "Review added successfully",
      rating: tutor.rating,
      numReviews: tutor.numReviews,
      reviews: tutor.reviews,
    });
  } catch (error) {
    console.log("addTutorReview error:", error);

    res.status(500).json({
      message:
        error.message || "Failed to add review",
    });
  }
};
