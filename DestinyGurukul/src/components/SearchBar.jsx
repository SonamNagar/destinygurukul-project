import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BHOPAL_AREAS } from "../constants/bhopalAreas";

export default function SearchBar() {
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [classes, setClasses] = useState("");
  const [area, setArea] = useState("");
  const [budget, setBudget] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (subject.trim()) {
      params.append("subject", subject.trim());
    }

    if (classes) {
      params.append("classes", classes);
    }

    if (area) {
      params.append("area", area);
    }

    if (budget) {
      params.append("budget", budget);
    }

    navigate(`/find-tutors?${params.toString()}`);
  };

  return (
    <section className="bg-[#09090b] py-10 border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-6">

        <div className="bg-[#0c0c0e] border border-zinc-800 shadow-xl rounded-2xl p-6 md:p-8">

          <h2 className="text-xl sm:text-2xl font-bold text-center text-zinc-100 mb-6 tracking-tight">
            Find Your Perfect Tutor in Bhopal
          </h2>

          <form onSubmit={handleSearch}>

            <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-4">

              {/* Subject */}
              <input
                type="text"
                placeholder="Subject (e.g. Maths)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 rounded-xl px-4 py-3 outline-none focus:border-zinc-500 text-sm transition"
              />

              {/* Class */}
              <select
                value={classes}
                onChange={(e) => setClasses(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl px-4 py-3 outline-none focus:border-zinc-500 text-sm cursor-pointer transition"
              >
                <option value="" className="bg-zinc-900 text-white">Select Class</option>
                <option value="1-5" className="bg-zinc-900 text-white">1 - 5</option>
                <option value="6-8" className="bg-zinc-900 text-white">6 - 8</option>
                <option value="9-10" className="bg-zinc-900 text-white">9 - 10</option>
                <option value="11-12" className="bg-zinc-900 text-white">11 - 12</option>
                <option value="College" className="bg-zinc-900 text-white">College</option>
              </select>

              {/* Area in Bhopal */}
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl px-4 py-3 outline-none focus:border-zinc-500 text-sm cursor-pointer transition"
              >
                <option value="" className="bg-zinc-900 text-white">All Bhopal Areas</option>
                {BHOPAL_AREAS.map((a) => (
                  <option key={a} value={a} className="bg-zinc-900 text-white">{a}</option>
                ))}
              </select>

              {/* Budget */}
              <input
                type="number"
                placeholder="Max Budget (₹)"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                min="0"
                className="bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 rounded-xl px-4 py-3 outline-none focus:border-zinc-500 text-sm transition"
              />

              {/* Search */}
              <button
                type="submit"
                className="bg-white text-zinc-950 hover:bg-zinc-200 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition py-3 cursor-pointer shadow-sm"
              >
                <Search size={18} />
                <span>Search</span>
              </button>

            </div>

          </form>

        </div>

      </div>
    </section>
  );
}