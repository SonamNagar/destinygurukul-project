import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  GraduationCap,
  MapPin,
  BookOpen,
  Clock,
  IndianRupee,
  CheckCircle,
  ArrowLeft,
  MessageSquare,
  Send,
  User,
  X,
  Calendar,
  Phone,
  ShieldCheck,
} from "lucide-react";
import TeacherDetailsSkeleton from "../components/TeacherDetailsSkeleton";
import RatingStars from "../components/RatingStars";
import { BHOPAL_AREAS } from "../constants/bhopalAreas";

export default function TeacherDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Review submission state
  const [userRating, setUserRating] = useState(5);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Booking Modal State (with Packages & Bhopal Address)
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPackage, setBookingPackage] = useState("single"); // "single" | "monthly_12" | "monthly_24"
  const [bookingArea, setBookingArea] = useState(BHOPAL_AREAS[0] || "MP Nagar");
  const [bookingAddress, setBookingAddress] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("Morning (08:00 AM - 11:00 AM)");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // ==========================================
  // GET SINGLE TUTOR
  // ==========================================

  const fetchTutor = async () => {
    const response = await api.get(`/tutors/${id}`);
    return response.data;
  };

  const { data: tutor, isLoading: loading, error: queryError, refetch: getTutor } = useQuery({
    queryKey: ['teacherDetails', id],
    queryFn: fetchTutor,
    enabled: !!id
  });

  const error = queryError ? queryError.response?.data?.message || queryError.message || "Unable to load tutor details." : "";

  // Set default minimum date as tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  // ==========================================
  // OPEN BOOKING MODAL (WITH LOGIN CHECK)
  // ==========================================
  const handleOpenBookingModal = useCallback(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("Please login first to book a tutor!");
      const targetPath = encodeURIComponent(`/teacher/${id}?openBooking=true`);
      navigate(`/login?redirect=${targetPath}`);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.phoneNumber) {
        setBookingPhone(parsedUser.phoneNumber);
      }
    } catch (err) {
      console.log(err);
    }

    setIsBookingOpen(true);
  }, [id, navigate]);

  // Auto-open booking modal if redirected back after login
  useEffect(() => {
    if (!loading && tutor && searchParams.get("openBooking") === "true") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        handleOpenBookingModal();
      }
    }
  }, [loading, tutor, searchParams, handleOpenBookingModal]);

  // ==========================================
  // SUBMIT BOOKING HANDLER
  // ==========================================
  async function handleCreateBooking(e) {
    e.preventDefault();

    if (!bookingPhone.trim()) {
      toast.error("Please enter your 10-digit phone number");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(bookingPhone.trim())) {
      toast.error("Please enter a valid 10-digit Indian phone number");
      return;
    }

    if (!bookingDate) {
      toast.error("Please select a date for home tutoring session");
      return;
    }

    const storedUser = localStorage.getItem("user");
    let currentUser = null;
    if (storedUser) {
      try {
        currentUser = JSON.parse(storedUser);
      } catch (err) {
        console.log(err);
      }
    }

    try {
      setSubmittingBooking(true);

      const payload = {
        studentName: currentUser?.name || "Student",
        studentEmail: currentUser?.email || "",
        phoneNumber: bookingPhone.trim(),
        tutor: tutor._id,
        subject: tutor.subject,
        date: bookingDate,
        time: bookingTime,
        packageType: bookingPackage,
        area: bookingArea,
        address: bookingAddress.trim(),
        message: bookingMessage.trim(),
      };

      await api.post("/bookings", payload);

      toast.success("🎉 Booking request submitted! The teacher will contact you shortly.");
      setIsBookingOpen(false);
      navigate("/my-booking");
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message || "Failed to submit booking request. Please try again."
      );
    } finally {
      setSubmittingBooking(false);
    }
  }

  // ==========================================
  // SUBMIT REVIEW HANDLER
  // ==========================================
  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!reviewerName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    try {
      setSubmittingReview(true);
      await api.post(`/tutors/${id}/reviews`, {
        rating: userRating,
        studentName: reviewerName,
        comment: reviewComment,
      });

      toast.success("Review submitted successfully!");
      setReviewComment("");
      setReviewerName("");
      setUserRating(5);

      getTutor();
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message || "Failed to submit review"
      );
    } finally {
      setSubmittingReview(false);
    }
  }


  // ==========================================
  // LOADING SKELETON
  // ==========================================

  if (loading) {
    return <TeacherDetailsSkeleton />;
  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">

        <div className="bg-card border-border border rounded-2xl shadow-lg p-8 text-center max-w-md">

          <h2 className="text-2xl font-bold text-red-600">
            Tutor Not Found
          </h2>

          <p className="text-muted-foreground mt-3">
            {error}
          </p>

          <Link
            to="/find-tutors"
            className="inline-flex items-center gap-2 mt-6 bg-primary text-primary-foreground text-white px-5 py-3 rounded-xl"
          >
            <ArrowLeft size={18} />
            Back to Tutors
          </Link>

        </div>

      </div>
    );
  }


  if (!tutor) {
    return null;
  }


  // ==========================================
  // ONLY APPROVED TUTOR
  // ==========================================

  if (tutor.status !== "approved") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">

        <div className="bg-card border-border border rounded-2xl shadow-lg p-8 text-center max-w-md">

          <h2 className="text-2xl font-bold text-foreground">
            Tutor Not Available
          </h2>

          <p className="text-muted-foreground mt-3">
            This tutor has not been approved yet.
          </p>

          <Link
            to="/find-tutors"
            className="inline-flex items-center gap-2 mt-6 bg-primary text-primary-foreground text-white px-5 py-3 rounded-xl"
          >
            <ArrowLeft size={18} />
            Find Other Tutors
          </Link>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background py-10 px-6">

      <div className="max-w-6xl mx-auto">

        {/* BACK */}

        <Link
          to="/find-tutors"
          className="inline-flex items-center gap-2 text-primary font-semibold mb-6 hover:text-indigo-800"
        >
          <ArrowLeft size={18} />
          Back to Tutors
        </Link>


        {/* ==========================================
            PROFILE HEADER
        ========================================== */}

        <div className="bg-card border-border border rounded-3xl shadow-lg overflow-hidden">

          <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 h-36"></div>

          <div className="px-8 pb-8">

            <div className="-mt-20 flex flex-col md:flex-row md:items-end justify-between gap-6">

              <div className="flex flex-col md:flex-row md:items-end gap-6">
                {/* PHOTO */}

                <div className="w-36 h-36 rounded-2xl border-4 border-white bg-indigo-100 flex items-center justify-center overflow-hidden shadow-md">

                  {tutor.photo ? (
                    <img
                      src={tutor.photo}
                      alt={tutor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <GraduationCap
                      size={65}
                      className="text-indigo-400"
                    />
                  )}

                </div>


                {/* NAME & RATING */}

                <div className="flex-1 pt-2">

                  <div className="flex flex-wrap items-center gap-3">

                    <h1 className="text-3xl font-bold text-foreground">
                      {tutor.name}
                    </h1>

                    <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">

                      <CheckCircle size={16} />

                      Approved Tutor

                    </span>

                  </div>

                  <p className="text-primary text-lg font-semibold mt-1">
                    {tutor.subject}
                  </p>

                </div>
              </div>

              {/* RATING BADGE */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4">
                <div className="text-center">
                  <p className="text-3xl font-extrabold text-amber-600">
                    {(tutor.rating || 4.8).toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    {tutor.numReviews || (tutor.reviews ? tutor.reviews.length : 0)} reviews
                  </p>
                </div>
                <div>
                  <RatingStars rating={tutor.rating || 4.8} size={20} />
                  <p className="text-xs text-muted-foreground mt-1">Overall Rating</p>
                </div>
              </div>

            </div>

          </div>

        </div>


        {/* ==========================================
            DETAILS
        ========================================== */}

        <div className="grid lg:grid-cols-3 gap-8 mt-8">


          {/* LEFT */}

          <div className="lg:col-span-2 space-y-8">


            {/* ABOUT */}

            <div className="bg-card border-border border rounded-2xl shadow p-7">

              <h2 className="text-2xl font-bold text-foreground mb-4">
                About Tutor
              </h2>

              <p className="text-muted-foreground leading-7">
                {tutor.about ||
                  `${tutor.name} is an approved tutor who can teach ${tutor.subject}.`}
              </p>

            </div>


            {/* QUALIFICATION */}

            <div className="bg-card border-border border rounded-2xl shadow p-7">

              <h2 className="text-2xl font-bold text-foreground mb-6">
                Tutor Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">


                <div className="flex gap-4">

                  <GraduationCap
                    className="text-primary"
                    size={24}
                  />

                  <div>

                    <p className="text-muted-foreground text-sm">
                      Qualification
                    </p>

                    <p className="font-semibold mt-1">
                      {tutor.qualification}
                    </p>

                  </div>

                </div>


                <div className="flex gap-4">

                  <BookOpen
                    className="text-primary"
                    size={24}
                  />

                  <div>

                    <p className="text-muted-foreground text-sm">
                      Experience
                    </p>

                    <p className="font-semibold mt-1">
                      {tutor.experience || 0} years
                    </p>

                  </div>

                </div>


                <div className="flex gap-4">

                  <MapPin
                    className="text-primary"
                    size={24}
                  />

                  <div>

                    <p className="text-muted-foreground text-sm">
                      City
                    </p>

                    <p className="font-semibold mt-1">
                      {tutor.city}
                    </p>

                  </div>

                </div>


                <div className="flex gap-4">

                  <Clock
                    className="text-primary"
                    size={24}
                  />

                  <div>

                    <p className="text-muted-foreground text-sm">
                      Available Time
                    </p>

                    <p className="font-semibold mt-1">
                      {tutor.time}
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* TEACHING DETAILS */}

            <div className="bg-card border-border border rounded-2xl shadow p-7">

              <h2 className="text-2xl font-bold text-foreground mb-6">
                Teaching Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">

                <div>

                  <p className="text-muted-foreground text-sm">
                    Subject
                  </p>

                  <p className="font-semibold mt-1">
                    {tutor.subject}
                  </p>

                </div>


                <div>

                  <p className="text-muted-foreground text-sm">
                    Classes
                  </p>

                  <p className="font-semibold mt-1">
                    {tutor.classes}
                  </p>

                </div>


                <div>

                  <p className="text-muted-foreground text-sm">
                    Fees
                  </p>

                  <p className="font-semibold mt-1 flex items-center gap-1">
                    <IndianRupee size={17} />
                    {tutor.fees}
                  </p>

                </div>


                <div>

                  <p className="text-muted-foreground text-sm">
                    Address
                  </p>

                  <p className="font-semibold mt-1">
                    {tutor.address}
                  </p>

                </div>

              </div>

            </div>


            {/* REVIEWS & RATINGS SECTION */}
            <div className="bg-card border-border border rounded-2xl shadow p-7 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="text-primary" size={24} />
                  <h2 className="text-2xl font-bold text-foreground">
                    Student Reviews & Ratings
                  </h2>
                </div>
                <span className="text-sm text-muted-foreground font-semibold">
                  {tutor.reviews?.length || 0} Reviews
                </span>
              </div>

              {/* WRITE A REVIEW FORM */}
              <form onSubmit={handleSubmitReview} className="bg-background p-5 rounded-2xl border border-border space-y-4">
                <h3 className="font-bold text-foreground text-base">Rate this Tutor</h3>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Your Rating
                    </label>
                    <RatingStars
                      rating={userRating}
                      readonly={false}
                      size={24}
                      onRatingChange={(rate) => setUserRating(rate)}
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full px-4 py-2 bg-card border-border border border border-border rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Comment / Feedback
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Share your experience learning with this tutor..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-4 py-2 bg-card border-border border border border-border rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-primary text-primary-foreground hover:bg-primary text-primary-foreground text-white font-medium px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition disabled:opacity-50"
                >
                  <Send size={16} />
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>

              {/* REVIEWS LIST */}
              <div className="space-y-4 pt-2">
                {(!tutor.reviews || tutor.reviews.length === 0) ? (
                  <p className="text-muted-foreground text-sm italic py-4 text-center">
                    No reviews yet. Be the first student to review this tutor!
                  </p>
                ) : (
                  tutor.reviews.map((rev, idx) => (
                    <div key={idx} className="border-b last:border-b-0 pb-4 last:pb-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-primary">
                            <User size={16} />
                          </div>
                          <span className="font-semibold text-foreground text-sm">
                            {rev.studentName}
                          </span>
                        </div>
                        <RatingStars rating={rev.rating} size={14} />
                      </div>
                      {rev.comment && (
                        <p className="text-muted-foreground text-sm pl-10">
                          {rev.comment}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>


          {/* ==========================================
              BOOK TUTOR
          ========================================== */}

          <div>

            <div className="bg-card border-border border rounded-2xl shadow-lg p-7 sticky top-6">

              <h2 className="text-2xl font-bold text-foreground">
                Book This Tutor
              </h2>

              <p className="text-muted-foreground mt-2">
                Interested in learning from {tutor.name}?
              </p>


              <div className="border-t mt-6 pt-6">

                <div className="flex justify-between mb-4">

                  <span className="text-muted-foreground">
                    Subject
                  </span>

                  <span className="font-semibold">
                    {tutor.subject}
                  </span>

                </div>


                <div className="flex justify-between mb-4">

                  <span className="text-muted-foreground">
                    Experience
                  </span>

                  <span className="font-semibold">
                    {tutor.experience || 0} years
                  </span>

                </div>


                <div className="flex justify-between">

                  <span className="text-muted-foreground">
                    Fees
                  </span>

                  <span className="font-bold text-primary">
                    ₹{tutor.fees}
                  </span>

                </div>

              </div>


              <button
                onClick={handleOpenBookingModal}
                className="mt-7 w-full bg-primary text-primary-foreground text-white py-3 rounded-xl flex items-center justify-center font-semibold hover:bg-primary text-primary-foreground transition shadow-md hover:shadow-indigo-200"
              >
                Book Home Tutor Now
              </button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                🔒 Home visit tutoring request with verified teacher.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ==========================================
          INTERACTIVE BOOKING MODAL DIALOG
      ========================================== */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border-border border w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* MODAL HEADER */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Book Home Tutor</h3>
                <p className="text-indigo-100 text-xs mt-0.5">
                  Request a home visit session with {tutor.name}
                </p>
              </div>
              <button
                onClick={() => setIsBookingOpen(false)}
                className="w-8 h-8 rounded-full bg-card border-border border/20 hover:bg-card border-border border/30 flex items-center justify-center text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* MODAL BODY FORM */}
            <form onSubmit={handleCreateBooking} className="p-6 space-y-4 overflow-y-auto flex-1">
              
              {/* TUTOR & SUBJECT SUMMARY WITH PACKAGES */}
              <div className="bg-indigo-50/80 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs font-semibold text-[#7367F0] uppercase tracking-wider">Selected Tutor</p>
                    <p className="font-bold text-foreground text-base">{tutor.name}</p>
                    <p className="text-xs text-muted-foreground">{tutor.subject} • Class {tutor.classes}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Base Fee</p>
                    <p className="text-base font-extrabold text-[#7367F0]">₹{tutor.fees}/class</p>
                  </div>
                </div>

                {/* PACKAGE SELECTION TABS */}
                <div className="pt-2 border-t border-indigo-200/60 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Choose Learning Package:</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setBookingPackage("single")}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        bookingPackage === "single"
                          ? "bg-[#7367F0] text-white border-[#7367F0] shadow-md shadow-[#7367F0]/30"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#7367F0]"
                      }`}
                    >
                      <p className="text-[11px] font-semibold">Single Class</p>
                      <p className="text-xs font-black mt-0.5">₹{tutor.fees}</p>
                      <p className="text-[9px] opacity-80">1 Demo/Session</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBookingPackage("monthly_12")}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer relative ${
                        bookingPackage === "monthly_12"
                          ? "bg-[#7367F0] text-white border-[#7367F0] shadow-md shadow-[#7367F0]/30"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#7367F0]"
                      }`}
                    >
                      <span className="absolute -top-2 right-1 bg-[#28C76F] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                        10% OFF
                      </span>
                      <p className="text-[11px] font-semibold">12 Classes</p>
                      <p className="text-xs font-black mt-0.5">₹{Math.round(tutor.fees * 12 * 0.9)}</p>
                      <p className="text-[9px] opacity-80">Monthly Plan</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBookingPackage("monthly_24")}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer relative ${
                        bookingPackage === "monthly_24"
                          ? "bg-[#7367F0] text-white border-[#7367F0] shadow-md shadow-[#7367F0]/30"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#7367F0]"
                      }`}
                    >
                      <span className="absolute -top-2 right-1 bg-[#FF9F43] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                        20% OFF
                      </span>
                      <p className="text-[11px] font-semibold">24 Classes</p>
                      <p className="text-xs font-black mt-0.5">₹{Math.round(tutor.fees * 24 * 0.8)}</p>
                      <p className="text-[9px] opacity-80">Intensive Plan</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* DATE PICKER */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#7367F0]" />
                  Preferred Start Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-[#7367F0] transition"
                />
              </div>

              {/* TIME SLOT */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Clock size={14} className="text-[#7367F0]" />
                  Preferred Time Slot
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-[#7367F0] transition"
                >
                  <option value="Morning (08:00 AM - 11:00 AM)">Morning (08:00 AM - 11:00 AM)</option>
                  <option value="Afternoon (12:00 PM - 03:00 PM)">Afternoon (12:00 PM - 03:00 PM)</option>
                  <option value="Evening (04:00 PM - 08:00 PM)">Evening (04:00 PM - 08:00 PM)</option>
                  <option value="Custom Time (Teacher will contact)">Custom Time (Teacher will call to align)</option>
                </select>
              </div>

              {/* BHOPAL AREA & ADDRESS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#7367F0]" />
                    Bhopal Locality
                  </label>
                  <select
                    value={bookingArea}
                    onChange={(e) => setBookingArea(e.target.value)}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-[#7367F0] transition"
                  >
                    {BHOPAL_AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Phone size={14} className="text-[#7367F0]" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    maxLength={10}
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-[#7367F0] transition"
                  />
                </div>
              </div>

              {/* COMPLETE HOME ADDRESS FOR GOOGLE MAPS */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#7367F0]" />
                  Complete Home Address (for Teacher Navigation)
                </label>
                <input
                  type="text"
                  required
                  placeholder="House/Flat No, Building, Landmark, Road name"
                  value={bookingAddress}
                  onChange={(e) => setBookingAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-[#7367F0] transition"
                />
                <p className="text-[11px] text-muted-foreground mt-1">Teacher will use Google Maps navigation to reach your home address directly.</p>
              </div>

              {/* ESCROW & MONEY-BACK GUARANTEE BADGE */}
              <div className="bg-[#28C76F]/10 border border-[#28C76F]/30 rounded-xl p-3 flex items-start gap-2.5">
                <ShieldCheck size={20} className="text-[#28C76F] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#28C76F]">100% Escrow & Money-Back Protection</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight mt-0.5">
                    Payment platform escrow me surakshit rehta hai. Jab teacher ghar aakar 4-digit OTP se class conduct karega tabhi payout release hota hai. Teacher na aane par 100% instant refund guaranteed.
                  </p>
                </div>
              </div>

              {/* MESSAGE / NOTE */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Additional Note for Teacher (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Mention any specific topics or learning requirements..."
                  value={bookingMessage}
                  onChange={(e) => setBookingMessage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-indigo-500 focus:bg-card border-border border transition"
                />
              </div>

              {/* MODAL ACTIONS */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(false)}
                  className="flex-1 px-4 py-3 border border-border rounded-xl text-sm font-semibold text-muted-foreground hover:bg-background transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBooking}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary text-primary-foreground text-white px-4 py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submittingBooking ? "Sending Request..." : "Confirm & Send Request"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}