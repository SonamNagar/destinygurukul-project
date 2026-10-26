import {
  Search,
  UserCheck,
  CalendarCheck,
  GraduationCap,
  ArrowRight,
  
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search size={36} className="text-indigo-400" />,
      title: "1. Search Tutors",
      desc: "Search verified teachers by subject, class grade, city or area pincode.",
      color: "from-indigo-500/20 to-indigo-900/40 border-indigo-500/30",
    },
    {
      icon: <UserCheck size={36} className="text-purple-400" />,
      title: "2. Compare Profiles",
      desc: "Check tutor qualification, years of experience, hourly fee, and ratings.",
      color: "from-purple-500/20 to-purple-900/40 border-purple-500/30",
    },
    {
      icon: <CalendarCheck size={36} className="text-pink-400" />,
      title: "3. Confirm with Payment",
      desc: "Teacher ke request accept karne par student securely online payment karta hai class confirm karne ke liye.",
      color: "from-pink-500/20 to-pink-900/40 border-pink-500/30",
    },
    {
      icon: <GraduationCap size={36} className="text-emerald-400" />,
      title: "4. Teacher Home Visit",
      desc: "Payment confirm hote hi verified teacher scheduled date & time par aapke ghar aakar padhata hai.",
      color: "from-emerald-500/20 to-emerald-900/40 border-emerald-500/30",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-white py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Heading */}
        <div className="text-center mb-16">
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md uppercase tracking-wider">
            Step-by-Step Guide
          </span>
          <h1 className="text-5xl lg:text-6xl font-black mt-4 bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
            How Destiny Gurukul Works
          </h1>

          <p className="mt-4 text-indigo-200 max-w-2xl mx-auto text-base font-light">
            Finding a qualified home tutor is quick, transparent, and completely hassle-free. Follow these 4 simple steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {steps.map((step, index) => (
            <div
              key={index}
              className={`bg-gradient-to-b ${step.color} backdrop-blur-xl border rounded-3xl p-8 text-center hover:scale-105 transition shadow-2xl flex flex-col justify-between`}
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-card/10 flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/10">
                  {step.icon}
                </div>

                <h2 className="text-xl font-bold mb-3 text-white">
                  {step.title}
                </h2>

                <p className="text-indigo-200 text-sm leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-xs font-bold text-indigo-300 uppercase tracking-widest">
                Step 0{index + 1}
              </div>
            </div>
          ))}

        </div>

        {/* Journey Timeline */}
        <div className="mt-16 bg-card/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">

          <h2 className="text-3xl font-extrabold text-center mb-8 text-white flex items-center justify-center gap-2">
            <Sparkles className="text-amber-400" size={24} /> Student Home Learning Journey
          </h2>

          <div className="flex flex-wrap justify-center items-center gap-4 text-center">

            <div className="bg-primary text-primary-foreground/30 border border-indigo-400/40 text-indigo-200 px-6 py-3.5 rounded-2xl font-bold text-sm backdrop-blur-md">
              1. Search Tutor
            </div>

            <ArrowRight className="text-indigo-400 hidden sm:block" />

            <div className="bg-purple-600/30 border border-purple-400/40 text-purple-200 px-6 py-3.5 rounded-2xl font-bold text-sm backdrop-blur-md">
              2. Tutor Accepts Request
            </div>

            <ArrowRight className="text-indigo-400 hidden sm:block" />

            <div className="bg-amber-600/30 border border-amber-400/40 text-amber-200 px-6 py-3.5 rounded-2xl font-bold text-sm backdrop-blur-md">
              3. Confirm with Advance Payment
            </div>

            <ArrowRight className="text-indigo-400 hidden sm:block" />

            <div className="bg-emerald-600/30 border border-emerald-400/40 text-emerald-200 px-6 py-3.5 rounded-2xl font-bold text-sm backdrop-blur-md">
              4. Certified Tutor Visits Home
            </div>

          </div>

          <div className="mt-10 text-center">
            <Link
              to="/find-tutors"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-3.5 rounded-2xl font-bold transition shadow-xl text-sm"
            >
              Start Searching Tutors Now <ArrowRight size={18} />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
