import nodemailer from "nodemailer";
import dotenv from "dotenv";

// ==========================================
// NODEMAILER TRANSPORTER (Gmail)
// ==========================================
const createTransporter = () => {
  dotenv.config();
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : "",
      pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, "") : "",
    },
  });
};

// ==========================================
// SEND EMAIL (Core Function)
// ==========================================
export const sendEmail = async ({ to, subject, html }) => {
  dotenv.config();
  const emailUser = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : "";
  const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, "") : "";

  if (!emailUser || !emailPass) {
    console.warn(
      `⚠️ Email to ${to} skipped: EMAIL_USER or EMAIL_PASS is missing in Backend/.env file.\n` +
      `👉 Please add EMAIL_USER=yourgmail@gmail.com and EMAIL_PASS=16_digit_app_password to Backend/.env`
    );
    return { success: false, error: "EMAIL_USER or EMAIL_PASS not configured in .env" };
  }

  try {
    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: `"DestinyGurukul" <${emailUser}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${to} | MessageId: ${info.messageId}`);
    return { success: true };
  } catch (err) {
    console.error(`❌ Email sending failed to ${to}:`, err.message);
    if (err.message.includes("Invalid login")) {
      console.log("💡 TIP: Please make sure EMAIL_PASS is a 16-character Gmail App Password (https://myaccount.google.com/apppasswords).");
    }
    return { success: false, error: err.message };
  }
};

// ==========================================
// EMAIL TEMPLATES
// ==========================================

