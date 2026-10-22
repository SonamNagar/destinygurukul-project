import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const FindTutors = lazy(() => import("./pages/FindTutors"));
const TeacherDetails = lazy(() => import("./pages/TeacherDetails"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const BecomeTutor = lazy(() => import("./pages/BecomeTutor"));

const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

const NotFound = lazy(() => import("./pages/NotFound"));
const MyBooking = lazy(() => import("./pages/MyBooking"));
const TeachingRequests = lazy(() => import("./pages/TeachingRequests"));
const TutorApplications = lazy(() => import("./pages/TutorApplications"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Profile = lazy(() => import("./pages/Profile"));

function App() {
  return (
    <BrowserRouter>
      {/* Toast Notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      <Navbar />

      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/find-tutors" element={<FindTutors />} />
          <Route path="/teacher/:id" element={<TeacherDetails />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/become-a-tutor" element={<BecomeTutor />} />
          <Route path="/footer" element={<Footer />} />

          {/* Student Protected Routes */}
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRoles={["student", "admin", "teacher"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-booking"
            element={
              <ProtectedRoute allowedRoles={["student", "admin", "teacher"]}>
                <MyBooking />
              </ProtectedRoute>
            }
          />

          {/* Teacher Protected Routes */}
          <Route
            path="/teacher-dashboard"
            element={
              <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teaching-requests"
            element={
              <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                <TeachingRequests />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutor-applications"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TutorApplications />
              </ProtectedRoute>
            }
          />

          {/* Common Authenticated Routes */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;