import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import {
  Mail,
  Phone,
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  Clock3,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function TeachingRequests() {
  const [updatingId, setUpdatingId] = useState(null);
  const [otpInputs, setOtpInputs] = useState({});
  const teacherEmail = localStorage.getItem("teacherEmail");

  // ==========================================
  // GET TEACHER
  // ==========================================

  const fetchTeacherBookings = async () => {
    if (!teacherEmail) throw new Error("Teacher email not found. Please login first.");
    const teacherResponse = await api.get(`/tutors/email/${encodeURIComponent(teacherEmail)}`);
    const teacher = teacherResponse.data;
    const bookingResponse = await api.get(`/bookings/tutor/${teacher._id}`);
    return bookingResponse.data;
  };

  const { data: bookings = [], isLoading: loading, error: queryError, refetch } = useQuery({
    queryKey: ['teachingRequests', teacherEmail],
    queryFn: fetchTeacherBookings,
    enabled: !!teacherEmail
  });

  const error = queryError ? queryError.response?.data?.message || queryError.message || "Unable to load teaching requests." : "";

  // ==========================================
  // UPDATE BOOKING STATUS
  // ==========================================
  async function updateBookingStatus(id, status) {
    try {
      setUpdatingId(id);
      await api.put(`/bookings/${id}/status`, { status });
      refetch();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Unable to update booking.");
    } finally {
      setUpdatingId(null);
    }
  }

  // ==========================================
  // VERIFY 4-DIGIT STUDENT OTP
  // ==========================================
  async function handleVerifyOtp(bookingId) {
    const otp = otpInputs[bookingId]?.trim();
    if (!otp || otp.length !== 4) {
      alert("Please enter the 4-digit OTP provided by the student.");
      return;
    }

    try {
      setUpdatingId(bookingId);
      const res = await api.post(`/bookings/${bookingId}/verify-otp`, { otp });
      alert(res.data.message || "Class Started successfully!");
      refetch();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Invalid 4-digit OTP. Please re-check with student.");
    } finally {
      setUpdatingId(null);
    }
  }


  // ==========================================
  // LOADING SKELETON
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <Skeleton height={32} width={250} className="mb-2" />
          <Skeleton height={18} width={200} className="mb-8" />
          <div className="space-y-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton circle width={52} height={52} />
                  <div>
                    <Skeleton height={20} width={140} />
                    <Skeleton height={15} width={100} className="mt-2" />
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} height={50} borderRadius={12} />
                  ))}
                </div>
              </div>
            ))}
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

        <div className="bg-card rounded-2xl shadow p-8 text-center max-w-md">

          <XCircle
            size={50}
            className="mx-auto text-red-500 mb-4"
          />

          <h2 className="text-2xl font-bold">
            Unable to Load Requests
          </h2>

          <p className="text-muted-foreground mt-3">
            {error}
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background py-10 px-6">

      <div className="max-w-6xl mx-auto">


        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="bg-primary text-primary-foreground text-white rounded-2xl p-8 shadow mb-8">

          <h1 className="text-3xl font-bold">
            Teaching Requests
          </h1>

          <p className="text-indigo-200 mt-2">
            Manage booking requests from students.
          </p>

        </div>


        {/* ==========================================
            NO REQUESTS
        ========================================== */}

        {bookings.length === 0 && (

          <div className="bg-card rounded-2xl shadow p-12 text-center">

            <Clock3
              size={60}
              className="mx-auto text-gray-300 mb-5"
            />

            <h2 className="text-2xl font-bold text-gray-700">
              No Teaching Requests
            </h2>

            <p className="text-muted-foreground mt-2">
              You don't have any booking requests yet.
            </p>

          </div>
        )}


        {/* ==========================================
            BOOKINGS
        ========================================== */}

        <div className="space-y-6">

          {bookings.map((booking) => (

            <div
              key={booking._id}
              className="bg-card rounded-2xl shadow p-7"
            >

              {/* TOP */}

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                  <h2 className="text-2xl font-bold text-foreground">
                    {booking.studentName}
                  </h2>

                  <p className="text-primary font-semibold mt-1">
                    {booking.subject}
                  </p>

                </div>


                {/* STATUS */}

                <div>

                  {booking.status === "pending" && (

                    <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">

                      <Clock3 size={17} />

                      Pending

                    </span>

                  )}


                  {booking.status === "accepted" && (

                    <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">

                      <CheckCircle size={17} />

                      Accepted

                    </span>

                  )}


                  {booking.status === "rejected" && (

                    <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">

                      <XCircle size={17} />

                      Rejected

                    </span>

                  )}


                  {booking.status === "completed" && (

                    <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">

                      <CheckCircle size={17} />

                      Completed

                    </span>

                  )}

                </div>

              </div>


              {/* DETAILS */}

              <div className="grid md:grid-cols-2 gap-5 mt-7 border-t pt-6">


                {/* EMAIL */}

                <div className="flex gap-3">

                  <Mail
                    size={20}
                    className="text-primary"
                  />

                  <div>

                    <p className="text-muted-foreground text-sm">
                      Student Email
                    </p>

                    <p className="font-semibold">
                      {booking.studentEmail}
                    </p>

                  </div>

                </div>


                {/* PHONE */}

                <div className="flex gap-3">

                  <Phone
                    size={20}
                    className="text-primary"
                  />

                  <div>

                    <p className="text-muted-foreground text-sm">
                      Phone
                    </p>

                    <p className="font-semibold">
                      {booking.phoneNumber}
                    </p>

                  </div>

                </div>


                {/* DATE */}

                <div className="flex gap-3">

                  <CalendarDays
                    size={20}
                    className="text-primary"
                  />

                  <div>

                    <p className="text-muted-foreground text-sm">
                      Preferred Date
                    </p>

                    <p className="font-semibold">
                      {booking.date}
                    </p>

                  </div>

                </div>


                {/* TIME */}

                <div className="flex gap-3">

                  <Clock
                    size={20}
                    className="text-primary"
                  />

                  <div>

                    <p className="text-muted-foreground text-sm">
                      Preferred Time
                    </p>

                    <p className="font-semibold">
                      {booking.time}
                    </p>

                  </div>

                </div>

              </div>


              {/* MESSAGE */}

              {booking.message && (

                <div className="bg-background rounded-xl p-5 mt-6">

                  <p className="text-muted-foreground text-sm mb-1">
                    Student Message
                  </p>

                  <p className="text-gray-700">
                    {booking.message}
                  </p>

                </div>

              )}


              {/* ACTIONS */}

              {booking.status === "pending" && (

                <div className="flex flex-col sm:flex-row gap-3 mt-7 pt-6 border-t">

                  <button
                    onClick={() =>
                      updateBookingStatus(
                        booking._id,
                        "accepted"
                      )
                    }
                    disabled={updatingId === booking._id}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 disabled:bg-gray-400"
                  >

                    <CheckCircle size={19} />

                    {updatingId === booking._id
                      ? "Updating..."
                      : "Accept Request"}

                  </button>


                  <button
                    onClick={() =>
                      updateBookingStatus(
                        booking._id,
                        "rejected"
                      )
                    }
                    disabled={updatingId === booking._id}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-700 disabled:bg-gray-400"
                  >

                    <XCircle size={19} />

                    Reject Request

                  </button>

                </div>

              )}


              {/* ACCEPTED MESSAGE */}
              {booking.status === "accepted" && (
                <div className="mt-6 space-y-3">
                  {booking.paymentStatus === "paid" ? (
                    <div className="bg-[#28C76F]/10 border border-[#28C76F]/30 rounded-xl p-4 text-[#28C76F]">
                      <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                        <CheckCircle size={20} className="text-[#28C76F]" />
                        <span>✅ Advance Payment Confirmed (₹{booking.amount || 500}) — Authorized for Home Visit</span>
                      </div>
                      <p className="mt-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        Student ne advance payment complete kar di hai. Aap scheduled date <strong>({booking.date})</strong> aur time <strong>({booking.time})</strong> par student ke ghar jakar class conduct kar sakte hain.
                      </p>

                      {/* Student Home Address & Maps Navigation */}
                      {booking.address && (
                        <div className="mt-3 p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg flex items-center justify-between text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">Student Address: </span>
                            {booking.address}, {booking.area || "Bhopal"}
                          </div>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.address + ", " + (booking.area || "Bhopal") + ", Bhopal")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline font-semibold ml-2"
                          >
                            <MapPin size={15} /> Map
                          </a>
                        </div>
                      )}

                      {/* 4-Digit OTP Entry to Start Class */}
                      {!booking.isClassStarted ? (
                        <div className="mt-4 pt-3 border-t border-[#28C76F]/20">
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Enter Student 4-Digit Start OTP:
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <input
                              type="text"
                              maxLength={4}
                              placeholder="4-digit OTP"
                              value={otpInputs[booking._id] || ""}
                              onChange={(e) =>
                                setOtpInputs({
                                  ...otpInputs,
                                  [booking._id]: e.target.value,
                                })
                              }
                              className="w-32 px-3 py-2 text-center text-lg tracking-widest font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                            />
                            <button
                              onClick={() => handleVerifyOtp(booking._id)}
                              disabled={updatingId === booking._id}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <ShieldCheck size={16} />
                              {updatingId === booking._id ? "Verifying..." : "Verify & Start Class"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 pt-3 border-t border-[#28C76F]/20 flex items-center justify-between flex-wrap gap-2">
                          <span className="text-xs font-semibold text-green-700">Class has started!</span>
                          <button
                            onClick={() => updateBookingStatus(booking._id, "completed")}
                            disabled={updatingId === booking._id}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs cursor-pointer disabled:opacity-50"
                          >
                            {updatingId === booking._id ? "Completing..." : "Mark Class Completed"}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-[#FF9F43]/10 border border-[#FF9F43]/30 rounded-xl p-4 text-[#FF9F43]">
                      <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                        <Clock3 size={20} className="text-[#FF9F43]" />
                        <span>⚠️ Student Payment Pending — Do NOT visit home yet</span>
                      </div>
                      <p className="mt-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        Aapne request accept kar li hai. Destiny Gurukul niyam ke anusaar student pehle online payment confirm karega, tabhi aapko ghar jakar padhane jana hai. Payment aate hi yahan confirmation update ho jayegi.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* IN-PROGRESS MESSAGE & COMPLETE BUTTON */}
              {booking.status === "in-progress" && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-900">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-blue-700">
                        <CheckCircle size={20} />
                        <span>Class In Progress</span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        Class has begun. When completed, click below to release escrow payment.
                      </p>
                    </div>
                    <button
                      onClick={() => updateBookingStatus(booking._id, "completed")}
                      disabled={updatingId === booking._id}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm cursor-pointer disabled:opacity-50"
                    >
                      {updatingId === booking._id ? "Completing..." : "Mark Class Completed"}
                    </button>
                  </div>
                </div>
              )}


              {/* REJECTED MESSAGE */}

              {booking.status === "rejected" && (

                <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">

                  <div className="flex items-center gap-2 font-semibold">

                    <XCircle size={20} />

                    Booking Rejected

                  </div>

                  <p className="mt-1 text-sm">
                    This teaching request was rejected.
                  </p>

                </div>

              )}

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}