// Base HTML wrapper (branded)
const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body { margin: 0; padding: 0; background: #f4f6fb; font-family: 'Segoe UI', Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px 40px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { color: #c7d2fe; margin: 6px 0 0; font-size: 13px; }
    .body { padding: 36px 40px; color: #374151; }
    .body h2 { font-size: 20px; color: #111827; margin: 0 0 12px; }
    .body p { font-size: 15px; line-height: 1.7; color: #4b5563; margin: 0 0 16px; }
    .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; margin: 10px 0 20px; }
    .info-box { background: #f8faff; border: 1px solid #e0e7ff; border-radius: 10px; padding: 16px 20px; margin: 16px 0; }
    .info-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; color: #6b7280; }
    .info-row:last-child { margin-bottom: 0; }
    .info-val { font-weight: 600; color: #111827; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
    .badge-yellow { background: #fef9c3; color: #854d0e; }
    .badge-green { background: #dcfce7; color: #166534; }
    .badge-red { background: #fee2e2; color: #991b1b; }
    .badge-blue { background: #dbeafe; color: #1e40af; }
    .footer { background: #f9fafb; border-top: 1px solid #f0f0f0; padding: 20px 40px; text-align: center; font-size: 12px; color: #9ca3af; }
    .footer a { color: #6366f1; text-decoration: none; }
    .divider { height: 1px; background: #f0f0f0; margin: 24px 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🎓 DestinyGurukul</h1>
      <p>Bhopal's Trusted Home Tutor Platform</p>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} DestinyGurukul, Bhopal. All rights reserved.</p>
      <p>This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

// ==========================================
// 1. FORGOT PASSWORD EMAIL
// ==========================================
export const forgotPasswordEmail = ({ name, resetUrl }) =>
  baseTemplate(`
    <h2>Reset Your Password 🔐</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>We received a request to reset the password for your DestinyGurukul account. Click the button below to create a new password:</p>
    <div style="text-align:center; margin: 28px 0;">
      <a href="${resetUrl}" class="btn">Reset My Password</a>
    </div>
    <p style="font-size:13px; color:#6b7280;">⏰ This link will expire in <strong>15 minutes</strong>.</p>
    <div class="divider"></div>
    <p style="font-size:13px; color:#9ca3af;">If you didn't request this, you can safely ignore this email. Your password won't change.</p>
    <p style="font-size:13px; color:#9ca3af;">Or copy this link: <a href="${resetUrl}" style="color:#6366f1; word-break:break-all;">${resetUrl}</a></p>
  `);

// ==========================================
// 2. BOOKING REQUEST (To Teacher)
// ==========================================
export const bookingRequestEmail = ({ tutorName, studentName, subject, date, time, message }) =>
  baseTemplate(`
    <h2>New Booking Request 📚</h2>
    <p>Hello <strong>${tutorName}</strong>,</p>
    <p>You have received a new booking request on DestinyGurukul!</p>
    <div class="info-box">
      <div class="info-row"><span>Student</span><span class="info-val">${studentName}</span></div>
      <div class="info-row"><span>Subject</span><span class="info-val">${subject}</span></div>
      <div class="info-row"><span>Preferred Date</span><span class="info-val">${date}</span></div>
      <div class="info-row"><span>Preferred Time</span><span class="info-val">${time}</span></div>
      ${message ? `<div class="info-row"><span>Message</span><span class="info-val">${message}</span></div>` : ""}
    </div>
    <p>Please login to your dashboard to <strong>Accept or Reject</strong> this request.</p>
    <div style="text-align:center; margin: 24px 0;">
      <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/teaching-requests" class="btn">View Booking Request</a>
    </div>
  `);

// ==========================================
// 3. BOOKING ACCEPTED (To Student)
// ==========================================
export const bookingAcceptedEmail = ({ studentName, tutorName, subject, date, time, tutorPhone }) =>
  baseTemplate(`
    <h2>Booking Confirmed! 🎉</h2>
    <p>Hi <strong>${studentName}</strong>,</p>
    <p>Great news! Your booking request has been <span class="badge badge-green">✓ Accepted</span> by your tutor.</p>
    <div class="info-box">
      <div class="info-row"><span>Tutor</span><span class="info-val">${tutorName}</span></div>
      <div class="info-row"><span>Subject</span><span class="info-val">${subject}</span></div>
      <div class="info-row"><span>Date</span><span class="info-val">${date}</span></div>
      <div class="info-row"><span>Time</span><span class="info-val">${time}</span></div>
      ${tutorPhone ? `<div class="info-row"><span>Tutor Contact</span><span class="info-val">${tutorPhone}</span></div>` : ""}
    </div>
    <p>You can contact your tutor to confirm the session details. Best of luck with your studies! 📖</p>
    <div style="text-align:center; margin: 24px 0;">
      <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/my-booking" class="btn">View My Bookings</a>
    </div>
  `);

// ==========================================
// 4. BOOKING REJECTED (To Student)
// ==========================================
export const bookingRejectedEmail = ({ studentName, tutorName, subject }) =>
  baseTemplate(`
    <h2>Booking Update 📋</h2>
    <p>Hi <strong>${studentName}</strong>,</p>
    <p>Unfortunately, your booking request for <strong>${subject}</strong> with <strong>${tutorName}</strong> has been <span class="badge badge-red">✗ Declined</span>.</p>
    <p>Don't worry — there are many other qualified tutors available on DestinyGurukul!</p>
    <div style="text-align:center; margin: 24px 0;">
      <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/find-tutors" class="btn">Find Another Tutor</a>
    </div>
  `);

// ==========================================
// 5. BOOKING COMPLETED (To Student)
// ==========================================
export const bookingCompletedEmail = ({ studentName, tutorName, subject }) =>
  baseTemplate(`
    <h2>Session Completed! ⭐</h2>
    <p>Hi <strong>${studentName}</strong>,</p>
    <p>Your tutoring session for <strong>${subject}</strong> with <strong>${tutorName}</strong> has been marked as <span class="badge badge-blue">✓ Completed</span>.</p>
    <p>We'd love to hear your feedback! Please take a moment to rate your tutor — it helps other students find the best tutors.</p>
    <div style="text-align:center; margin: 24px 0;">
      <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/my-booking" class="btn">Rate Your Tutor ⭐</a>
    </div>
  `);

// ==========================================
// 6. TUTOR APPLICATION APPROVED (To Tutor)
// ==========================================
export const tutorApprovedEmail = ({ tutorName }) =>
  baseTemplate(`
    <h2>Congratulations! You're Approved 🎓</h2>
    <p>Dear <strong>${tutorName}</strong>,</p>
    <p>We are thrilled to inform you that your tutor application on DestinyGurukul has been <span class="badge badge-green">✓ Approved</span>!</p>
    <p>You can now:</p>
    <ul style="color:#4b5563; font-size:14px; line-height:2;">
      <li>Receive booking requests from students</li>
      <li>Manage your teaching schedule</li>
      <li>Appear in tutor search results</li>
    </ul>
    <div style="text-align:center; margin: 24px 0;">
      <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/register" class="btn">Create Your Account & Start Teaching</a>
    </div>
    <p style="font-size:13px; color:#6b7280;">Register with the same email you used in your application.</p>
  `);

// ==========================================
// 7. TUTOR APPLICATION REJECTED (To Tutor)
// ==========================================
export const tutorRejectedEmail = ({ tutorName, reason }) =>
  baseTemplate(`
    <h2>Application Status Update</h2>
    <p>Dear <strong>${tutorName}</strong>,</p>
    <p>After review, your tutor application on DestinyGurukul has been <span class="badge badge-red">✗ Not Approved</span> at this time.</p>
    ${reason ? `
    <div class="info-box">
      <p style="margin:0; font-size:14px;"><strong>Reason:</strong> ${reason}</p>
    </div>` : ""}
    <p>You may re-apply after making the necessary improvements. We appreciate your interest!</p>
    <div style="text-align:center; margin: 24px 0;">
      <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/become-a-tutor" class="btn">Apply Again</a>
    </div>
  `);

// ==========================================
// 8. OFFLINE INTERVIEW SCHEDULED (To Tutor)
// ==========================================
export const offlineInterviewScheduledEmail = ({
  tutorName,
  interviewDate,
  interviewTime,
  interviewLocation,
  instructions,
}) =>
  baseTemplate(`
    <h2>Offline Interview Scheduled 🗓️</h2>
    <p>Dear <strong>${tutorName}</strong>,</p>
    <p>Congratulations! Your application to become a tutor at <strong>DestinyGurukul</strong> has been shortlisted for an offline interview.</p>
    <p>Your offline interview details are as follows:</p>
    <div class="info-box">
      <div class="info-row"><span>Mode</span><span class="info-val">Offline (In-Person)</span></div>
      <div class="info-row"><span>Interview Date</span><span class="info-val">${interviewDate}</span></div>
      <div class="info-row"><span>Interview Time</span><span class="info-val">${interviewTime}</span></div>
      <div class="info-row"><span>Interview Location</span><span class="info-val">${interviewLocation || "DestinyGurukul Office, Indore"}</span></div>
    </div>
    <div style="background:#fefce8; border:1px solid #fef08a; border-radius:10px; padding:14px 18px; margin:16px 0; font-size:14px; color:#854d0e;">
      <strong>📌 Instructions:</strong> ${
        instructions ||
        "Please arrive 10–15 minutes before your scheduled interview time and bring your updated resume and relevant educational documents."
      }
    </div>
    <p>Please arrive 10–15 minutes before your scheduled interview time and bring your resume and relevant educational documents.</p>
    <p>If you have any questions or need assistance, please feel free to reach out to our team.</p>
    <p style="margin-top:24px; font-weight:600; color:#374151;">Best regards,<br/>DestinyGurukul Team</p>
  `);

// ==========================================
// 9. OFFLINE INTERVIEW RESCHEDULED (To Tutor)
// ==========================================
export const offlineInterviewRescheduledEmail = ({
  tutorName,
  interviewDate,
  interviewTime,
  interviewLocation,
  instructions,
}) =>
  baseTemplate(`
    <h2>Interview Rescheduled 📅</h2>
    <p>Dear <strong>${tutorName}</strong>,</p>
    <p>Your offline interview schedule at <strong>DestinyGurukul</strong> has been updated. Please note your revised interview schedule:</p>
    <div class="info-box">
      <div class="info-row"><span>Mode</span><span class="info-val">Offline (In-Person)</span></div>
      <div class="info-row"><span>New Date</span><span class="info-val">${interviewDate}</span></div>
      <div class="info-row"><span>New Time</span><span class="info-val">${interviewTime}</span></div>
      <div class="info-row"><span>Location</span><span class="info-val">${interviewLocation || "DestinyGurukul Office, Indore"}</span></div>
    </div>
    <div style="background:#fefce8; border:1px solid #fef08a; border-radius:10px; padding:14px 18px; margin:16px 0; font-size:14px; color:#854d0e;">
      <strong>📌 Instructions:</strong> ${
        instructions ||
        "Please arrive 10–15 minutes before your scheduled interview time and bring your resume and relevant educational documents."
      }
    </div>
    <p>Please arrive on time with your relevant documents.</p>
    <p style="margin-top:24px; font-weight:600; color:#374151;">Best regards,<br/>DestinyGurukul Team</p>
  `);
