import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  Users,
  GraduationCap,
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  PieChart as PieChartIcon,
  BarChart3,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = React.useState(null);

  // ===============================
  // CHECK ADMIN LOGIN
  // ===============================
  React.useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== "admin") {
        navigate("/");
        return;
      }
      setAdmin(user);
    } catch (error) {
      console.log("Admin user parse error:", error);
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  // ===============================
  // GET ADMIN STATS
  // ===============================

  const fetchAdminStats = async () => {
    const response = await api.get("/admin/stats");
    return response.data;
  };

  const { data: stats = {
    totalStudents: 0,
    totalTutors: 0,
    approvedTutors: 0,
    pendingApplications: 0,
    totalBookings: 0,
    acceptedBookings: 0,
    pendingBookings: 0,
    rejectedBookings: 0,
  }, isLoading: loading, error: queryError } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchAdminStats,
    enabled: !!admin,
  });

  const error = queryError ? queryError.response?.data?.message || queryError.message || "Unable to load dashboard data." : "";

  // ===============================
  // CHART DATA FOR RECHARTS
  // ===============================
  const bookingChartData = [
    { name: "Accepted", count: stats.acceptedBookings, fill: "#10b981" },
    { name: "Pending", count: stats.pendingBookings, fill: "#f59e0b" },
    { name: "Rejected", count: stats.rejectedBookings, fill: "#ef4444" },
  ];

  const userDistributionData = [
    { name: "Students", value: stats.totalStudents || 1, color: "#6366f1" },
    { name: "Approved Tutors", value: stats.approvedTutors || 1, color: "#a855f7" },
    { name: "Pending Apps", value: stats.pendingApplications || 0, color: "#f59e0b" },
  ];


  // ===============================
  // LOGOUT
  // ===============================

  async function handleLogout() {
    try {
      await api.post("/users/logout");
    } catch (e) {
      console.log("Logout error:", e);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("teacherEmail");

    navigate("/login");
  }


  // ===============================
  // LOADING SKELETON
  // ===============================

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header skeleton */}
          <div className="bg-card border-border border rounded-2xl border border-border shadow-sm p-8 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton height={28} width={220} />
                <Skeleton height={18} width={150} className="mt-2" />
              </div>
              <Skeleton height={40} width={100} borderRadius={12} />
            </div>
          </div>
          {/* Stats grid skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card border-border border rounded-2xl border border-border shadow-sm p-6">
                <Skeleton circle width={48} height={48} className="mb-4" />
                <Skeleton height={28} width={50} />
                <Skeleton height={15} width={110} className="mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  // ===============================
  // ERROR
  // ===============================

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">

        <div className="bg-card border-border border p-8 rounded-2xl shadow text-center">

          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Access Denied
          </h2>

          <p className="text-muted-foreground mb-5">
            {error}
          </p>

          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Go Home
          </button>

        </div>

      </div>
    );
  }


  // ===============================
  // DASHBOARD
  // ===============================

  return (
    <div className="min-h-screen bg-background">

      {/* HEADER */}

      <header className="bg-card border-border border border-b">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>

            <p className="text-muted-foreground mt-1">
              Welcome, {admin?.name || "Admin"} 👋
            </p>

          </div>


          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </header>


      <main className="max-w-7xl mx-auto px-6 py-8">


        {/* MAIN STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">


          {/* STUDENTS */}

          <div className="bg-card border-border border rounded-2xl shadow p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-muted-foreground">
                  Total Students
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {stats.totalStudents}
                </h2>

              </div>

              <div className="bg-blue-100 p-3 rounded-xl">

                <Users
                  className="text-blue-600"
                  size={28}
                />

              </div>

            </div>

          </div>


          {/* TUTORS */}

          <div className="bg-card border-border border rounded-2xl shadow p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-muted-foreground">
                  Total Tutors
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {stats.totalTutors}
                </h2>

              </div>

              <div className="bg-purple-100 p-3 rounded-xl">

                <GraduationCap
                  className="text-purple-600"
                  size={28}
                />

              </div>

            </div>

          </div>


          {/* APPROVED TUTORS */}

          <div className="bg-card border-border border rounded-2xl shadow p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-muted-foreground">
                  Approved Tutors
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {stats.approvedTutors}
                </h2>

              </div>

              <div className="bg-green-100 p-3 rounded-xl">

                <CheckCircle
                  className="text-green-600"
                  size={28}
                />

              </div>

            </div>

          </div>


          {/* PENDING APPLICATIONS */}

          <div className="bg-card border-border border rounded-2xl shadow p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-muted-foreground">
                  Pending Applications
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {stats.pendingApplications}
                </h2>

              </div>

              <div className="bg-yellow-100 p-3 rounded-xl">

                <Clock
                  className="text-yellow-600"
                  size={28}
                />

              </div>

            </div>

          </div>

        </div>


        {/* BOOKING OVERVIEW */}

        <div className="mt-8">

          <h2 className="text-2xl font-bold text-foreground mb-5">
            Booking Overview
          </h2>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">


            {/* TOTAL BOOKINGS */}

            <div className="bg-card border-border border rounded-2xl shadow p-6">

              <CalendarCheck
                className="text-blue-600 mb-3"
                size={30}
              />

              <p className="text-muted-foreground">
                Total Bookings
              </p>

              <h3 className="text-3xl font-bold mt-2">
                {stats.totalBookings}
              </h3>

            </div>


            {/* ACCEPTED */}

            <div className="bg-card border-border border rounded-2xl shadow p-6">

              <CheckCircle
                className="text-green-600 mb-3"
                size={30}
              />

              <p className="text-muted-foreground">
                Accepted
              </p>

              <h3 className="text-3xl font-bold mt-2">
                {stats.acceptedBookings}
              </h3>

            </div>


            {/* PENDING */}

            <div className="bg-card border-border border rounded-2xl shadow p-6">

              <Clock
                className="text-yellow-600 mb-3"
                size={30}
              />

              <p className="text-muted-foreground">
                Pending
              </p>

              <h3 className="text-3xl font-bold mt-2">
                {stats.pendingBookings}
              </h3>

            </div>


            {/* REJECTED */}

            <div className="bg-card border-border border rounded-2xl shadow p-6">

              <XCircle
                className="text-red-600 mb-3"
                size={30}
              />

              <p className="text-muted-foreground">
                Rejected
              </p>

              <h3 className="text-3xl font-bold mt-2">
                {stats.rejectedBookings}
              </h3>

            </div>

          </div>

        </div>


        {/* ==========================================
            RECHARTS VISUAL ANALYTICS SECTION
        ========================================== */}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* BAR CHART: BOOKING STATUS DISTRIBUTION */}

          <div className="bg-card border border-border/80 rounded-2xl shadow-sm p-6">

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="text-indigo-600 dark:text-indigo-400" size={22} />
                <h3 className="text-lg font-bold text-foreground">
                  Booking Status Breakdown
                </h3>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-medium">
                Live Data
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "13px"
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>


          {/* PIE CHART: USER DISTRIBUTION */}

          <div className="bg-card border border-border/80 rounded-2xl shadow-sm p-6">

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <PieChartIcon className="text-purple-600 dark:text-purple-400" size={22} />
                <h3 className="text-lg font-bold text-foreground">
                  User Base Distribution
                </h3>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-medium">
                Real-time
              </span>
            </div>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "13px"
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>

        </div>


        {/* QUICK ACTIONS */}

        <div className="mt-8 bg-card border-border border rounded-2xl shadow p-6">

          <h2 className="text-2xl font-bold text-foreground mb-5">
            Quick Actions
          </h2>


          <div className="flex flex-wrap gap-4">

            <button
              onClick={() =>
                navigate("/tutor-applications")
              }
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
            >
              View Tutor Applications
            </button>


            <button
              onClick={() =>
                navigate("/notifications")
              }
              className="bg-purple-600 text-white px-5 py-3 rounded-lg hover:bg-purple-700"
            >
              Notifications
            </button>

          </div>

        </div>


        {/* ADMIN INFORMATION */}

        <div className="mt-8 bg-card border-border border rounded-2xl shadow p-6">

          <h2 className="text-2xl font-bold mb-4">
            Admin Information
          </h2>


          <div className="space-y-2 text-muted-foreground">

            <p>
              <strong>Name:</strong>{" "}
              {admin?.name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {admin?.email}
            </p>

            <p>
              <strong>Role:</strong>{" "}
              <span className="text-red-600 font-bold">
                {admin?.role}
              </span>
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}