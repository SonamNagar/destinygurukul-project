import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  MapPin,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import api from "../api/axiosInstance";
import TutorSkeleton from "./TutorSkeleton";
import RatingStars from "./RatingStars";

export default function TutorCard() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET APPROVED TUTORS (OPTIMIZED DATA FLOW)
  // ==========================================

  async function getTutors(force = false) {
    // 1. Check in-memory / session cache first to eliminate unnecessary data flow
    if (!force) {
      try {
        const cached = sessionStorage.getItem("featured_tutors_cache");
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 1000 * 60 * 5 && Array.isArray(data)) {
            setTutors(data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Session cache read error:", err);
      }
    }

    try {
      setLoading(true);
      setError("");

      // Request only 6 approved tutors rather than fetching the whole database
      const response = await api.get("/tutors?limit=6");

      const approvedTutors = Array.isArray(response.data)
        ? response.data.filter((tutor) => tutor.status === "approved" || !tutor.status)
        : [];

      setTutors(approvedTutors);

      try {
        sessionStorage.setItem(
          "featured_tutors_cache",
          JSON.stringify({ data: approvedTutors, timestamp: Date.now() })
        );
      } catch (cacheErr) {
        console.warn("Session cache write error:", cacheErr);
      }
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message ||
          "Unable to load tutors."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTutors();
  }, []);

  return (
    <section className="py-16 bg-[#09090b] border-t border-zinc-800/80">

      <div className="max-w-7xl mx-auto px-6">

        {/* ==========================================
            HEADING
        ========================================== */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">

          <div>

            <p className="text-zinc-400 font-medium text-xs uppercase tracking-wider">
              Featured Tutors
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mt-2 tracking-tight">
              Meet Our Tutors
            </h2>

            <p className="text-zinc-400 mt-2 max-w-2xl text-sm sm:text-base">
              Learn from qualified and approved tutors
              according to your subject and requirements.
            </p>

          </div>


          <Link
            to="/find-tutors"
            className="flex items-center gap-2 text-zinc-300 hover:text-white font-medium text-sm transition-colors"
          >
            View All Tutors
            <ArrowRight size={18} />
          </Link>

        </div>


        {/* ==========================================
            LOADING SKELETON
        ========================================== */}

        {loading && <TutorSkeleton count={3} />}


        {/* ==========================================
            ERROR
        ========================================== */}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">

            <p className="text-red-600">
              {error}
            </p>

            <button
              onClick={() => getTutors(true)}
              className="mt-4 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-medium transition cursor-pointer"
            >
              Try Again
            </button>

          </div>
        )}


        {/* ==========================================
            NO TUTORS
        ========================================== */}

        {!loading &&
          !error &&
          tutors.length === 0 && (
            <div className="bg-background border rounded-2xl p-10 text-center">

              <GraduationCap
                size={60}
                className="mx-auto text-gray-300 mb-4"
              />

              <h3 className="text-xl font-bold text-gray-700">
                No Approved Tutors Yet
              </h3>

              <p className="text-muted-foreground mt-2">
                Approved tutors will appear here once
                the admin approves their applications.
              </p>

            </div>
          )}


        {/* ==========================================
            TUTOR CARDS
        ========================================== */}

        {!loading &&
          !error &&
          tutors.length > 0 && (

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">

              {tutors.slice(0, 6).map((tutor) => (

                <div
                  key={tutor._id}
                  className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/70 transition-all duration-300 flex flex-col justify-between"
                >

                  <div>
                    {/* PHOTO */}

                    <div className="h-48 bg-zinc-900 flex items-center justify-center relative overflow-hidden">

                      {tutor.photo ? (

                        <img
                          src={tutor.photo}
                          alt={tutor.name}
                          className="w-full h-full object-cover"
                        />

                      ) : (

                        <GraduationCap
                          size={64}
                          className="text-zinc-600"
                        />

                      )}

                      {/* RATING BADGE */}
                      <div className="absolute top-3 right-3 bg-zinc-900/90 border border-zinc-800 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                        <RatingStars rating={tutor.rating || 4.8} size={14} />
                        <span className="text-xs font-bold text-zinc-200">
                          {(tutor.rating || 4.8).toFixed(1)}
                        </span>
                      </div>

                    </div>


                    {/* CONTENT */}

                    <div className="p-6">

                      {/* NAME & RATING */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-bold text-zinc-100">
                          {tutor.name}
                        </h3>
                      </div>


                      {/* SUBJECT */}

                      <p className="text-zinc-300 font-medium text-sm mt-1">
                        {tutor.subject}
                      </p>


                      {/* DETAILS */}

                      <div className="space-y-2.5 mt-5">

                        {/* Qualification */}

                        <div className="flex items-center gap-2.5 text-zinc-400 text-xs sm:text-sm">

                          <GraduationCap
                            size={16}
                            className="text-zinc-500 shrink-0"
                          />

                          <span className="truncate">
                            {tutor.qualification}
                          </span>

                        </div>


                        {/* City */}

                        <div className="flex items-center gap-2.5 text-zinc-400 text-xs sm:text-sm">

                          <MapPin
                            size={16}
                            className="text-zinc-500 shrink-0"
                          />

                          <span className="truncate">
                            {tutor.city}
                          </span>

                        </div>


                        {/* Experience */}

                        <div className="flex items-center gap-2.5 text-zinc-400 text-xs sm:text-sm">

                          <BookOpen
                            size={16}
                            className="text-zinc-500 shrink-0"
                          />

                          <span className="truncate">
                            {tutor.experience || 0} years experience
                          </span>

                        </div>

                      </div>

                    </div>
                  </div>

                  {/* VIEW PROFILE BUTTON */}
                  <div className="px-6 pb-6 pt-0">
                    <Link
                      to={`/teacher/${tutor._id}`}
                      className="w-full bg-zinc-100 text-zinc-950 hover:bg-zinc-200 py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm transition cursor-pointer"
                    >
                      View Profile
                      <ArrowRight size={16} />
                    </Link>
                  </div>

                </div>

              ))}

            </div>

          )}

      </div>

    </section>
  );
}