import { Search, CalendarCheck, CreditCard, GraduationCap, ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WorksCard() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);

  const steps = [
    {
      id: 1,
      icon: <Search size={36} className="text-[#7367F0]" />,
      badgeBg: "bg-[#7367F0]/15 border-[#7367F0]/30",
      title: "1. Search Verified Tutor",
      desc: "Bhopal ke apne area me subject aur class ke anusaar background-checked teachers compare karein.",
    },
    {
      id: 2,
      icon: <CalendarCheck size={36} className="text-[#9E95F5]" />,
      badgeBg: "bg-[#9E95F5]/15 border-[#9E95F5]/30",
      title: "2. Send Booking Request",
      desc: "Apna convenient date, time slot aur home address select karke teacher ko booking request bhejein.",
    },
    {
      id: 3,
      icon: <CreditCard size={36} className="text-[#FF9F43]" />,
      badgeBg: "bg-[#FF9F43]/15 border-[#FF9F43]/30",
      title: "3. Confirm with Payment",
      desc: "Teacher ke request accept karne par student ko online payment karni hoti hai booking confirm karne ke liye.",
      highlight: "Mandatory for Home Visit",
    },
    {
      id: 4,
      icon: <GraduationCap size={36} className="text-[#28C76F]" />,
      badgeBg: "bg-[#28C76F]/15 border-[#28C76F]/30",
      title: "4. Tutor Visits Your Home",
      desc: "Payment confirm hote hi certified teacher aapke ghar aakar personalized one-on-one class conduct karta hai.",
    },
  ];

  // GSAP ScrollTrigger animations
  useEffect(() => {
    const ctx = gsap.context(() => {
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

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.15,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-[#09090b] border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div ref={headingRef} className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 bg-zinc-900 text-zinc-300 border border-zinc-800 px-3.5 py-1 rounded-full text-xs font-medium tracking-wide mb-3">
            <ShieldCheck size={14} className="text-emerald-400" /> Transparent & Safe Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
            How Destiny Gurukul Works
          </h2>

          <p className="mt-3 text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Student ki suraksha aur teacher ki reliability ke liye transparent 4-step process follow kiya jata hai.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              ref={(el) => (cardsRef.current[idx] = el)}
              className="p-6 rounded-2xl text-center bg-[#0c0c0e] border border-zinc-800 flex flex-col justify-between relative group hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/70 transition-all duration-300"
            >
              <div>
                {/* Step Pill */}
                <div className="w-7 h-7 rounded-full bg-zinc-100 text-zinc-950 flex items-center justify-center mx-auto mb-4 font-bold text-xs shadow-sm">
                  {step.id}
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 group-hover:scale-105 transition-transform duration-300">
                    {step.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-zinc-100">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-2.5 text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {step.highlight && (
                <div className="mt-4 pt-3 border-t border-zinc-800/80">
                  <span className="text-[11px] font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md inline-block">
                    ⚡ {step.highlight}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
