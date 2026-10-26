import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import DestinyGurukulLogo from "./DestinyGurukulLogo";

export default function Footer() {
  return (
    <footer className="bg-[#09090b] text-zinc-300 mt-20 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Logo */}
        <div>
          <div className="mb-4">
            <DestinyGurukulLogo size="md" showTagline={true} />
          </div>

          <p className="text-sm leading-relaxed text-zinc-400">
            Bhopal's trusted home tutor platform. Destiny Gurukul Bhopal connects students
            with experienced & verified home tutors across all areas of Bhopal.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-base font-semibold text-zinc-100 mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/" className="text-zinc-400 hover:text-white transition-colors">
                Home
              </Link>
            </li>

            <li>
              <Link to="/find-tutors" className="text-zinc-400 hover:text-white transition-colors">
                Find Tutors
              </Link>
            </li>

            <li>
              <Link to="/become-a-tutor" className="text-zinc-400 hover:text-white transition-colors">
                Become Tutor
              </Link>
            </li>

            <li>
              <Link to="/about" className="text-zinc-400 hover:text-white transition-colors">
                About
              </Link>
            </li>

            <li>
              <Link to="/contact" className="text-zinc-400 hover:text-white transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-base font-semibold text-zinc-100 mb-4">
            Contact Us
          </h3>

          <div className="space-y-3.5 text-sm text-zinc-300">

            <div className="flex items-center gap-3">
              <MapPin className="text-zinc-400" size={18} />
              <span>Bhopal, Madhya Pradesh</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-zinc-400" size={18} />
              <span>+91 98765 43210</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-zinc-400" size={18} />
              <span>support@destinygurukul.com</span>
            </div>

          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-base font-semibold text-zinc-100 mb-4">
            Newsletter
          </h3>

          <p className="text-sm text-zinc-400 mb-4">
            Subscribe to receive the latest tutor updates in Bhopal.
          </p>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 outline-none focus:border-zinc-500 text-sm text-white placeholder-zinc-500"
          />

          <button className="w-full mt-3 bg-white text-zinc-950 hover:bg-zinc-200 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer">
            Subscribe
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} Destiny Gurukul Bhopal. All Rights Reserved.
          </p>

          <div className="flex gap-6 text-xs text-zinc-500">
            <Link to="/" className="hover:text-zinc-300 transition-colors">
              Privacy Policy
            </Link>

            <Link to="/" className="hover:text-zinc-300 transition-colors">
              Terms & Conditions
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}