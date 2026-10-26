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
    <section ref={sectionRef} className="py-20 bg-[#09090b] border-t border-zinc-800/80 relative overflow-hidden">
      {/* Decorative Subtle Dark Orbs */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-zinc-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div ref={cardRef} className="bg-[#0c0c0e] rounded-3xl p-8 sm:p-14 text-center border border-zinc-800 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div ref={iconRef} className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 shadow-sm">
              <GraduationCap size={44} className="text-zinc-100" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-100 tracking-tight">
            Ready to Find Your Home Tutor in Bhopal?
          </h2>

          <p className="text-zinc-400 mt-5 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Connect with background-checked verified teachers visiting your home across Bhopal.
            Personalized attention, flexible timings, and free demo sessions.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link
              to="/find-tutors"
              className="bg-white text-zinc-950 hover:bg-zinc-200 px-8 py-3.5 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-sm text-sm cursor-pointer"
            >
              <span>Find Tutors in Bhopal</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/become-a-tutor"
              className="border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-900 px-8 py-3.5 rounded-xl font-medium transition text-sm cursor-pointer"
            >
              Become a Home Tutor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}