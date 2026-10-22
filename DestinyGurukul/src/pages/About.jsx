
import { GraduationCap, Users, ShieldCheck, Target, } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">

        {/* Heading */}
        <div className="text-center mb-16">
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md uppercase tracking-wider">
            About Destiny Gurukul Bhopal
          </span>
          <h1 className="text-5xl lg:text-6xl font-black mt-4 bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
            Empowering Learning at Home in Bhopal
          </h1>

          <p className="mt-5 text-indigo-200 max-w-3xl mx-auto text-lg leading-relaxed font-light">
            Destiny Gurukul Bhopal is the city's premier platform connecting qualified, verified home tutors with students.
            We bring expert personalized education directly to your doorstep across all areas of Bhopal — MP Nagar, Arera Colony, Habibganj, Kolar & more.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">

          <div className="bg-card border-border border/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl hover:border-indigo-500/50 transition group">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition">
              <Target size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">Our Mission</h2>

            <p className="text-indigo-200 leading-relaxed">
              To make quality education accessible and personalized for every student in Bhopal by matching them with the ideal verified home tutor for their specific learning needs, schedule, and locality.
            </p>
          </div>

          <div className="bg-card border-border border/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl hover:border-purple-500/50 transition group">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">Our Vision</h2>

            <p className="text-indigo-200 leading-relaxed">
              To become Bhopal's most trusted home tuition platform, setting gold standards for safety, tutor verification, transparent fees, and exceptional academic results for students across the city.
            </p>
          </div>

        </div>

        {/* Why Choose Us */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-white">
              Why Choose Destiny Gurukul Bhopal?
            </h2>
            <p className="text-indigo-200 mt-2 text-sm">Designed for safety, quality, and proven academic growth in Bhopal.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-card border-border border/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center hover:bg-card border-border border/10 transition shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-6">
                <GraduationCap size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                100% Verified Bhopal Tutors
              </h3>

              <p className="text-indigo-200 text-sm leading-relaxed">
                Every teacher undergoes qualification checks, identity verification, and background evaluation before visiting student homes in Bhopal.
              </p>
            </div>

            <div className="bg-card border-border border/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center hover:bg-card border-border border/10 transition shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-6">
                <Users size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Personalized Home Visit
              </h3>

              <p className="text-indigo-200 text-sm leading-relaxed">
                One-on-one focused attention at your home in Bhopal. Custom study pace, doubt clearing, and exam preparation tailored to your needs.
              </p>
            </div>

            <div className="bg-card border-border border/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center hover:bg-card border-border border/10 transition shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Transparent & Safe
              </h3>

              <p className="text-indigo-200 text-sm leading-relaxed">
                No hidden charges. Book dates, manage payments online securely, and receive automated digital invoices.
              </p>
            </div>

          </div>
        </div>

        {/* CTA SECTION */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-3xl font-black text-white">Ready to find a Home Tutor in Bhopal?</h3>
            <p className="text-indigo-100 text-sm mt-1">Browse verified teachers in your area today.</p>
          </div>
          <Link
            to="/find-tutors"
            className="bg-card border-border border text-indigo-900 font-bold px-8 py-3.5 rounded-2xl hover:bg-indigo-50 transition shadow-lg text-sm"
          >
            Find Home Tutors Now
          </Link>
        </div>

      </div>
    </div>
  );
}