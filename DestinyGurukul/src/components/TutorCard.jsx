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
  // GET APPROVED TUTORS
  // ==========================================

  async function getTutors() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tutors");

      // Sirf approved tutors
      const approvedTutors = response.data.filter(
        (tutor) => tutor.status === "approved"
      );

      setTutors(approvedTutors);

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
    <section className="py-16 bg-card border-border border">

      <div className="max-w-7xl mx-auto px-6">

        {/* ==========================================
            HEADING
        ========================================== */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">

          <div>

            <p className="text-primary font-semibold uppercase tracking-wide">
              Featured Tutors
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Meet Our Tutors
            </h2>

            <p className="text-muted-foreground mt-3 max-w-2xl">
              Learn from qualified and approved tutors
              according to your subject and requirements.
            </p>

          </div>


          <Link
            to="/find-tutors"
            className="flex items-center gap-2 text-primary font-semibold hover:text-indigo-800"
          >
            View All Tutors
            <ArrowRight size={19} />
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
              onClick={getTutors}
              className="mt-4 bg-primary text-primary-foreground text-white px-5 py-2 rounded-lg"
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
                  className="bg-card border-border border border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between"
                >

                  <div>
                    {/* PHOTO */}

                    <div className="h-48 bg-indigo-100 flex items-center justify-center relative overflow-hidden">

                      {tutor.photo ? (

                        <img
                          src={tutor.photo}
                          alt={tutor.name}
                          className="w-full h-full object-cover"
                        />

                      ) : (

                        <GraduationCap
                          size={70}
                          className="text-indigo-400"
                        />

                      )}

                      {/* RATING BADGE */}
                      <div className="absolute top-3 right-3 bg-card border-border border/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <RatingStars rating={tutor.rating || 4.8} size={14} />
                        <span className="text-xs font-bold text-gray-700">
                          {(tutor.rating || 4.8).toFixed(1)}
                        </span>
                      </div>

                    </div>


                    {/* CONTENT */}

                    <div className="p-6">

                      {/* NAME & RATING */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xl font-bold text-foreground">
                          {tutor.name}
                        </h3>
                      </div>


                      {/* SUBJECT */}

                      <p className="text-primary font-semibold mt-1">
                        {tutor.subject}
                      </p>


                      {/* DETAILS */}

                      <div className="space-y-3 mt-5">

                        {/* Qualification */}

                        <div className="flex items-center gap-3 text-muted-foreground">

                          <GraduationCap
                            size={19}
                            className="text-indigo-500"
                          />

                          <span>
                            {tutor.qualification}
                          </span>

                        </div>


                        {/* City */}

                        <div className="flex items-center gap-3 text-muted-foreground">

                          <MapPin
                            size={19}
                            className="text-indigo-500"
                          />

                          <span>
                            {tutor.city}
                          </span>

                        </div>


                        {/* Experience */}

                        <div className="flex items-center gap-3 text-muted-foreground">

                          <BookOpen
                            size={19}
                            className="text-indigo-500"
                          />

                          <span>
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
                      className="w-full bg-primary text-primary-foreground text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary text-primary-foreground transition font-medium"
                    >
                      View Profile
                      <ArrowRight size={18} />
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