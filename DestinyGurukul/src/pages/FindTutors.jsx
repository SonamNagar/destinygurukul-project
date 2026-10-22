import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import { Link, useSearchParams } from "react-router-dom";

import {
  Search,
  MapPin,
  GraduationCap,
  BookOpen,
  Clock,
  IndianRupee,
  ArrowRight,
  XCircle,
} from "lucide-react";
import TutorSkeleton from "../components/TutorSkeleton";
import RatingStars from "../components/RatingStars";
import { BHOPAL_AREAS } from "../constants/bhopalAreas";

export default function FindTutors() {
  const [searchParams] = useSearchParams();
  // Search states
  const [search, setSearch] = useState(searchParams.get("subject") || "");
  const [area, setArea] = useState(searchParams.get("area") || "");
  const [sortBy, setSortBy] = useState("rating");
  const [maxFees, setMaxFees] = useState("");

  useEffect(() => {
    const qSubject = searchParams.get("subject");
    const qArea = searchParams.get("area");
    if (qSubject !== null) setSearch(qSubject);
    if (qArea !== null) setArea(qArea);
  }, [searchParams]);

  // ==========================================
  // GET TUTORS FROM BACKEND
  // ==========================================

  const fetchTutors = async () => {
    const response = await api.get("/tutors");
    // Sirf approved tutors jo Bhopal ke hain
    return response.data.filter(
      (tutor) =>
        tutor.status === "approved" &&
        tutor.city?.toLowerCase() === "bhopal"
    );
  };

  const { data: tutors = [], isLoading: loading, error: queryError, refetch: getTutors } = useQuery({
    queryKey: ['tutors'],
    queryFn: fetchTutors
  });

  const error = queryError ? queryError.response?.data?.message || "Unable to load tutors." : "";

  // ==========================================
  // FILTER & SORT TUTORS
  // ==========================================

  const filteredTutors = tutors
    .filter((tutor) => {
      const searchText = search.toLowerCase().trim();
      const areaText = area.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        tutor.name?.toLowerCase().includes(searchText) ||
        tutor.subject?.toLowerCase().includes(searchText) ||
        tutor.qualification?.toLowerCase().includes(searchText);

      const matchesArea =
        !areaText ||
        tutor.area?.toLowerCase().includes(areaText) ||
        tutor.address?.toLowerCase().includes(areaText);

      const matchesFees = !maxFees || Number(tutor.fees) <= Number(maxFees);

      return matchesSearch && matchesArea && matchesFees;
    })
    .sort((a, b) => {
      if (sortBy === "fees_asc") return (a.fees || 0) - (b.fees || 0);
      if (sortBy === "fees_desc") return (b.fees || 0) - (a.fees || 0);
      if (sortBy === "experience") return (b.experience || 0) - (a.experience || 0);
      // Default: Sort by rating
      return (b.rating || 0) - (a.rating || 0);
    });


  return (
    <div className="min-h-screen bg-background py-12 px-6">

      <div className="max-w-7xl mx-auto">


        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="text-center mb-10">

          <p className="text-primary font-semibold uppercase tracking-wide">
            Find Your Teacher in Bhopal
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2">
            Find Home Tutors in Bhopal
          </h1>

          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Search from our approved tutors in Bhopal and find
            the right teacher according to your needs and area.
          </p>

        </div>


        {/* ==========================================
            SEARCH BOX
        ========================================== */}

        <div className="bg-card border-border border rounded-2xl shadow p-6 mb-10">

          <div className="grid md:grid-cols-4 gap-4">


            {/* SEARCH */}

            <div>

              <label className="block font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Search Tutor / Subject
              </label>

              <div className="relative">

                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="e.g. Mathematics..."
                  className="w-full border border-border/80 bg-background rounded-xl py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />

              </div>

            </div>


            {/* AREA IN BHOPAL */}

            <div>

              <label className="block font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Area in Bhopal
              </label>

              <div className="relative">

                <MapPin
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <select
                  value={area}
                  onChange={(e) =>
                    setArea(e.target.value)
                  }
                  className="w-full border border-border/80 bg-background rounded-xl py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Bhopal Areas</option>
                  {BHOPAL_AREAS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>

              </div>

            </div>

            {/* MAX FEES */}

            <div>

              <label className="block font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Max Monthly Fee (₹)
              </label>

              <div className="relative">

                <IndianRupee
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <select
                  value={maxFees}
                  onChange={(e) => setMaxFees(e.target.value)}
                  className="w-full border border-border/80 bg-background rounded-xl py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Any Budget</option>
                  <option value="2000">Up to ₹2,000 / month</option>
                  <option value="4000">Up to ₹4,000 / month</option>
                  <option value="6000">Up to ₹6,000 / month</option>
                  <option value="10000">Up to ₹10,000 / month</option>
                </select>

              </div>

            </div>

            {/* SORT BY */}

            <div>

              <label className="block font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Sort Results By
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-border/80 bg-background rounded-xl py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="rating">Highest Rated ★</option>
                <option value="fees_asc">Fee: Low to High</option>
                <option value="fees_desc">Fee: High to Low</option>
                <option value="experience">Most Experienced</option>
              </select>

            </div>

          </div>


          {/* CLEAR */}

          {(search || area || maxFees || sortBy !== "rating") && (

            <button
              onClick={() => {
                setSearch("");
                setArea("");
                setMaxFees("");
                setSortBy("rating");
              }}
              className="mt-4 flex items-center gap-1.5 text-red-500 font-medium text-xs hover:text-red-700 cursor-pointer"
            >
              <XCircle size={15} />
              Reset Filters
            </button>

          )}

        </div>


        {/* ==========================================
            LOADING SKELETON
        ========================================== */}

        {loading && <TutorSkeleton count={6} />}


        {/* ==========================================
            ERROR
        ========================================== */}

        {!loading && error && (

          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">

            <XCircle
              size={50}
              className="mx-auto text-red-500 mb-4"
            />

            <h2 className="text-xl font-bold text-red-600">
              Unable to Load Tutors
            </h2>

            <p className="text-muted-foreground mt-2">
              {error}
            </p>

            <button
              onClick={getTutors}
              className="mt-5 bg-primary text-primary-foreground text-white px-6 py-3 rounded-xl"
            >
              Try Again
            </button>

          </div>

        )}


        {/* ==========================================
            RESULTS COUNT
        ========================================== */}

        {!loading && !error && (

          <div className="mb-6">

            <p className="text-muted-foreground">

              Showing{" "}

              <span className="font-bold text-foreground">
                {filteredTutors.length}
              </span>

              {" "}approved Bhopal tutor
              {filteredTutors.length !== 1 && "s"}

            </p>

          </div>

        )}


        {/* ==========================================
            NO RESULTS
        ========================================== */}

        {!loading &&
          !error &&
          filteredTutors.length === 0 && (

            <div className="bg-card border-border border rounded-2xl shadow p-12 text-center">

              <GraduationCap
                size={65}
                className="mx-auto text-gray-300 mb-5"
              />

              <h2 className="text-2xl font-bold text-gray-700">
                No Tutors Found in Bhopal
              </h2>

              <p className="text-muted-foreground mt-2">
                Try searching with another subject or area in Bhopal.
              </p>

            </div>
          )}


        {/* ==========================================
            TUTOR CARDS
        ========================================== */}

        {!loading &&
          !error &&
          filteredTutors.length > 0 && (

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">

              {filteredTutors.map((tutor) => (

                <div
                  key={tutor._id}
                  className="bg-card border-border border rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition flex flex-col justify-between"
                >

                  <div>
                    {/* PHOTO */}

                    <div className="h-52 bg-indigo-100 flex items-center justify-center relative overflow-hidden">

                      {tutor.photo ? (

                        <img
                          src={tutor.photo}
                          alt={tutor.name}
                          className="w-full h-full object-cover"
                        />

                      ) : (

                        <GraduationCap
                          size={75}
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

                    {/* NAME */}

                    <h2 className="text-xl font-bold text-foreground">
                      {tutor.name}
                    </h2>


                    {/* APPROVED */}

                    <span className="inline-block mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      ✓ Approved Tutor
                    </span>


                    {/* SUBJECT */}

                    <p className="text-primary font-semibold mt-4">
                      {tutor.subject}
                    </p>


                    {/* DETAILS */}

                    <div className="space-y-3 mt-5">


                      {/* Qualification */}

                      <div className="flex items-center gap-3 text-muted-foreground">

                        <GraduationCap
                          size={18}
                          className="text-indigo-500"
                        />

                        <span>
                          {tutor.qualification}
                        </span>

                      </div>


                      {/* Experience */}

                      <div className="flex items-center gap-3 text-muted-foreground">

                        <BookOpen
                          size={18}
                          className="text-indigo-500"
                        />

                        <span>
                          {tutor.experience || 0} years experience
                        </span>

                      </div>


                      {/* Area */}

                      <div className="flex items-center gap-3 text-muted-foreground">

                        <MapPin
                          size={18}
                          className="text-indigo-500"
                        />

                        <span>
                          {tutor.area ? `${tutor.area}, Bhopal` : "Bhopal"}
                        </span>

                      </div>


                      {/* Time */}

                      <div className="flex items-center gap-3 text-muted-foreground">

                        <Clock
                          size={18}
                          className="text-indigo-500"
                        />

                        <span>
                          {tutor.time}
                        </span>

                      </div>


                      {/* Fees */}

                      <div className="flex items-center gap-3 text-muted-foreground">

                        <IndianRupee
                          size={18}
                          className="text-indigo-500"
                        />

                        <span>
                          ₹{tutor.fees}
                        </span>

                      </div>

                    </div>
                  </div>
                </div>

                  {/* VIEW PROFILE */}
                  <div className="px-6 pb-6 pt-0">
                    <Link
                      to={`/teacher/${tutor._id}`}
                      className="w-full bg-primary text-primary-foreground text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-primary text-primary-foreground transition"
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

    </div>
  );
}