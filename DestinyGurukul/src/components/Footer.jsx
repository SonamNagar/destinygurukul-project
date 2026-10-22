import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import DestinyGurukulLogo from "./DestinyGurukulLogo";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Logo */}
        <div>
          <div className="mb-4">
            <DestinyGurukulLogo size="md" showTagline={true} />
          </div>

          <p className="text-sm leading-7">
            Bhopal's trusted home tutor platform. Destiny Gurukul Bhopal connects students
            with experienced & verified home tutors across all areas of Bhopal.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Quick Links
          </h3>

          <ul className="space-y-3">
            <li>
              <Link to="/" className="hover:text-blue-400">
                Home
              </Link>
            </li>

            <li>
              <Link to="/find-tutors" className="hover:text-blue-400">
                Find Tutors
              </Link>
            </li>

            <li>
              <Link to="/become-a-tutor" className="hover:text-blue-400">
                Become Tutor
              </Link>
            </li>

            <li>
              <Link to="/about" className="hover:text-blue-400">
                About
              </Link>
            </li>

            <li>
              <Link to="/contact" className="hover:text-blue-400">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Contact Us
          </h3>

          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <MapPin className="text-blue-500" size={20} />
              <span>Bhopal, Madhya Pradesh</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-blue-500" size={20} />
              <span>+91 98765 43210</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-blue-500" size={20} />
              <span>support@destinygurukul.com</span>
            </div>

          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Newsletter
          </h3>

          <p className="text-sm mb-4">
            Subscribe to receive the latest tutor updates in Bhopal.
          </p>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
          />

          <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 transition py-3 rounded-lg font-medium text-white">
            Subscribe
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Destiny Gurukul Bhopal. All Rights Reserved.
          </p>

          <div className="flex gap-6 text-sm">
            <Link to="/" className="hover:text-blue-400">
              Privacy Policy
            </Link>

            <Link to="/" className="hover:text-blue-400">
              Terms & Conditions
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}