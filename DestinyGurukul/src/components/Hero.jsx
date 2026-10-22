import { Link, useNavigate } from "react-router-dom";
import { Search, Sparkles, ShieldCheck, Star, Clock, CheckCircle2, Award } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { BHOPAL_AREAS } from "../constants/bhopalAreas";
import gsap from "gsap";

export default function Hero() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const descRef = useRef(null);
  const searchRef = useRef(null);
  const buttonsRef = useRef(null);
  const imageContainerRef = useRef(null);
  const floatingBadge1Ref = useRef(null);
  const floatingBadge2Ref = useRef(null);
  const floatingBadge3Ref = useRef(null);
  const glowOrb1Ref = useRef(null);
  const glowOrb2Ref = useRef(null);

  const [subject, setSubject] = useState("");
  const [area, setArea] = useState("");

  // =========================
  // GSAP ANIMATIONS
  // =========================
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Ambient Orbs Breathing
      gsap.to(glowOrb1Ref.current, {
        scale: 1.25,
        x: 30,
        y: -20,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(glowOrb2Ref.current, {
        scale: 1.2,
        x: -25,
        y: 25,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });

      // Entrance Stagger Timeline
      tl.fromTo(
        badgeRef.current,
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
      )
        .fromTo(
          headingRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.3"
        )
        .fromTo(
          descRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          searchRef.current,
          { y: 35, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.4)" },
          "-=0.3"
        )
        .fromTo(
          buttonsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.3"
        )
        .fromTo(
          imageContainerRef.current,
          { x: 60, opacity: 0, scale: 0.92 },
          { x: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" },
          "-=0.7"
        )
        .fromTo(
          [floatingBadge1Ref.current, floatingBadge2Ref.current, floatingBadge3Ref.current],
          { scale: 0.6, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: "back.out(1.8)" },
          "-=0.3"
        );

      // Continuous Floating effect for Badges with varied rhythms
      gsap.to(floatingBadge1Ref.current, {
        y: -10,
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.to(floatingBadge2Ref.current, {
        y: 10,
        duration: 2.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.4,
      });

      gsap.to(floatingBadge3Ref.current, {
        y: -8,
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.8,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (subject.trim()) {
      params.append("subject", subject.trim());
    }

    if (area) {
      params.append("area", area);
    }

    navigate(`/find-tutors?${params.toString()}`);
  };

  const handleQuickTagClick = (tagSubject) => {
    setSubject(tagSubject);
  };

  return (
    <section
      ref={sectionRef}
      className="bg-[#0b0f19] text-white relative overflow-hidden pt-12 pb-20 lg:py-24"
    >
      {/* ================= VUEXY AMBIENT GLOWS ================= */}
      <div
        ref={glowOrb1Ref}
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#7367F0]/30 to-[#9E95F5]/20 rounded-full blur-[120px] pointer-events-none"
      />
      <div
        ref={glowOrb2Ref}
        className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-gradient-to-tr from-[#FF9F43]/20 via-[#7367F0]/25 to-purple-600/20 rounded-full blur-[130px] pointer-events-none"
      />

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#7367f0_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">

        {/* ================= LEFT CONTENT (7 COLS) ================= */}
        <div className="lg:col-span-7">

          {/* Vuexy Top Pill Badge */}
          <div className="inline-block">
            <span
              ref={badgeRef}
              className="inline-flex items-center gap-2 bg-[#7367F0]/15 text-[#9E95F5] border border-[#7367F0]/30 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-md shadow-[0_0_20px_rgba(115,103,240,0.2)]"
            >
              <Sparkles size={16} className="text-[#FF9F43] animate-spin-slow" />
              <span>Bhopal's #1 Verified Home Tutor Platform</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#28C76F] inline-block animate-pulse ml-1" />
            </span>
          </div>

          {/* Hero Heading */}
          <h1
            ref={headingRef}
            className="text-4xl sm:text-5xl lg:text-6xl font-black mt-6 leading-[1.15] tracking-tight"
          >
            Find the Perfect{" "}
            <span className="bg-gradient-to-r from-[#7367F0] via-[#9E95F5] to-[#FF9F43] bg-clip-text text-transparent drop-shadow-sm">
              Home Tutor
            </span>{" "}
            at Your Doorstep in Bhopal
          </h1>

          {/* Description */}
          <p
            ref={descRef}
            className="mt-6 text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal"
          >
            Learn from verified, experienced educators visiting your home across Bhopal —
            <strong className="text-white font-semibold"> MP Nagar, Arera Colony, Kolar, Habibganj, Ayodhya Bypass</strong> & more.
            Expert personalized coaching for Class 1-12 (CBSE/ICSE/State), IIT-JEE, NEET & Skills.
          </p>

          {/* ================= VUEXY SEARCH CARD ================= */}
          <form
            ref={searchRef}
            onSubmit={handleSearch}
            className="mt-8 bg-[#161D31]/90 backdrop-blur-xl border border-[#7367F0]/25 shadow-[0_12px_40px_rgba(0,0,0,0.45)] rounded-2xl sm:rounded-3xl p-3 sm:p-4 transition-all duration-300 hover:border-[#7367F0]/40"
          >
            <div className="grid md:grid-cols-3 gap-3">

              {/* Subject Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Subject (e.g. Mathematics)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#25293c]/80 text-white placeholder-slate-400 border border-slate-700/80 rounded-xl px-4 py-3 outline-none focus:border-[#7367F0] focus:ring-2 focus:ring-[#7367F0]/30 transition text-sm font-medium"
                />
              </div>

              {/* Area Dropdown */}
              <div>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-[#25293c]/80 text-white border border-slate-700/80 rounded-xl px-4 py-3 outline-none focus:border-[#7367F0] focus:ring-2 focus:ring-[#7367F0]/30 transition text-sm font-medium cursor-pointer"
                >
                  <option value="" className="bg-[#161D31] text-white">All Localities in Bhopal</option>
                  {BHOPAL_AREAS.map((a) => (
                    <option key={a} value={a} className="bg-[#161D31] text-white">
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="vuexy-btn-primary rounded-xl font-bold flex items-center justify-center gap-2 py-3 px-5 cursor-pointer text-sm tracking-wide"
              >
                <Search size={18} />
                <span>Find Home Tutor</span>
              </button>
            </div>

            {/* Quick Filter Tags */}
            <div className="mt-3.5 pt-3 border-t border-slate-700/60 flex items-center gap-2 flex-wrap text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <Award size={13} className="text-[#FF9F43]" /> Popular:
              </span>
              {["Maths", "Physics", "Chemistry", "Biology", "English", "Accountancy"].map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleQuickTagClick(tag)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-[#7367F0]/20 hover:text-[#9E95F5] border border-slate-700/60 transition-all text-xs text-slate-300 cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>

          {/* ================= CALL TO ACTION BUTTONS ================= */}
          <div ref={buttonsRef} className="mt-8 flex gap-4 flex-wrap items-center">
            <Link
              to="/find-tutors"
              className="vuexy-btn-primary px-7 py-3.5 rounded-xl transition font-bold text-sm tracking-wide inline-flex items-center gap-2"
            >
              <span>Explore Verified Tutors</span>
              <span className="text-white/80">→</span>
            </Link>

            <Link
              to="/become-a-tutor"
              className="border border-[#7367F0]/40 text-slate-200 hover:text-white hover:border-[#7367F0] hover:bg-[#7367F0]/10 px-7 py-3.5 rounded-xl transition font-semibold text-sm backdrop-blur-md"
            >
              Become a Home Tutor
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-8 flex items-center gap-6 text-xs text-slate-400 flex-wrap">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-[#28C76F]" />
              <span>Free Demo Class</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-[#7367F0]" />
              <span>Aadhaar & Police Verified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-[#FF9F43]" />
              <span>Same-Day Matching</span>
            </div>
          </div>

        </div>

        {/* ================= RIGHT IMAGE & FLOATING CARDS (5 COLS) ================= */}
        <div ref={imageContainerRef} className="lg:col-span-5 relative flex justify-center items-center mt-6 lg:mt-0">

          {/* Backlight Glow Frame */}
          <div className="absolute -inset-3 bg-gradient-to-tr from-[#7367F0]/40 via-purple-500/20 to-[#FF9F43]/30 rounded-[32px] blur-2xl opacity-75" />

          {/* Image Wrapper */}
          <div className="relative z-10 w-full max-w-[480px]">
            <div className="rounded-3xl p-1 bg-gradient-to-b from-white/20 via-[#7367F0]/30 to-white/5 shadow-2xl">
              <div className="relative rounded-[22px] overflow-hidden bg-slate-900 aspect-[4/3] group">
                <img
                  src="/home_hero.jpg"
                  onError={(e) => {
                    // Fallback to high resolution education mentoring image if local asset cannot be loaded
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80";
                  }}
                  alt="Destiny Gurukul certified home tutor mentoring a student in Bhopal"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width="640"
                  height="480"
                />

                {/* Gradient vignette for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />

                {/* Bottom caption bar */}
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#28C76F] animate-ping" />
                    <span className="text-xs font-semibold text-white">Live In-Home Sessions</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#FF9F43] bg-[#FF9F43]/15 px-2 py-0.5 rounded-md">
                    Bhopal, MP
                  </span>
                </div>
              </div>
            </div>

            {/* ================= FLOATING VUEXY BADGE 1: VERIFIED TUTORS ================= */}
            <div
              ref={floatingBadge1Ref}
              className="absolute -bottom-6 -left-6 bg-[#161D31]/95 backdrop-blur-xl border border-[#7367F0]/30 p-3.5 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.5)] flex items-center gap-3 hidden sm:flex z-20"
            >
              <div className="w-11 h-11 rounded-xl bg-[#7367F0]/20 border border-[#7367F0]/40 flex items-center justify-center text-[#9E95F5]">
                <ShieldCheck size={22} className="text-[#7367F0]" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  Verified Tutors
                </p>
                <p className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <span>500+ Verified</span>
                  <span className="text-[#28C76F] text-xs">✓ Active</span>
                </p>
              </div>
            </div>

            {/* ================= FLOATING VUEXY BADGE 2: PARENT RATING ================= */}
            <div
              ref={floatingBadge2Ref}
              className="absolute -top-5 -right-5 bg-[#161D31]/95 backdrop-blur-xl border border-amber-500/30 px-4 py-2.5 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.5)] flex items-center gap-2.5 hidden sm:flex z-20"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FF9F43]/20 flex items-center justify-center text-[#FF9F43]">
                <Star size={17} className="fill-[#FF9F43]" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-white leading-tight">4.9 / 5.0</p>
                <p className="text-[10px] text-slate-400 font-medium">1,200+ Parent Reviews</p>
              </div>
            </div>

            {/* ================= FLOATING VUEXY BADGE 3: FAST MATCHING ================= */}
            <div
              ref={floatingBadge3Ref}
              className="absolute top-1/2 -right-8 -translate-y-1/2 bg-[#161D31]/95 backdrop-blur-xl border border-[#28C76F]/30 px-3.5 py-2 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.4)] flex items-center gap-2 hidden md:flex z-20"
            >
              <span className="w-2 h-2 rounded-full bg-[#28C76F]" />
              <span className="text-xs font-bold text-slate-200">2-Hr Match Time</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}