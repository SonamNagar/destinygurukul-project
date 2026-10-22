
import { useEffect, useState, useRef } from "react";
import { Users, BookOpen, Star, GraduationCap, Award } from "lucide-react";
import api from "../api/axiosInstance";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Stats() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  const [statsData, setStatsData] = useState({
    verifiedTutors: 0,
    happyStudents: 0,
    subjects: 0,
    averageRating: 4.9,
  });

  const [loading, setLoading] = useState(true);

  // Fetch statistics from backend
  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);

        const response = await api.get("/tutors/stats");

        if (response.data) {
          setStatsData({
            verifiedTutors: response.data.verifiedTutors || 0,
            happyStudents: response.data.happyStudents || 0,
            subjects: response.data.subjects || 0,
            averageRating: response.data.averageRating || 4.9,
          });
        }
      } catch (error) {
        console.log("Stats fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  // GSAP scroll-triggered animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        {
          y: 60,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  // Stats cards data
  const stats = [
    {
      id: 1,
      icon: (
        <GraduationCap
          size={28}
          className="text-[#14B8A6]"
        />
      ),
      bg: "bg-[#14B8A6]/10 border-[#14B8A6]/20",
      number: loading ? "..." : `${statsData.verifiedTutors}+`,
      title: "Verified Tutors in Bhopal",
      highlight: "100% Background Checked",
    },
    {
      id: 2,
      icon: (
        <Users
          size={28}
          className="text-[#14B8A6]"
        />
      ),
      bg: "bg-[#14B8A6]/10 border-[#14B8A6]/20",
      number: loading ? "..." : `${statsData.happyStudents}+`,
      title: "Happy Students & Parents",
      highlight: "Across Bhopal Localities",
    },
    {
      id: 3,
      icon: (
        <BookOpen
          size={28}
          className="text-[#14B8A6]"
        />
      ),
      bg: "bg-[#102A2A]/10 border-[#102A2A]/20",
      number: loading ? "..." : `${statsData.subjects}+`,
      title: "Subjects & Skills Covered",
      highlight: "CBSE • ICSE • State",
    },
    {
      id: 4,
      icon: (
        <Star
          size={28}
          className="text-[#14B8A6] fill-[#14B8A6]"
        />
      ),
      bg: "bg-[#102A2A]/10 border-[#102A2A]/20",
      number: loading ? "..." : `${statsData.averageRating} ★`,
      title: "Average Parent Rating",
      highlight: "Top Rated Tutors",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-slate-50/60 dark:bg-[#0b0f19] py-14 border-y border-slate-200/80 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, idx) => (
            <div
              key={item.id}
              ref={(el) => (cardsRef.current[idx] = el)}
              className="vuexy-card vuexy-card-hover p-6 rounded-2xl group relative overflow-hidden bg-white dark:bg-[#161D31] border border-[#14B8A6]/15 transition-all duration-300 hover:border-[#14B8A6]/50 hover:shadow-lg hover:shadow-[#14B8A6]/10"
            >
              {/* Icon and Award */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3.5 rounded-xl border ${item.bg} group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                >
                  {item.icon}
                </div>

                <Award
                  size={18}
                  className="text-[#14B8A6]/40 group-hover:text-[#14B8A6] transition-colors duration-300"
                />
              </div>

              {/* Stats Number */}
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-[#14B8A6] transition-colors duration-300">
                {item.number}
              </h2>

              {/* Stats Title */}
              <p className="mt-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                {item.title}
              </p>

              {/* Stats Highlight */}
              <p className="mt-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                {item.highlight}
              </p>

              {/* Decorative Teal Glow */}
              <div className="absolute -right-10 -bottom-10 w-28 h-28 rounded-full bg-[#14B8A6]/5 blur-2xl pointer-events-none group-hover:bg-[#14B8A6]/10 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

