
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  Phone,
  MessageSquare,
  ArrowLeft,
  CheckCircle,
  XCircle,
  CreditCard,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import api from "../api/axiosInstance";
import PaymentModal from "../components/PaymentModal";

const MyBooking = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(null);
  const [selectedBookingForPayment, setSelectedBookingForPayment] =
    useState(null);

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (err) {
      console.log(err);
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  // ==========================================
  // FETCH STUDENT BOOKINGS
  // ==========================================
  const fetchBookings = async () => {
    if (!user?.email) {
      throw new Error("No user email");
    }

    const response = await api.get(
      `/bookings/student/${encodeURIComponent(user.email)}`
    );

    return response.data;
  };

  // ==========================================
  // REACT QUERY
  // ==========================================
  const {
    data: bookings = [],
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["myBookings", user?.email],
    queryFn: fetchBookings,
    enabled: !!user?.email,
  });

  const error = queryError?.message || null;

  // ==========================================
  // ONLINE PAYMENT
  // ==========================================
  function handlePayOnline(booking) {
    setSelectedBookingForPayment(booking);
  }

  // ==========================================
  // FORMAT DATE
  // ==========================================
  const formatDate = (date) => {
    if (!date) return "Not available";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "confirmed":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          icon: CheckCircle,
        };

      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          icon: Clock,
        };

      case "rejected":
      case "cancelled":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          icon: XCircle,
        };

      case "completed":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          icon: CheckCircle,
        };

      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          icon: Clock,
        };
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <Skeleton height={45} width={220} className="mb-8" />

          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <Skeleton height={25} width={180} />
                <Skeleton height={18} className="mt-4" />
                <Skeleton height={18} className="mt-2" />
                <Skeleton height={18} className="mt-2" />
                <Skeleton height={45} className="mt-6" />
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
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <XCircle className="mx-auto mb-4 text-red-500" size={50} />

          <h2 className="text-2xl font-bold text-gray-800">
            Something went wrong
          </h2>

          <p className="mt-3 text-gray-600">{error}</p>

          <button
            onClick={() => refetch()}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ==========================================
          HEADER
      ========================================== */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                to="/student-dashboard"
                className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft size={18} />
                Back to Dashboard
              </Link>

              <h1 className="text-3xl font-bold text-gray-900">
                My Bookings
              </h1>

              <p className="mt-1 text-gray-600">
                View and manage all your tutor bookings
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 px-5 py-3">
              <p className="text-sm text-blue-600">Total Bookings</p>
              <p className="text-2xl font-bold text-blue-700">
                {bookings.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          CONTENT
      ========================================== */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {bookings.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <Calendar
              size={60}
              className="mx-auto mb-5 text-gray-300"
            />

            <h2 className="text-2xl font-bold text-gray-800">
              No Bookings Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              You haven't booked any tutor yet. Find a tutor and book your
              first class.
            </p>

            <Link
              to="/find-tutors"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <BookOpen size={18} />
              Find Tutors
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {bookings.map((booking) => {
              const statusStyle = getStatusStyle(booking.status);
              const StatusIcon = statusStyle.icon;

              return (
                <div
                  key={booking._id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* ==========================================
                      CARD HEADER
                  ========================================== */}
                  <div className="border-b bg-gray-50 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {booking.tutor?.name ||
                            booking.tutorName ||
                            "Tutor"}
                        </h2>

                        <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                          <BookOpen size={15} />
                          {booking.subject || "Subject not available"}
                        </p>
                      </div>

                      <div
                        className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        <StatusIcon size={14} />
                        {booking.status || "Pending"}
                      </div>
                    </div>
                  </div>

                  {/* ==========================================
                      BOOKING DETAILS
                  ========================================== */}
                  <div className="space-y-4 p-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                          <Calendar size={18} />
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="font-medium text-gray-800">
                            {formatDate(booking.date || booking.bookingDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                          <Clock size={18} />
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Time</p>
                          <p className="font-medium text-gray-800">
                            {booking.time || "Not available"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tutor */}
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-green-50 p-2 text-green-600">
                        <User size={18} />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Tutor
                        </p>

                        <p className="font-medium text-gray-800">
                          {booking.tutor?.name ||
                            booking.tutorName ||
                            "Not available"}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    {(booking.tutor?.phone ||
                      booking.tutorPhone ||
                      booking.phone) && (
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
                          <Phone size={18} />
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">
                            Phone
                          </p>

                          <p className="font-medium text-gray-800">
                            {booking.tutor?.phone ||
                              booking.tutorPhone ||
                              booking.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Message */}
                    {booking.message && (
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-pink-50 p-2 text-pink-600">
                          <MessageSquare size={18} />
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">
                            Message
                          </p>

                          <p className="font-medium text-gray-800">
                            {booking.message}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* ==========================================
                        PAYMENT INFORMATION
                    ========================================== */}
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard
                            size={18}
                            className="text-gray-600"
                          />

                          <span className="font-semibold text-gray-700">
                            Payment
                          </span>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            booking.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {booking.paymentStatus === "paid"
                            ? "Paid"
                            : "Pending"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Amount
                        </span>

                        <span className="text-lg font-bold text-gray-900">
                          ₹
                          {booking.amount ||
                            booking.tutor?.fees ||
                            500}
                        </span>
                      </div>
                    </div>

                    {/* ==========================================
                        ACTION BUTTONS
                    {/* ==========================================
                        ACTION BUTTONS & HOME VISIT CLEARANCE NOTICE
                    ========================================== */}
                    <div className="flex flex-col gap-3 pt-2">
                      {booking.paymentStatus !== "paid" &&
                        booking.status !== "rejected" && (
                          <>
                            {booking.status === "accepted" && (
                              <div className="bg-[#7367F0]/10 border border-[#7367F0]/30 rounded-xl p-3 text-xs text-[#7367F0] font-medium leading-relaxed">
                                <span className="font-bold">⚠️ Zaroori Niyam:</span> Teacher ne aapki request accept kar li hai! Class confirm karne ke liye advance payment karna anivarya hai. Payment complete hote hi teacher aapke ghar padhane aayenge.
                              </div>
                            )}

                            <button
                              onClick={() => handlePayOnline(booking)}
                              disabled={processingPayment === booking._id}
                              className="flex w-full items-center justify-center gap-2 rounded-xl vuexy-btn-primary px-4 py-3.5 font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer shadow-md shadow-[#7367F0]/30"
                            >
                              <CreditCard size={17} />
                              {processingPayment === booking._id
                                ? "Processing..."
                                : `Pay Online to Confirm (₹${
                                    booking.amount ||
                                    booking.tutor?.fees ||
                                    500
                                  })`}
                            </button>
                          </>
                        )}

                      {booking.paymentStatus === "paid" && (
                        <div className="space-y-3">
                          {!booking.isClassStarted ? (
                            <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-4 text-center">
                              <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-700">
                                <KeyRound size={16} />
                                <span>Class Start Verification Code</span>
                              </div>
                              <div className="my-2 text-3xl font-black tracking-widest text-indigo-600 font-mono">
                                {booking.startOtp || "----"}
                              </div>
                              <p className="text-xs text-indigo-800">
                                Jab teacher aapke ghar aayein, tab unhe yeh 4-digit code batayein taaki class shuru ho sake.
                              </p>
                            </div>
                          ) : (
                            <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-center">
                              <div className="flex items-center justify-center gap-2 text-sm font-bold text-blue-700">
                                <CheckCircle size={18} />
                                <span>Class in Progress</span>
                              </div>
                              <p className="text-xs text-blue-600 mt-1">
                                Teacher ne code verify karke class start kar di hai.
                              </p>
                            </div>
                          )}

                          <div className="rounded-xl bg-[#28C76F]/10 border border-[#28C76F]/30 p-3 text-center">
                            <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#28C76F]">
                              <ShieldCheck size={18} />
                              <span>Booking & Payment Confirmed</span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1">
                              Teacher scheduled date aur time par aapke ghar class conduct karne aayenge.
                            </p>
                          </div>
                        </div>
                      )}

                      {booking.status === "rejected" && (
                        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-center text-sm font-medium text-red-700">
                          This booking has been rejected.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ==========================================
          PAYMENT MODAL
      ========================================== */}
      {selectedBookingForPayment && (
        <PaymentModal
          booking={selectedBookingForPayment}
          onClose={() => setSelectedBookingForPayment(null)}
          onSuccess={() => {
            setSelectedBookingForPayment(null);
            setProcessingPayment(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default MyBooking;




