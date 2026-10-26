
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";

import {
  CheckCircle,
  Clock,
  XCircle,
  Bell,
  User,
  GraduationCap,
  BookOpen,
  MapPin,
  Star,
  Phone,
  IndianRupee,
  Calendar,
  Building2,
} from "lucide-react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import RatingStars from "../components/RatingStars";

export default function TeacherDashboard() {
  const navigate = useNavigate();

  // ==========================================
  // GET TEACHER DATA
  // ==========================================
  const fetchTeacher = async () => {
    const email = localStorage.getItem("teacherEmail");
    if (!email) {
      throw new Error("Teacher email not found. Please login first.");
    }
    const response = await api.get(
      `/tutors/email/${encodeURIComponent(email)}`
    );
    return response.data;
  };

  const { data: tutor, isLoading: loading, error: queryError } = useQuery({
    queryKey: ['teacherDashboard', localStorage.getItem("teacherEmail")],
    queryFn: fetchTeacher,
    retry: false
  });

  const error = queryError ? queryError.response?.data?.message || queryError.message || "Unable to load teacher details." : "";

  // ==========================================
  // LOADING SKELETON
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">

          {/* Header Skeleton */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-6">
            <div className="flex items-center gap-5">
              <Skeleton circle width={72} height={72} />
              <div>
                <Skeleton height={28} width={200} />
                <Skeleton height={18} width={140} className="mt-2" />
              </div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border shadow-sm p-6">
                <Skeleton circle width={48} height={48} className="mb-4" />
                <Skeleton height={28} width={40} />
                <Skeleton height={16} width={100} className="mt-2" />
              </div>
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
            <Skeleton height={24} width={200} className="mb-6" />
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <Skeleton height={16} width={80} className="mb-2" />
                  <Skeleton height={24} width={160} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-card shadow-lg rounded-2xl p-8 text-center max-w-md w-full border border-border">
          <XCircle size={55} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Unable to Load Dashboard
          </h2>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 bg-primary text-primary-foreground text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary text-primary-foreground transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!tutor) return null;

  const statusConfig = {
    pending: {
      bg: "bg-yellow-50 border-yellow-300",
      icon: <Clock size={40} className="text-yellow-600" />,
      iconBg: "bg-yellow-100",
      title: "Application Pending",
      titleColor: "text-yellow-700",
      desc: "Your tutor application is under review by our admin team.",
    },
    interview_scheduled: {
      bg: "bg-purple-50 border-purple-300",
      icon: <Calendar size={40} className="text-purple-600" />,
      iconBg: "bg-purple-100",
      title: "Offline Interview Scheduled 🗓️",
      titleColor: "text-purple-700",
      desc: "Congratulations! You have been shortlisted for an offline in-person interview.",
    },
    approved: {
      bg: "bg-green-50 border-green-300",
      icon: <CheckCircle size={40} className="text-green-600" />,
      iconBg: "bg-green-100",
      title: "Application Approved 🎉",
      titleColor: "text-green-700",
      desc: "Congratulations! You are now a verified tutor. Students can find and book you.",
    },
    rejected: {
      bg: "bg-red-50 border-red-300",
      icon: <XCircle size={40} className="text-red-600" />,
      iconBg: "bg-red-100",
      title: "Application Rejected",
      titleColor: "text-red-700",
      desc: "Your application was not approved.",
    },
  };

  const sc = statusConfig[tutor.status] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-background">

      {/* ====================================================
          HERO HEADER
      ==================================================== */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-violet-800 text-white px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-card/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                <GraduationCap size={32} />
              </div>
              <div>
                <p className="text-indigo-200 text-sm font-medium">Teacher Dashboard</p>
                <h1 className="text-3xl font-bold mt-0.5">Welcome, {tutor.name}</h1>
                <p className="text-indigo-200 text-sm mt-1">{tutor.email}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/teaching-requests")}
                className="flex items-center gap-2 bg-card text-primary px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-50 transition shadow-sm text-sm"
              >
                <BookOpen size={16} />
                Booking Requests
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ====================================================
            STATS GRID
        ==================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Star className="text-primary" size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {(tutor.rating || 0).toFixed(1)}
              </h2>
              <p className="text-muted-foreground text-sm">Avg. Rating</p>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <BookOpen className="text-green-600" size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {tutor.numReviews || 0}
              </h2>
              <p className="text-muted-foreground text-sm">Total Reviews</p>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
              <IndianRupee className="text-yellow-600" size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                ₹{tutor.fees || 0}
              </h2>
              <p className="text-muted-foreground text-sm">Fees/Month</p>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
              <Clock className="text-violet-600" size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {tutor.experience || 0}
              </h2>
              <p className="text-muted-foreground text-sm">Years Exp.</p>
            </div>
          </div>

        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ======= LEFT COLUMN ======= */}
          <div className="lg:col-span-2 space-y-6">

            {/* APPLICATION STATUS */}
            <div className={`bg-card rounded-2xl border shadow-sm p-6`}>
              <h2 className="text-xl font-bold text-foreground mb-5">Application Status</h2>

              <div className={`border-2 ${sc.bg} rounded-xl p-5`}>
                <div className="flex items-center gap-4">
                  <div className={`${sc.iconBg} p-3 rounded-xl`}>
                    {sc.icon}
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${sc.titleColor}`}>{sc.title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">{sc.desc}</p>
                    {tutor.status === "rejected" && tutor.rejectionReason && (
                      <p className="text-red-600 font-medium mt-2 text-sm">
                        Reason: {tutor.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* OFFLINE INTERVIEW DETAILS BOX */}
              {tutor.interview?.date && (
                <div className="mt-4 bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-purple-900 text-sm">
                    <Building2 size={18} className="text-purple-600" />
                    <span>In-Person Offline Interview Details</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                      <span className="text-muted-foreground block text-[10px]">Date & Time</span>
                      <strong className="text-foreground">
                        {tutor.interview.date} at {tutor.interview.time}
                      </strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                      <span className="text-muted-foreground block text-[10px]">Office Venue</span>
                      <strong className="text-foreground">{tutor.interview.location}</strong>
                    </div>
                  </div>
                  {tutor.interview.instructions && (
                    <p className="text-xs text-purple-800 mt-1">
                      <strong>Instructions:</strong> {tutor.interview.instructions}
                    </p>
                  )}
                </div>
              )}

              {tutor.status === "approved" && (
                <div className="mt-4 bg-green-600 text-white rounded-xl p-4 flex items-center gap-4">
                  <GraduationCap size={36} />
                  <div>
                    <p className="font-bold text-lg">🎉 You Can Start Teaching!</p>
                    <p className="text-green-100 text-sm mt-0.5">
                      Students can now find and book you on DestinyGurukul.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE INFO */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <h2 className="text-xl font-bold text-foreground mb-5">Your Profile</h2>

              <div className="grid md:grid-cols-2 gap-5">

                <div className="flex items-center gap-3 p-3 bg-background rounded-xl">
                  <User size={18} className="text-indigo-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-semibold text-foreground">{tutor.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-background rounded-xl">
                  <BookOpen size={18} className="text-indigo-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Subject</p>
                    <p className="font-semibold text-foreground">{tutor.subject}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-background rounded-xl">
                  <GraduationCap size={18} className="text-indigo-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Qualification</p>
                    <p className="font-semibold text-foreground">{tutor.qualification}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-background rounded-xl">
                  <MapPin size={18} className="text-indigo-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">City</p>
                    <p className="font-semibold text-foreground">{tutor.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-background rounded-xl">
                  <Clock size={18} className="text-indigo-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Available Time</p>
                    <p className="font-semibold text-foreground">{tutor.time || "Not set"}</p>
                  </div>
                </div>

                {tutor.phoneNumber && (
                  <div className="flex items-center gap-3 p-3 bg-background rounded-xl">
                    <Phone size={18} className="text-indigo-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-semibold text-foreground">{tutor.phoneNumber}</p>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* RECENT REVIEWS */}
            {tutor.reviews && tutor.reviews.length > 0 && (
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                <h2 className="text-xl font-bold text-foreground mb-5">Recent Reviews</h2>
                <div className="space-y-4">
                  {tutor.reviews.slice(0, 3).map((review, i) => (
                    <div key={i} className="border border-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-foreground">{review.studentName || "Anonymous"}</p>
                        <RatingStars rating={review.rating} size={14} />
                      </div>
                      {review.comment && (
                        <p className="text-muted-foreground text-sm">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ======= RIGHT COLUMN ======= */}
          <div className="space-y-6">

            {/* Notification Card */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
                <Bell size={18} className="text-primary" />
                Notification
              </h2>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                <p className="text-gray-700 text-sm">
                  {tutor.notification || "You don't have any notifications yet."}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/teaching-requests"
                  className="w-full bg-primary text-primary-foreground text-white py-2.5 rounded-xl font-semibold hover:bg-primary text-primary-foreground transition text-sm flex items-center justify-center gap-2"
                >
                  <BookOpen size={15} />
                  View Booking Requests
                </Link>
                <Link
                  to="/notifications"
                  className="w-full border border-indigo-200 text-primary py-2.5 rounded-xl font-semibold hover:bg-indigo-50 transition text-sm flex items-center justify-center gap-2"
                >
                  <Bell size={15} />
                  All Notifications
                </Link>
              </div>
            </div>

            {/* Rating Summary */}
            {tutor.numReviews > 0 && (
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Star size={18} className="text-yellow-500" />
                  Rating Summary
                </h2>
                <div className="text-center">
                  <p className="text-4xl font-bold text-foreground">
                    {(tutor.rating || 0).toFixed(1)}
                  </p>
                  <RatingStars rating={tutor.rating || 0} size={20} className="justify-center mt-2" />
                  <p className="text-muted-foreground text-sm mt-2">
                    Based on {tutor.numReviews} review{tutor.numReviews !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
