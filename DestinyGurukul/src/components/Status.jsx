
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

  // Fetch statistics from backend with session caching to minimize data flow
  useEffect(() => {
    async function fetchStats() {
      // 1. Check session cache first
      try {
        const cached = sessionStorage.getItem("destiny_stats_cache");
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 1000 * 60 * 10 && data) {
            setStatsData(data);
            setLoading(false);
            return;
          }
        }
      } catch (cacheErr) {
        console.warn("Stats cache read error:", cacheErr);
      }

      try {
        setLoading(true);

        const response = await api.get("/tutors/stats");

        if (response.data) {
          const freshData = {
            verifiedTutors: response.data.verifiedTutors || 0,
            happyStudents: response.data.happyStudents || 0,
            subjects: response.data.subjects || 0,
            averageRating: response.data.averageRating || 4.9,
          };
          setStatsData(freshData);

          try {
            sessionStorage.setItem(
              "destiny_stats_cache",
              JSON.stringify({ data: freshData, timestamp: Date.now() })
            );
          } catch (cacheWriteErr) {
            console.warn("Stats cache write error:", cacheWriteErr);
          }
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

  // Stats cards data - Harmonized with Destiny Gurukul Brand Palette
  const stats = [
    {
      id: 1,
      icon: (
        <GraduationCap
          size={28}
          className="text-[#7367F0]"
        />
      ),
      bg: "bg-[#7367F0]/10 border-[#7367F0]/20",
      number: loading ? "..." : `${statsData.verifiedTutors}+`,
      title: "Verified Tutors in Bhopal",
      highlight: "100% Background Checked",
    },
    {
      id: 2,
      icon: (
        <Users
          size={28}
          className="text-[#28C76F]"
        />
      ),
      bg: "bg-[#28C76F]/10 border-[#28C76F]/20",
      number: loading ? "..." : `${statsData.happyStudents}+`,
      title: "Happy Students & Parents",
      highlight: "Across Bhopal Localities",
    },
    {
      id: 3,
      icon: (
        <BookOpen
          size={28}
          className="text-[#7367F0]"
        />
      ),
      bg: "bg-[#7367F0]/10 border-[#7367F0]/20",
      number: loading ? "..." : `${statsData.subjects}+`,
      title: "Subjects & Skills Covered",
      highlight: "CBSE • ICSE • State",
    },
    {
      id: 4,
      icon: (
        <Star
          size={28}
          className="text-[#FF9F43] fill-[#FF9F43]"
        />
      ),
      bg: "bg-[#FF9F43]/10 border-[#FF9F43]/20",
      number: loading ? "..." : `${statsData.averageRating} ★`,
      title: "Average Parent Rating",
      highlight: "Top Rated Tutors",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-[#09090b] py-14 border-y border-zinc-800/80"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, idx) => (
            <div
              key={item.id}
              ref={(el) => (cardsRef.current[idx] = el)}
              className="p-6 rounded-2xl group relative overflow-hidden bg-[#0c0c0e] border border-zinc-800/90 transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/50"
            >
              {/* Icon and Award */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3.5 rounded-xl border ${item.bg} group-hover:scale-105 transition-transform duration-300 shadow-sm`}
                >
                  {item.icon}
                </div>

                <Award
                  size={18}
                  className="text-zinc-600 group-hover:text-zinc-400 transition-colors duration-300"
                />
              </div>

              {/* Stats Number */}
              <h2 className="text-3xl font-black text-zinc-100 tracking-tight group-hover:text-white transition-colors duration-300">
                {item.number}
              </h2>

              {/* Stats Title */}
              <p className="mt-1.5 text-sm font-semibold text-zinc-300">
                {item.title}
              </p>

              {/* Stats Highlight */}
              <p className="mt-2 text-xs font-medium text-zinc-500">
                {item.highlight}
              </p>

              {/* Decorative Subtle Dark Sheen */}
              <div className="absolute -right-10 -bottom-10 w-28 h-28 rounded-full bg-white/[0.02] blur-2xl pointer-events-none group-hover:bg-white/[0.04] transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

