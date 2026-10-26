import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    setSending(true);
    setTimeout(() => {
      toast.success("Message sent! Our support team will get back to you shortly.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSending(false);
    }, 1000);
  };

  return (
    <div className="bg-background text-white min-h-screen py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Heading */}
        <div className="text-center mb-14">
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md uppercase tracking-wider">
            24/7 Support Center
          </span>
          <h1 className="text-5xl lg:text-6xl font-black mt-4 bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
            Contact Destiny Gurukul Bhopal
          </h1>

          <p className="text-indigo-200 mt-4 max-w-2xl mx-auto text-base">
            Have questions about Home Tutors in Bhopal, bookings, or teacher registration?
            Our support team is here to assist you 7 days a week.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Contact Form */}
          <div className="bg-card/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">

            <h2 className="text-3xl font-extrabold mb-6 text-white flex items-center gap-2">
              <Sparkles className="text-amber-400" size={24} /> Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-card/10 border border-white/20 rounded-2xl p-3.5 text-white placeholder-indigo-300/50 outline-none focus:border-indigo-400 focus:bg-card/20 transition text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-card/10 border border-white/20 rounded-2xl p-3.5 text-white placeholder-indigo-300/50 outline-none focus:border-indigo-400 focus:bg-card/20 transition text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Home Tutor for Class 10 Math in Bhopal"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-card/10 border border-white/20 rounded-2xl p-3.5 text-white placeholder-indigo-300/50 outline-none focus:border-indigo-400 focus:bg-card/20 transition text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
                  Your Message
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Describe your tuition requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-card/10 border border-white/20 rounded-2xl p-3.5 text-white placeholder-indigo-300/50 outline-none focus:border-indigo-400 focus:bg-card/20 transition text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-primary text-primary-foreground hover:bg-indigo-500 text-white py-3.5 rounded-2xl font-bold transition shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                <Send size={16} />
                {sending ? "Sending..." : "Send Message"}
              </button>

            </form>

          </div>

          {/* Contact Info */}
          <div className="space-y-6">

            <div className="bg-card/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex gap-5 hover:bg-card/10 transition shadow-xl items-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <MapPin size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Office Address</h3>
                <p className="text-indigo-200 text-sm mt-0.5">
                  Bhopal, Madhya Pradesh 462001
                </p>
              </div>
            </div>

            <div className="bg-card/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex gap-5 hover:bg-card/10 transition shadow-xl items-center">
              <div className="w-14 h-14 rounded-2xl bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                <Phone size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Phone Support</h3>
                <p className="text-indigo-200 text-sm mt-0.5">+91 98765 43210 (Mon-Sat 8AM - 8PM)</p>
              </div>
            </div>

            <div className="bg-card/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex gap-5 hover:bg-card/10 transition shadow-xl items-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Mail size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Email Address</h3>
                <p className="text-indigo-200 text-sm mt-0.5">
                  support@destinygurukul.com
                </p>
              </div>
            </div>

            <div className="bg-card/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex gap-5 hover:bg-card/10 transition shadow-xl items-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Clock size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Working Hours</h3>
                <p className="text-indigo-200 text-sm mt-0.5">Monday – Sunday: 8:00 AM – 9:00 PM</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
