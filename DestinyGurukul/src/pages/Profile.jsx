import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Save,
  Camera,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Profile() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    city: "",
    qualification: "",
    address: "",
    bio: "",
  });

  // ==========================================
  // LOAD USER PROFILE
  // ==========================================
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchProfile = async () => {
    const response = await api.get("/users/profile");
    return response.data;
  };

  const { data: userProfile, isLoading: loading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        email: userProfile.email || "",
        phoneNumber: userProfile.phoneNumber || "",
        city: userProfile.city || "",
        qualification: userProfile.qualification || "",
        address: userProfile.address || "",
        bio: userProfile.bio || "",
      });
    } else if (!loading) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setFormData({
            name: user.name || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
            city: user.city || "",
            qualification: user.qualification || "",
            address: user.address || "",
            bio: user.bio || "",
          });
        } catch  {}
      }
    }
  }, [userProfile, loading]);

  // ==========================================
  // HANDLE CHANGE
  // ==========================================
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // ==========================================
  // SAVE PROFILE
  // ==========================================
  async function handleSave(e) {
    e.preventDefault();

    try {
      setSaving(true);
      const response = await api.put("/users/profile", formData);

      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, ...response.data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background py-10 px-6">
      <div className="max-w-4xl mx-auto">

        {/* ==========================================
            HEADER
        ========================================== */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal information and account settings
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ==========================================
              LEFT - AVATAR CARD
          ========================================== */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 text-center">

              {/* Avatar */}
              <div className="relative w-28 h-28 mx-auto mb-4">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg">
                  {loading ? (
                    <Skeleton circle width={112} height={112} />
                  ) : (
                    <User size={50} />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-white shadow hover:bg-primary text-primary-foreground transition">
                  <Camera size={14} />
                </button>
              </div>

              {/* Name */}
              <h2 className="text-xl font-bold text-foreground">
                {loading ? <Skeleton width={120} /> : formData.name || "Your Name"}
              </h2>

              <p className="text-muted-foreground text-sm mt-1">
                {loading ? <Skeleton width={80} /> : formData.email}
              </p>

              <div className="mt-4 inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                <CheckCircle size={14} />
                Verified Account
              </div>

              {/* Quick Info */}
              <div className="mt-6 space-y-3 text-left">
                {loading ? (
                  <>
                    <Skeleton height={20} />
                    <Skeleton height={20} />
                    <Skeleton height={20} />
                  </>
                ) : (
                  <>
                    {formData.city && (
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <MapPin size={14} className="text-indigo-500" />
                        {formData.city}
                      </div>
                    )}
                    {formData.phoneNumber && (
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Phone size={14} className="text-indigo-500" />
                        {formData.phoneNumber}
                      </div>
                    )}
                    {formData.qualification && (
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <GraduationCap size={14} className="text-indigo-500" />
                        {formData.qualification}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ==========================================
              RIGHT - FORM CARD
          ========================================== */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl shadow-sm border border-border p-8">

              <h3 className="text-lg font-bold text-foreground mb-6 pb-4 border-b border-border">
                Personal Information
              </h3>

              {loading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i}>
                      <Skeleton height={16} width={80} className="mb-2" />
                      <Skeleton height={48} borderRadius={12} />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <Skeleton height={16} width={80} className="mb-2" />
                    <Skeleton height={112} borderRadius={12} />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-6">

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full border border-border rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-background focus:bg-card"
                      />
                    </div>
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        readOnly
                        className="w-full border border-border rounded-xl py-3 pl-11 pr-4 outline-none bg-background text-muted-foreground cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <AlertCircle size={11} />
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="e.g. 9876543210"
                        className="w-full border border-border rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-background focus:bg-card"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      City
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Indore"
                        className="w-full border border-border rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-background focus:bg-card"
                      />
                    </div>
                  </div>

                  {/* Qualification */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Qualification
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        placeholder="e.g. B.Tech, MBA, B.Ed"
                        className="w-full border border-border rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-background focus:bg-card"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Your full address"
                      className="w-full border border-border rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-background focus:bg-card"
                    />
                  </div>

                  {/* Bio */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      About Me
                    </label>
                    <textarea
                      rows={4}
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself, your teaching style, or learning goals..."
                      className="w-full border border-border rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-background focus:bg-card resize-none"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full bg-primary text-primary-foreground text-white py-3.5 rounded-xl font-semibold hover:bg-primary text-primary-foreground transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Save size={18} />
                      {saving ? "Saving Changes..." : "Save Profile"}
                    </button>
                  </div>

                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}