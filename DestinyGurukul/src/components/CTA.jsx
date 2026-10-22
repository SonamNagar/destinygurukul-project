import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Card entrance
      gsap.fromTo(
        cardRef.current,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      // Icon pulse animation
      gsap.to(iconRef.current, {
        scale: 1.15,
        duration: 1.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-tr from-[#7367F0] via-[#8B7FF6] to-[#CE9FFC] relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div ref={cardRef} className="bg-[#161D31]/90 backdrop-blur-xl rounded-3xl p-8 sm:p-14 text-center border border-white/20 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div ref={iconRef} className="bg-[#7367F0]/20 p-4 rounded-2xl border border-[#7367F0]/40 shadow-inner">
              <GraduationCap size={44} className="text-[#9E95F5]" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Ready to Find Your Home Tutor in Bhopal?
          </h2>

          <p className="text-slate-300 mt-5 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Connect with background-checked verified teachers visiting your home across Bhopal.
            Personalized attention, flexible timings, and free demo sessions.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link
              to="/find-tutors"
              className="bg-white text-[#7367F0] hover:bg-slate-100 px-8 py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-black/20 hover:scale-105 active:scale-95 duration-200 text-sm"
            >
              <span>Find Tutors in Bhopal</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/become-a-tutor"
              className="border border-white/30 text-white hover:bg-white/10 px-8 py-3.5 rounded-xl font-semibold transition hover:scale-105 active:scale-95 duration-200 text-sm backdrop-blur-md"
            >
              Become a Home Tutor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}