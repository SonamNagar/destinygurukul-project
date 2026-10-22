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
      try {
        setLoading(true);
        const response = await api.get("/tutors/popular-subjects");

        if (Array.isArray(response.data) && response.data.length > 0) {
          setSubjectsList(response.data);
        } else {
          // If no approved tutor subjects in DB yet, show default categories with 0 count
          setSubjectsList(
            defaultPopularSubjects.map((name) => ({
              name,
              tutorsCount: 0,
            }))
          );
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
    <section ref={sectionRef} className="py-20 bg-card border-border border">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground">Popular Subjects</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Choose from a wide range of subjects and connect with experienced
            tutors for personalized learning.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-10 text-muted-foreground">
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
                className="vuexy-card vuexy-card-hover p-6 text-center cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <div className="p-4 rounded-2xl bg-[#7367F0]/10 border border-[#7367F0]/20">
                      {getSubjectIcon(subject.name)}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-[#7367F0] transition-colors">
                    {subject.name}
                  </h3>

                  <p className="text-slate-500 text-xs sm:text-sm mt-2 font-medium">
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
                  className="mt-5 w-full vuexy-btn-primary py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide"
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
