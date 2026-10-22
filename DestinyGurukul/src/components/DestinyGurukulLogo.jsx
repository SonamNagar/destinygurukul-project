import React, { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * DestinyGurukulLogo - Premium Animated Logo Component
 * Incorporates Vuexy-style vibrant gradients and smooth GSAP animations.
 *
 * @param {string} size - "sm" | "md" | "lg"
 * @param {boolean} showTagline - whether to display the sub-label
 * @param {string} theme - "light" | "dark" | "auto"
 * @param {string} className - extra classes
 */
export default function DestinyGurukulLogo({
  size = "md",
  showTagline = true,
  _theme = "auto",
  className = "",
}) {
  const containerRef = useRef(null);
  const emblemRef = useRef(null);
  const destinyTextRef = useRef(null);
  const gurukulTextRef = useRef(null);
  const taglineRef = useRef(null);
  const glowRef = useRef(null);
  const starRaysRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: "back.out(1.7)" } });

      tl.fromTo(
        emblemRef.current,
        { scale: 0.4, rotation: -45, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.9 }
      )
        .fromTo(
          destinyTextRef.current,
          { x: -20, opacity: 0, filter: "blur(4px)" },
          { x: 0, opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          gurukulTextRef.current,
          { x: 20, opacity: 0, filter: "blur(4px)" },
          { x: 0, opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "power3.out" },
          "-=0.4"
        );

      if (taglineRef.current) {
        tl.fromTo(
          taglineRef.current,
          { y: 6, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
          "-=0.3"
        );
      }

      // Continuous breathing ambient glow
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          scale: 1.18,
          opacity: 0.85,
          duration: 2.2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      // Subtle slow rotating star rays
      if (starRaysRef.current) {
        gsap.to(starRaysRef.current, {
          rotation: 360,
          duration: 24,
          repeat: -1,
          ease: "none",
          transformOrigin: "center center",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = () => {
    if (emblemRef.current) {
      gsap.to(emblemRef.current, {
        rotation: "+=360",
        scale: 1.08,
        duration: 0.8,
        ease: "power2.out",
      });
    }
    if (gurukulTextRef.current) {
      gsap.to(gurukulTextRef.current, {
        scale: 1.05,
        duration: 0.25,
        yoyo: true,
        repeat: 1,
      });
    }
  };

  const handleMouseLeave = () => {
    if (emblemRef.current) {
      gsap.to(emblemRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  // Dimensions based on size
  const sizeMap = {
    sm: { emblem: 36, textDestiny: "text-lg", textGurukul: "text-lg", tag: "text-[9px]" },
    md: { emblem: 44, textDestiny: "text-xl sm:text-2xl", textGurukul: "text-xl sm:text-2xl", tag: "text-[10px]" },
    lg: { emblem: 56, textDestiny: "text-2xl sm:text-3xl", textGurukul: "text-2xl sm:text-3xl", tag: "text-xs" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`inline-flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group ${className}`}
    >
      {/* ================= ICON EMBLEM ================= */}
      <div className="relative flex items-center justify-center">
        {/* Vuexy Glowing Backdrop Blur */}
        <div
          ref={glowRef}
          className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#7367F0]/40 via-[#9E95F5]/30 to-[#FF9F43]/30 blur-md pointer-events-none"
        />

        {/* Outer Emblem Container */}
        <div
          ref={emblemRef}
          style={{ width: currentSize.emblem, height: currentSize.emblem }}
          className="relative rounded-2xl p-[1.5px] bg-gradient-to-tr from-[#7367F0] via-[#9E95F5] to-[#FF9F43] shadow-[0_4px_16px_rgba(115,103,240,0.35)] transition-shadow duration-300 group-hover:shadow-[0_6px_22px_rgba(115,103,240,0.55)]"
        >
          {/* Inner Badge Surface */}
          <div className="w-full h-full rounded-[14px] bg-[#161D31] flex items-center justify-center overflow-hidden relative">
            {/* Background subtle radial sheen */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(115,103,240,0.35),transparent_70%)]" />

            {/* Custom SVG Emblem: Wisdom Torch & Cosmic Destiny Star */}
            <svg
              viewBox="0 0 100 100"
              className="w-[82%] h-[82%] relative z-10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="vuexyGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7367F0" />
                  <stop offset="50%" stopColor="#9E95F5" />
                  <stop offset="100%" stopColor="#CE9FFC" />
                </linearGradient>
                <linearGradient id="goldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF9F43" />
                  <stop offset="100%" stopColor="#FED7AA" />
                </linearGradient>
              </defs>

              {/* Rotating Star Rays */}
              <g ref={starRaysRef}>
                <line x1="50" y1="10" x2="50" y2="20" stroke="url(#goldGrad)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                <line x1="50" y1="80" x2="50" y2="90" stroke="url(#goldGrad)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                <line x1="10" y1="50" x2="20" y2="50" stroke="url(#goldGrad)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                <line x1="80" y1="50" x2="90" y2="50" stroke="url(#goldGrad)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                <circle cx="24" cy="24" r="1.5" fill="#FED7AA" opacity="0.6" />
                <circle cx="76" cy="24" r="1.5" fill="#FED7AA" opacity="0.6" />
                <circle cx="24" cy="76" r="1.5" fill="#FED7AA" opacity="0.6" />
                <circle cx="76" cy="76" r="1.5" fill="#FED7AA" opacity="0.6" />
              </g>

              {/* Sacred Open Book / Gurukul Wings */}
              <path
                d="M50 68 C42 63, 26 63, 20 69 L20 39 C26 33, 42 33, 50 38 C58 33, 74 33, 80 39 L80 69 C74 63, 58 63, 50 68 Z"
                fill="url(#vuexyGrad1)"
                opacity="0.9"
              />
              <path
                d="M50 38 L50 68"
                stroke="#161D31"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Flame of Knowledge / Destiny Star Core */}
              <path
                d="M50 20 C46 27, 43 31, 46 36 C48 39, 52 39, 54 36 C57 31, 54 27, 50 20 Z"
                fill="url(#goldGrad)"
              />
              <circle cx="50" cy="33" r="2" fill="#FFFFFF" />
            </svg>
          </div>
        </div>
      </div>

      {/* ================= BRAND TYPOGRAPHY ================= */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center tracking-tight">
          {/* Destiny */}
          <span
            ref={destinyTextRef}
            className={`${currentSize.textDestiny} font-extrabold tracking-tight text-slate-900 dark:text-teal transition-colors duration-200`}
          >
            Destiny
          </span>

          {/* Gurukul */}
          <span
            ref={gurukulTextRef}
            className={`${currentSize.textGurukul} font-black ml-1 bg-gradient-to-r from-[#7367F0] via-[#8B7FF6] to-[#CE9FFC] bg-clip-text text-transparent drop-shadow-sm`}
          >
            Gurukul
          </span>
        </div>

        {/* Tagline / Subtitle */}
        {showTagline && (
          <div
            ref={taglineRef}
            className={`flex items-center gap-1.5 mt-0.5 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-widest ${currentSize.tag}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9F43] inline-block animate-pulse" />
            <span>Home Tutors</span>
            <span className="text-[#7367F0] font-black">•</span>
            <span>Bhopal</span>
          </div>
        )}
      </div>
    </div>
  );
}
