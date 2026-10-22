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
    <section className="bg-card border-border border py-10">
      <div className="max-w-7xl mx-auto px-6">

        <div className="bg-card border-border border shadow-xl rounded-2xl p-6">

          <h2 className="text-2xl font-bold text-center mb-6">
            Find Your Perfect Tutor in Bhopal
          </h2>

          <form onSubmit={handleSearch}>

            <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-4">

              {/* Subject */}
              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />

              {/* Class */}
              <select
                value={classes}
                onChange={(e) => setClasses(e.target.value)}
                className="border rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="">Select Class</option>
                <option value="1-5">1 - 5</option>
                <option value="6-8">6 - 8</option>
                <option value="9-10">9 - 10</option>
                <option value="11-12">11 - 12</option>
                <option value="College">College</option>
              </select>

              {/* Area in Bhopal */}
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="border rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="">All Bhopal Areas</option>
                {BHOPAL_AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>

              {/* Budget */}
              <input
                type="number"
                placeholder="Max Budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                min="0"
                className="border rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />

              {/* Search */}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2 font-semibold transition"
              >
                <Search size={20} />
                Search
              </button>

            </div>

          </form>

        </div>

      </div>
    </section>
  );
}