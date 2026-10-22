import {
  User,
  BookOpen,

  Bell,
  Calendar,
  Clock,
  Star,
  TrendingUp,
  ArrowRight,
  Search,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import api from "../api/axiosInstance";

export default function StudentDashboard() {
  const navigate = useNavigate();

  // -----------------------------
  // USER
  // -----------------------------
  const [user, setUser] = useState(null);



  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    } catch (error) {
      console.log("User data error:", error);
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  // -----------------------------
  // FETCH BOOKINGS
  // -----------------------------
  const fetchBookings = async () => {
    if (!user?.email) throw new Error("No user email");
    const response = await api.get(`/bookings/student/${encodeURIComponent(user.email)}`);
    return response.data;
  };

  const { data: bookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ['studentBookings', user?.email],
    queryFn: fetchBookings,
    enabled: !!user?.email
  });

  // -----------------------------
  // FETCH NOTIFICATIONS
  // -----------------------------
  const fetchNotifications = async () => {
    if (!user?.email) throw new Error("No user email");
    const response = await api.get(`/notifications/user/${encodeURIComponent(user.email)}`);
    return response.data;
  };

  const { data: notifications = [], isLoading: loadingNotifications } = useQuery({
    queryKey: ['studentNotifications', user?.email],
    queryFn: fetchNotifications,
    enabled: !!user?.email
  });

  // -----------------------------
  // BOOKING COUNTS
  // -----------------------------
  const totalBookings = bookings.length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const upcomingBookings = bookings.filter(
    (booking) => booking.status === "accepted" && booking.date
  );

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  // -----------------------------
  // DATE FORMAT
  // -----------------------------
  const formatDate = (date) => {
    if (!date) return "Date not available";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton width={200} height={24} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      {/* ====================================================
          HERO HEADER
      ==================================================== */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-card border-border border/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                <User size={32} />
              </div>
              <div>
                <p className="text-indigo-200 text-sm font-medium">Welcome back 👋</p>
                <h1 className="text-3xl font-bold mt-0.5">
                  {user.name}
                </h1>
                <p className="text-indigo-200 text-sm mt-1">{user.email}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/find-tutors")}
                className="flex items-center gap-2 bg-card border-border border text-primary px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-50 transition shadow-sm"
              >
                <Search size={16} />
                Find Tutors
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 bg-card border-border border/10 border border-white/30 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-card border-border border/20 transition"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ====================================================
            STATS GRID
        ==================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {/* Total Bookings */}
          <div className="bg-card border-border border rounded-2xl border border-border shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              <BookOpen className="text-primary" size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {loadingBookings ? <Skeleton width={30} /> : totalBookings}
              </h2>
              <p className="text-muted-foreground text-sm">Total Bookings</p>
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="bg-card border-border border rounded-2xl border border-border shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <Calendar className="text-green-600" size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {loadingBookings ? <Skeleton width={30} /> : upcomingBookings.length}
              </h2>
              <p className="text-muted-foreground text-sm">Upcoming Classes</p>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-card border-border border rounded-2xl border border-border shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
              <Clock className="text-yellow-600" size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {loadingBookings ? <Skeleton width={30} /> : pendingBookings}
              </h2>
              <p className="text-muted-foreground text-sm">Pending</p>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-card border-border border rounded-2xl border border-border shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
              <Star className="text-violet-600" size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {loadingBookings ? <Skeleton width={30} /> : completedBookings}
              </h2>
              <p className="text-muted-foreground text-sm">Completed</p>
            </div>
          </div>

        </div>

        {/* ====================================================
            MAIN CONTENT
        ==================================================== */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ======= UPCOMING CLASSES ======= */}
          <div className="lg:col-span-2 bg-card border-border border rounded-2xl border border-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Upcoming Classes
              </h2>
              <button
                onClick={() => navigate("/my-booking")}
                className="text-primary font-semibold hover:text-indigo-800 text-sm flex items-center gap-1"
              >
                View All <ArrowRight size={14} />
              </button>
            </div>

            {loadingBookings ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border border-border rounded-xl p-4">
                    <div className="flex justify-between">
                      <div className="space-y-2">
                        <Skeleton height={20} width={140} />
                        <Skeleton height={16} width={100} />
                      </div>
                      <div className="space-y-2 text-right">
                        <Skeleton height={16} width={100} />
                        <Skeleton height={16} width={80} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-muted-foreground font-medium">No upcoming classes</p>
                <p className="text-muted-foreground text-sm mt-1">Book a tutor to get started</p>
                <button
                  onClick={() => navigate("/find-tutors")}
                  className="mt-5 bg-primary text-primary-foreground text-white px-6 py-2.5 rounded-xl hover:bg-primary text-primary-foreground transition text-sm font-semibold"
                >
                  Find a Tutor
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking._id}
                    className="border border-border rounded-xl p-4 flex justify-between items-center hover:bg-background transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <User size={18} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {booking.tutor?.name || "Tutor"}
                        </h3>
                        <p className="text-muted-foreground text-sm">{booking.subject}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="flex items-center justify-end gap-1.5 text-sm font-medium text-gray-700">
                        <Calendar size={14} className="text-indigo-500" />
                        {formatDate(booking.date)}
                      </p>
                      <p className="flex items-center justify-end gap-1.5 mt-1 text-sm text-muted-foreground">
                        <Clock size={14} className="text-indigo-500" />
                        {booking.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ======= PROFILE SUMMARY ======= */}
          <div className="space-y-6">

            {/* Profile Card */}
            <div className="bg-card border-border border rounded-2xl border border-border shadow-sm p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md mb-4">
                  <User size={38} />
                </div>
                <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                <p className="text-muted-foreground text-sm mt-1">Student Account</p>
              </div>

              <hr className="my-5 border-border" />

              <div className="space-y-3">
                <Link
                  to="/profile"
                  className="w-full bg-primary text-primary-foreground text-white py-2.5 rounded-xl font-semibold hover:bg-primary text-primary-foreground transition text-sm flex items-center justify-center gap-2"
                >
                  <User size={15} />
                  Edit Profile
                </Link>
                <Link
                  to="/my-booking"
                  className="w-full border border-indigo-200 text-primary py-2.5 rounded-xl font-semibold hover:bg-indigo-50 transition text-sm flex items-center justify-center gap-2"
                >
                  <BookOpen size={15} />
                  My Bookings
                </Link>
                <Link
                  to="/find-tutors"
                  className="w-full border border-border text-muted-foreground py-2.5 rounded-xl font-semibold hover:bg-background transition text-sm flex items-center justify-center gap-2"
                >
                  <Search size={15} />
                  Browse Tutors
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* ====================================================
            RECENT NOTIFICATIONS
        ==================================================== */}
        <div className="bg-card border-border border rounded-2xl border border-border shadow-sm p-6 mt-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Bell size={20} className="text-primary" />
              Recent Notifications
            </h2>
            <button
              onClick={() => navigate("/notifications")}
              className="text-primary font-semibold hover:text-indigo-800 text-sm flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>

          {loadingNotifications ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-border rounded-xl p-4">
                  <Skeleton height={18} width="80%" />
                  <Skeleton height={14} width={100} className="mt-2" />
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-10">
              <Bell size={40} className="mx-auto text-gray-200 mb-3" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification._id}
                  className={`border rounded-xl p-4 ${
                    !notification.isRead
                      ? "bg-indigo-50 border-indigo-200"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!notification.isRead && (
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-gray-700 text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}