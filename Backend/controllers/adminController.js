import BecomeTutor from "../models/BecomeTutor.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";
import {
  sendEmail,
  tutorApprovedEmail,
  tutorRejectedEmail,
  offlineInterviewScheduledEmail,
  offlineInterviewRescheduledEmail,
} from "../utils/emailService.js";

// ===============================
// GET ALL TUTORS / APPLICATIONS
// ===============================
export const getAllTutors = async (req, res) => {
  try {
    const tutors = await BecomeTutor.find().sort({ createdAt: -1 });
    res.status(200).json(tutors);
  } catch (err) {
    console.log("getAllTutors error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

// ===============================
// GET PENDING APPLICATIONS
// ===============================
export const getPendingApplications = async (req, res) => {
  try {
    const tutors = await BecomeTutor.find({
      status: { $in: ["pending", "interview_scheduled"] },
    }).sort({ createdAt: -1 });

    res.status(200).json(tutors);
  } catch (err) {
    console.log("getPendingApplications error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

// ===============================
// SCHEDULE OFFLINE INTERVIEW
// ===============================
export const scheduleOfflineInterview = async (req, res) => {
  try {
    const { interviewDate, interviewTime, interviewLocation, instructions } = req.body;

    if (!interviewDate || !interviewTime) {
      return res.status(400).json({
        message: "Interview date and time are required.",
      });
    }

    const tutor = await BecomeTutor.findById(req.params.id);

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    const location = interviewLocation || "DestinyGurukul Office, Indore";
    const defaultInstructions =
      instructions ||
      "Please arrive 10–15 minutes before your scheduled interview time and bring your updated resume and relevant educational documents.";

    tutor.status = "interview_scheduled";
    tutor.interview = {
      status: "scheduled",
      date: interviewDate,
      time: interviewTime,
      location: location,
      instructions: defaultInstructions,
      scheduledAt: new Date(),
    };

    tutor.notification = `🗓️ Your offline interview is scheduled for ${interviewDate} at ${interviewTime} at ${location}. Check your email for full details.`;

    await tutor.save();

    // Create in-app Notification
    await Notification.create({
      recipientEmail: tutor.email,
      message: `🗓️ Offline Interview Scheduled: You are invited for an interview on ${interviewDate} at ${interviewTime} at ${location}.`,
      type: "booking",
    }).catch((err) => console.log("Notification create error:", err));

    // Send Email to Tutor
    sendEmail({
      to: tutor.email,
      subject: `🗓️ Offline Interview Scheduled — DestinyGurukul (${interviewDate})`,
      html: offlineInterviewScheduledEmail({
        tutorName: tutor.name,
        interviewDate,
        interviewTime,
        interviewLocation: location,
        instructions: defaultInstructions,
      }),
    }).catch((err) => console.log("Email error:", err));

    res.status(200).json({
      message: "Offline interview scheduled and confirmation email sent to tutor.",
      tutor,
    });
  } catch (err) {
    console.log("scheduleOfflineInterview error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

// ===============================
// SUBMIT INTERVIEW RESULT & EVALUATION
// ===============================
export const submitInterviewResult = async (req, res) => {
  try {
    const {
      decision, // 'approve' | 'reject' | 'reschedule'
      subjectKnowledge,
      communicationSkills,
      teachingSkills,
      confidence,
      remarks,
      rejectionReason,
      newDate,
      newTime,
      newLocation,
      newInstructions,
    } = req.body;

    if (!["approve", "reject", "reschedule"].includes(decision)) {
      return res.status(400).json({
        message: "Invalid decision. Must be approve, reject, or reschedule.",
      });
    }

    const tutor = await BecomeTutor.findById(req.params.id);

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    // Save Evaluation
    if (!tutor.interview) tutor.interview = {};
    tutor.interview.evaluation = {
      subjectKnowledge: Number(subjectKnowledge) || 5,
      communicationSkills: Number(communicationSkills) || 5,
      teachingSkills: Number(teachingSkills) || 5,
      confidence: Number(confidence) || 5,
      remarks: remarks || "",
      evaluatedAt: new Date(),
    };

    const normalizedEmail = (tutor.email || "").toLowerCase().trim();

    // 1. APPROVE
    if (decision === "approve") {
      tutor.status = "approved";
      tutor.interview.status = "completed";
      tutor.verifiedBadge = true;
      tutor.identityVerified = true;
      tutor.qualificationVerified = true;
      tutor.notification =
        "🎉 Congratulations! You have successfully cleared the offline interview and your tutor application is approved.";
      tutor.rejectionReason = "";

      await tutor.save();

      // Update matching user account role to 'teacher'
      const user = await User.findOne({
        email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
      });
      if (user) {
        user.role = "teacher";
        await user.save();
      }

      // Create Notification
      await Notification.create({
        recipientEmail: tutor.email,
        message:
          "🎉 Congratulations! You passed the offline interview and are now an approved tutor on DestinyGurukul.",
        type: "booking",
      }).catch((err) => console.log("Notification create error:", err));

      // Send Approval Email
      sendEmail({
        to: tutor.email,
        subject: "🎉 Congratulations! Application Approved — DestinyGurukul",
        html: tutorApprovedEmail({ tutorName: tutor.name }),
      }).catch((err) => console.log("Email error:", err));

      return res.status(200).json({
        message: "Tutor evaluated and approved successfully. Approval email sent.",
        tutor,
      });
    }

    // 2. REJECT
    if (decision === "reject") {
      const reason =
        rejectionReason || remarks || "Application not approved after interview evaluation.";
      tutor.status = "rejected";
      tutor.interview.status = "completed";
      tutor.rejectionReason = reason;
      tutor.notification = `Your tutor application was not approved after the interview. Reason: ${reason}`;

      await tutor.save();

      // Create Notification
      await Notification.create({
        recipientEmail: tutor.email,
        message: `Your tutor application was not approved after interview. Reason: ${reason}`,
        type: "booking",
      }).catch((err) => console.log("Notification create error:", err));

      // Send Rejection Email
      sendEmail({
        to: tutor.email,
        subject: "DestinyGurukul Tutor Application Status Update",
        html: tutorRejectedEmail({
          tutorName: tutor.name,
          reason,
        }),
      }).catch((err) => console.log("Email error:", err));

      return res.status(200).json({
        message: "Tutor interview rejected. Rejection email sent.",
        tutor,
      });
    }

    // 3. RESCHEDULE
    if (decision === "reschedule") {
      if (!newDate || !newTime) {
        return res.status(400).json({
          message: "New interview date and time are required for rescheduling.",
        });
      }

      const location = newLocation || tutor.interview.location || "DestinyGurukul Office, Indore";
      const instructions =
        newInstructions ||
        tutor.interview.instructions ||
        "Please arrive 10–15 minutes before your scheduled interview time.";

      tutor.status = "interview_scheduled";
      tutor.interview.status = "rescheduled";
      tutor.interview.date = newDate;
      tutor.interview.time = newTime;
      tutor.interview.location = location;
      tutor.interview.instructions = instructions;
      tutor.notification = `📅 Your offline interview has been rescheduled to ${newDate} at ${newTime} at ${location}.`;

      await tutor.save();

      // Create Notification
      await Notification.create({
        recipientEmail: tutor.email,
        message: `📅 Your interview has been rescheduled to ${newDate} at ${newTime} at ${location}.`,
        type: "booking",
      }).catch((err) => console.log("Notification create error:", err));

      // Send Reschedule Email
      sendEmail({
        to: tutor.email,
        subject: `📅 Offline Interview Rescheduled — DestinyGurukul (${newDate})`,
        html: offlineInterviewRescheduledEmail({
          tutorName: tutor.name,
          interviewDate: newDate,
          interviewTime: newTime,
          interviewLocation: location,
          instructions,
        }),
      }).catch((err) => console.log("Email error:", err));

      return res.status(200).json({
        message: "Interview rescheduled successfully and updated email sent to tutor.",
        tutor,
      });
    }
  } catch (err) {
    console.log("submitInterviewResult error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

// ===============================
// APPROVE / REJECT TUTOR (DIRECT)
// ===============================
export const updateTutorStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (status !== "approved" && status !== "rejected") {
      return res.status(400).json({
        message: "Status must be approved or rejected",
      });
    }

    const tutor = await BecomeTutor.findById(req.params.id);

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    const normalizedEmail = (tutor.email || "").toLowerCase().trim();

    // APPROVE
    if (status === "approved") {
      const user = await User.findOne({
        email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
      });

      if (user) {
        user.role = "teacher";
        await user.save();
      }

      tutor.status = "approved";
      tutor.verifiedBadge = req.body.verifiedBadge !== undefined ? req.body.verifiedBadge : true;
      tutor.identityVerified = req.body.identityVerified !== undefined ? req.body.identityVerified : true;
      tutor.qualificationVerified = req.body.qualificationVerified !== undefined ? req.body.qualificationVerified : true;
      tutor.notification =
        "🎉 Your tutor application has been approved. You can now start teaching.";
      tutor.rejectionReason = "";

      await tutor.save();

      // Send Nodemailer Email
      sendEmail({
        to: tutor.email,
        subject: "🎉 Application Approved! Welcome to DestinyGurukul",
        html: tutorApprovedEmail({ tutorName: tutor.name }),
      }).catch((err) => console.log("Email error:", err));
    }

    // REJECT
    if (status === "rejected") {
      tutor.status = "rejected";
      tutor.rejectionReason =
        rejectionReason || "Application rejected by admin.";
      tutor.notification = `Your tutor application has been rejected. Reason: ${tutor.rejectionReason}`;

      await tutor.save();

      // Send Nodemailer Email
      sendEmail({
        to: tutor.email,
        subject: "DestinyGurukul Tutor Application Status Update",
        html: tutorRejectedEmail({
          tutorName: tutor.name,
          reason: tutor.rejectionReason,
        }),
      }).catch((err) => console.log("Email error:", err));
    }

    res.status(200).json({
      message:
        status === "approved"
          ? "Tutor approved successfully"
          : "Tutor rejected successfully",
      tutor,
    });
  } catch (err) {
    console.log("updateTutorStatus error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

// ===============================
// ADMIN DASHBOARD STATS
// ===============================
export const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalTutors = await BecomeTutor.countDocuments();

    const approvedTutors = await BecomeTutor.countDocuments({
      status: "approved",
    });

    const pendingApplications = await BecomeTutor.countDocuments({
      status: "pending",
    });

    const scheduledInterviews = await BecomeTutor.countDocuments({
      status: "interview_scheduled",
    });

    const totalBookings = await Booking.countDocuments();

    const acceptedBookings = await Booking.countDocuments({
      status: "accepted",
    });

    const pendingBookings = await Booking.countDocuments({
      status: "pending",
    });

    const rejectedBookings = await Booking.countDocuments({
      status: "rejected",
    });

    res.status(200).json({
      totalStudents,
      totalTutors,
      approvedTutors,
      pendingApplications,
      scheduledInterviews,
      totalBookings,
      acceptedBookings,
      pendingBookings,
      rejectedBookings,
    });
  } catch (err) {
    console.log("getAdminStats error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};