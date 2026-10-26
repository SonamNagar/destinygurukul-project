import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  User,
  LogOut,
  LayoutDashboard,
  CalendarCheck,
} from "lucide-react";
import gsap from "gsap";

import api from "../api/axiosInstance";
import DestinyGurukulLogo from "./DestinyGurukulLogo";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState(null);

  const isActive = (path) => location.pathname === path;

  // =========================
  // MOBILE MENU SCROLL LOCK & ESCAPE KEY
  // =========================
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  // =========================
  // GSAP NAVBAR ANIMATION
  // =========================
  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
      );
    }
  }, []);

  // =========================
  // GET USER FROM LOCALSTORAGE
  // =========================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.log("User data error:", error);
        setUser(null);
      }
    }
  }, []);

  // =========================
  // GET UNREAD NOTIFICATIONS
  // =========================
  useEffect(() => {
    if (!user?.email) {
      setUnreadCount(0);
      return;
    }

    const getUnreadNotifications = async () => {
      try {
        const response = await api.get(
          `/notifications/unread-count/${encodeURIComponent(
            user.email
          )}`
        );

        setUnreadCount(response.data.count || 0);
      } catch (error) {
        console.log(
          "Notification count error:",
          error.response?.data || error.message
        );
      }
    };

    getUnreadNotifications();

    // Every 10 seconds notification count update
    const interval = setInterval(() => {
      getUnreadNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    try {
      // Backend se cookies clear karwao (httpOnly cookies JS se clear nahi hoti)
      await api.post("/users/logout");
    } catch (error) {
      console.log("Logout error:", error);
    }

    // Local user data clear karo
    localStorage.removeItem("user");
    localStorage.removeItem("teacherEmail");

    setUser(null);
    setUnreadCount(0);
    setMenuOpen(false);

    navigate("/login");
  };

  // =========================
  // CLOSE MOBILE MENU
  // =========================
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // =========================
  // DASHBOARD LINK
  // =========================
  const getDashboardLink = () => {
    if (user?.role === "admin") {
      return "/admin-dashboard";
    }

    if (user?.role === "teacher") {
      return "/teacher-dashboard";
    }

    return "/student-dashboard";
  };

  return (
    <nav
      ref={navRef}
      className="w-full bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-800/80 sticky top-0 z-[1000]"
    >
      <div className="max-w-[1240px] mx-auto px-5 h-[76px] max-[500px]:h-[68px] max-[500px]:px-4 flex items-center justify-between">

        {/* ================= ANIMATED LOGO ================= */}
        <Link
          to="/"
          className="no-underline flex items-center"
          onClick={closeMenu}
          title="DestinyGurukul Home"
        >
          <DestinyGurukulLogo size="md" showTagline={true} />
        </Link>

        {/* ================= DESKTOP MENU ================= */}
        <div
          className={`flex items-center gap-1.5 lg:gap-2 max-[960px]:absolute max-[960px]:top-[76px] max-[500px]:top-[68px] max-[960px]:left-0 max-[960px]:w-full max-[960px]:bg-[#09090b] max-[960px]:flex-col max-[960px]:items-start max-[960px]:px-6 max-[960px]:py-6 max-[960px]:border-b max-[960px]:border-zinc-800 max-[960px]:shadow-2xl max-[960px]:gap-3 z-[995] ${
            menuOpen ? "max-[960px]:flex" : "max-[960px]:hidden"
          }`}
        >
          <Link
            to="/"
            onClick={closeMenu}
            className={`no-underline text-[14px] transition-all duration-200 max-[960px]:w-full px-3 py-1.5 rounded-lg ${
              isActive("/")
                ? "text-white font-medium bg-zinc-800"
                : "text-zinc-400 font-medium hover:text-white hover:bg-zinc-850/60"
            }`}
          >
            Home
          </Link>

          <Link
            to="/find-tutors"
            onClick={closeMenu}
            className={`no-underline text-[14px] transition-all duration-200 max-[960px]:w-full px-3 py-1.5 rounded-lg ${
              isActive("/find-tutors")
                ? "text-white font-medium bg-zinc-800"
                : "text-zinc-400 font-medium hover:text-white hover:bg-zinc-850/60"
            }`}
          >
            Find Tutors
          </Link>

          <Link
            to="/how-it-works"
            onClick={closeMenu}
            className={`no-underline text-[14px] transition-all duration-200 max-[960px]:w-full px-3 py-1.5 rounded-lg ${
              isActive("/how-it-works")
                ? "text-white font-medium bg-zinc-800"
                : "text-zinc-400 font-medium hover:text-white hover:bg-zinc-850/60"
            }`}
          >
            How It Works
          </Link>

          <Link
            to="/about"
            onClick={closeMenu}
            className={`no-underline text-[14px] transition-all duration-200 max-[960px]:w-full px-3 py-1.5 rounded-lg ${
              isActive("/about")
                ? "text-white font-medium bg-zinc-800"
                : "text-zinc-400 font-medium hover:text-white hover:bg-zinc-850/60"
            }`}
          >
            About
          </Link>

          <Link
            to="/contact"
            onClick={closeMenu}
            className={`no-underline text-[14px] transition-all duration-200 max-[960px]:w-full px-3 py-1.5 rounded-lg ${
              isActive("/contact")
                ? "text-white font-medium bg-zinc-800"
                : "text-zinc-400 font-medium hover:text-white hover:bg-zinc-850/60"
            }`}
          >
            Contact
          </Link>

          {/* Become Tutor - Pill */}
          <Link
            to="/become-a-tutor"
            onClick={closeMenu}
            className={`no-underline px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 max-[960px]:w-full text-center border ${
              isActive("/become-a-tutor")
                ? "bg-zinc-100 text-zinc-950 border-zinc-100 font-semibold"
                : "text-zinc-300 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white hover:border-zinc-700"
            }`}
          >
            Become a Tutor
          </Link>

          {/* ================= LOGGED IN MOBILE LINKS ================= */}
          {user && (
            <>
              {/* Dashboard */}
              <Link
                to={getDashboardLink()}
                className="hidden max-[960px]:flex items-center gap-2.5 no-underline text-slate-700 text-[15px] font-medium hover:text-[#7367F0] transition-colors duration-200"
                onClick={closeMenu}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              {/* My Booking - Student */}
              {user.role === "student" && (
                <Link
                  to="/my-booking"
                  className="hidden max-[960px]:flex items-center gap-2.5 no-underline text-slate-700 text-[15px] font-medium hover:text-[#7367F0] transition-colors duration-200"
                  onClick={closeMenu}
                >
                  <CalendarCheck size={18} />
                  My Bookings
                </Link>
              )}

              {/* Teaching Requests - Teacher */}
              {user.role === "teacher" && (
                <Link
                  to="/teaching-requests"
                  className="hidden max-[960px]:flex items-center gap-2.5 no-underline text-slate-700 text-[15px] font-medium hover:text-[#7367F0] transition-colors duration-200"
                  onClick={closeMenu}
                >
                  <CalendarCheck size={18} />
                  Teaching Requests
                </Link>
              )}

              {/* Notifications */}
              <Link
                to="/notifications"
                className="hidden max-[960px]:flex items-center gap-2.5 no-underline text-slate-700 text-[15px] font-medium hover:text-[#7367F0] transition-colors duration-200"
                onClick={closeMenu}
              >
                <Bell size={18} />
                Notifications

                {unreadCount > 0 && (
                  <span className="bg-[#EA5455] text-white min-w-[18px] h-[18px] px-1 rounded-full text-[10px] inline-flex items-center justify-center font-bold">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* ================= MOBILE AUTH ================= */}
          <div className="hidden max-[960px]:flex max-[960px]:w-full max-[960px]:flex-col max-[960px]:gap-3 max-[960px]:pt-3 max-[960px]:border-t max-[960px]:border-slate-200">
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-2.5 no-underline text-slate-700 text-[15px] font-medium hover:text-[#7367F0] transition-colors duration-200"
                >
                  <User size={18} />
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 border-none bg-transparent text-[#EA5455] text-[15px] cursor-pointer p-0 font-medium"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2.5 pt-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="no-underline text-zinc-300 text-[15px] font-medium hover:text-white transition-colors duration-200 text-center py-2"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="no-underline bg-white text-zinc-950 px-5 py-2.5 rounded-lg font-semibold text-center hover:bg-zinc-200 transition"
                  onClick={closeMenu}
                >
                  Register Now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Dashboard */}
              <Link
                to={getDashboardLink()}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 no-underline hover:bg-zinc-800 hover:text-white transition-all duration-200 max-[960px]:hidden"
                title="Dashboard"
              >
                <LayoutDashboard size={19} />
              </Link>

              {/* My Booking */}
              {user.role === "student" && (
                <Link
                  to="/my-booking"
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 no-underline hover:bg-zinc-800 hover:text-white transition-all duration-200 max-[960px]:hidden"
                  title="My Bookings"
                >
                  <CalendarCheck size={19} />
                </Link>
              )}

              {/* Teaching Requests */}
              {user.role === "teacher" && (
                <Link
                  to="/teaching-requests"
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 no-underline hover:bg-zinc-800 hover:text-white transition-all duration-200 max-[960px]:hidden"
                  title="Teaching Requests"
                >
                  <CalendarCheck size={19} />
                </Link>
              )}

              {/* ================= NOTIFICATION ================= */}
              <Link
                to="/notifications"
                className="relative w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 no-underline hover:bg-zinc-800 hover:text-white transition-all duration-200 max-[960px]:hidden"
                title="Notifications"
              >
                <Bell size={19} />

                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center border border-[#09090b]">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <Link
                to="/profile"
                className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 no-underline hover:bg-zinc-800 hover:text-white transition-all duration-200 max-[960px]:hidden"
                title="Profile"
              >
                <User size={19} />
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-red-400 border-none bg-transparent cursor-pointer hover:bg-red-500/10 transition-all duration-200 max-[960px]:hidden"
                title="Logout"
              >
                <LogOut size={19} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="no-underline text-zinc-300 hover:text-white font-medium text-[14px] px-3 py-1.5 rounded-lg transition-colors duration-200 max-[960px]:hidden"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="no-underline bg-white text-zinc-950 hover:bg-zinc-200 px-4 py-2 rounded-lg text-[13px] font-semibold transition max-[960px]:hidden"
              >
                <span>Register</span>
              </Link>
            </div>
          )}

          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            className="hidden max-[960px]:flex items-center justify-center p-2 rounded-lg border border-zinc-800 bg-zinc-900 cursor-pointer text-zinc-300 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE BACKDROP OVERLAY ================= */}
      {menuOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 top-[76px] max-[500px]:top-[68px] bg-slate-950/40 backdrop-blur-sm z-[990] min-[961px]:hidden"
          aria-hidden="true"
        />
      )}
    </nav>
  );
};

export default Navbar;