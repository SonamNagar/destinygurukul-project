import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Calculator,
  Atom,
  BookOpen,
  Laptop,
  Music,
  Dumbbell,
  Palette,
  Languages,
  GraduationCap,
  Briefcase,
  Layers,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Default subject categories with appropriate icons
const iconMap = {
  mathematics: <Calculator size={40} className="text-blue-600" />,
  math: <Calculator size={40} className="text-blue-600" />,
  maths: <Calculator size={40} className="text-blue-600" />,
  science: <Atom size={40} className="text-green-600" />,
  physics: <Atom size={40} className="text-cyan-600" />,
  chemistry: <Atom size={40} className="text-emerald-600" />,
  biology: <Atom size={40} className="text-teal-600" />,
  english: <BookOpen size={40} className="text-red-500" />,
  computer: <Laptop size={40} className="text-purple-600" />,
  programming: <Laptop size={40} className="text-purple-600" />,
  coding: <Laptop size={40} className="text-purple-600" />,
  music: <Music size={40} className="text-pink-500" />,
  drawing: <Palette size={40} className="text-orange-500" />,
  art: <Palette size={40} className="text-orange-500" />,
  "yoga & fitness": <Dumbbell size={40} className="text-cyan-600" />,
  yoga: <Dumbbell size={40} className="text-cyan-600" />,
  fitness: <Dumbbell size={40} className="text-cyan-600" />,
  languages: <Languages size={40} className="text-primary" />,
  hindi: <Languages size={40} className="text-amber-600" />,
  commerce: <Briefcase size={40} className="text-blue-700" />,
  accounts: <Briefcase size={40} className="text-blue-700" />,
};

function getSubjectIcon(name) {
  if (!name) return <GraduationCap size={40} className="text-blue-600" />;
  const normalized = name.toLowerCase().trim();
  return iconMap[normalized] || <Layers size={40} className="text-primary" />;
}

const defaultPopularSubjects = [
  "Mathematics",
  "Science",
  "English",
  "Computer",
  "Music",
  "Drawing",
  "Yoga & Fitness",
  "Languages",
];

export default function SubjectCard() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubjects() {
      // 1. Check session cache first to reduce Home page data flow
      try {
        const cached = sessionStorage.getItem("destiny_popular_subjects_cache");
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 1000 * 60 * 10 && Array.isArray(data) && data.length > 0) {
            setSubjectsList(data);
            setLoading(false);
            return;
          }
        }
      } catch (cacheErr) {
        console.warn("Subjects cache read error:", cacheErr);
      }

      try {
        setLoading(true);
        const response = await api.get("/tutors/popular-subjects");

        if (Array.isArray(response.data) && response.data.length > 0) {
          setSubjectsList(response.data);
          try {
            sessionStorage.setItem(
              "destiny_popular_subjects_cache",
              JSON.stringify({ data: response.data, timestamp: Date.now() })
            );
          } catch (writeErr) {
            console.warn("Subjects cache write error:", writeErr);
          }
        } else {
          // If no approved tutor subjects in DB yet, show default categories with 0 count
          const defaultList = defaultPopularSubjects.map((name) => ({
            name,
            tutorsCount: 0,
          }));
          setSubjectsList(defaultList);
        }
      } catch (error) {
        console.log("Subjects fetch error:", error);
        setSubjectsList(
          defaultPopularSubjects.map((name) => ({
            name,
            tutorsCount: 0,
          }))
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSubjects();
  }, []);

  // GSAP animations
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // Heading fade in
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        }
      );

      // Cards stagger animation
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { y: 50, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.3)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  const handleExplore = (subjectName) => {
    navigate(`/find-tutors?subject=${encodeURIComponent(subjectName)}`);
  };

  return (
    <section ref={sectionRef} className="py-20 bg-[#09090b] border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">Popular Subjects</h2>
          <p className="mt-3 text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">
            Choose from a wide range of subjects and connect with experienced
            tutors for personalized learning.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-10 text-zinc-500 text-sm">
            Loading subjects...
          </div>
        ) : (
          /* Cards */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {subjectsList.map((subject, idx) => (
              <div
                key={subject.name || idx}
                ref={(el) => (cardsRef.current[idx] = el)}
                onClick={() => handleExplore(subject.name)}
                className="p-6 rounded-2xl bg-[#0c0c0e] border border-zinc-800 text-center cursor-pointer flex flex-col justify-between group hover:border-zinc-600 hover:shadow-2xl hover:shadow-black/60 transition-all duration-300"
              >
                <div>
                  <div className="flex justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                    <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700">
                      {getSubjectIcon(subject.name)}
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-zinc-100 group-hover:text-white transition-colors">
                    {subject.name}
                  </h3>

                  <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 font-medium">
                    {subject.tutorsCount > 0
                      ? `${subject.tutorsCount} Verified Tutor${
                          subject.tutorsCount > 1 ? "s" : ""
                        }`
                      : "Explore Bhopal Tutors"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExplore(subject.name);
                  }}
                  className="mt-5 w-full bg-zinc-100 text-zinc-950 hover:bg-zinc-200 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition cursor-pointer"
                >
                  Explore Tutors
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
