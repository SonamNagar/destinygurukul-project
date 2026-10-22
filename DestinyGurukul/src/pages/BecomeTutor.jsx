import React, { useState } from "react";
import api from "../api/axiosInstance";
import { BHOPAL_AREAS } from "../constants/bhopalAreas";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Clock,
  IndianRupee,
  BookOpen,
  Award,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";

const POPULAR_SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Hindi",
  "Social Studies",
  "Commerce & Accounts",
  "Economics",
  "Computer Science",
  "Spoken English",
];

const AVAILABLE_CLASSES = [
  "Class 1st - 5th (Primary)",
  "Class 6th - 8th (Middle)",
  "Class 9th (High School)",
  "Class 10th (Board)",
  "Class 11th (Higher Sec)",
  "Class 12th (Board)",
  "Competitive Exams",
];

export default function BecomeTutor() {
  const [currentStep, setCurrentStep] = useState(1);

  const photoInputRef = React.useRef(null);
  const certInputRef = React.useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    area: "",
    address: "",
    photo: "",

    qualification: "",
    experience: "",
    subjects: [],
    classesList: [],
    fees: "",
    time: "",
    about: "",

    certificate: "",
  });

  const [customSubjectInput, setCustomSubjectInput] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSubject = (subj) => {
    setFormData((prev) => {
      const exists = prev.subjects.includes(subj);
      const updated = exists
        ? prev.subjects.filter((s) => s !== subj)
        : [...prev.subjects, subj];
      return { ...prev, subjects: updated };
    });
  };

  const addCustomSubject = () => {
    const trimmed = customSubjectInput.trim();
    if (trimmed && !formData.subjects.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, trimmed],
      }));
      setCustomSubjectInput("");
    }
  };

  const toggleClass = (cls) => {
    setFormData((prev) => {
      const exists = prev.classesList.includes(cls);
      const updated = exists
        ? prev.classesList.filter((c) => c !== cls)
        : [...prev.classesList, cls];
      return { ...prev, classesList: updated };
    });
  };

  const handleFileUpload = async (e, fieldType) => {
    let file = e.target.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error("File size must be under 15 MB.");
      return;
    }

    try {
      if (fieldType === "photo") setUploadingPhoto(true);
      if (fieldType === "certificate") setUploadingCert(true);

      if (file.type.startsWith("image/")) {
        try {
          file = await imageCompression(file, {
            maxSizeMB: 0.4,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
          });
        } catch (compErr) {
          console.log("Compression skipped:", compErr);
        }
      }

      const uploadFormData = new FormData();
      uploadFormData.append("file", file, file.name);

      const res = await api.post("/upload/single", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData((prev) => ({ ...prev, [fieldType]: res.data.url }));
      toast.success(
        fieldType === "photo"
          ? "Profile photo uploaded!"
          : "Certificate uploaded!"
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed. Try again.");
    } finally {
      if (fieldType === "photo") setUploadingPhoto(false);
      if (fieldType === "certificate") setUploadingCert(false);
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!formData.name.trim()) return "Full Name is required.";
    if (!formData.email.trim()) return "Email address is required.";
    if (!formData.phoneNumber.trim()) return "Phone number is required.";
    if (!/^[6-9]\d{9}$/.test(formData.phoneNumber.trim()))
      return "Please enter a valid 10-digit Indian phone number.";
    if (!formData.area) return "Please select your Area in Bhopal.";
    if (!formData.address.trim()) return "Address in Bhopal is required.";
    return null;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (!formData.qualification.trim()) return "Highest Qualification is required.";
    if (formData.subjects.length === 0) return "Please select at least one Subject.";
    if (formData.classesList.length === 0) return "Please select at least one Class.";
    if (!formData.fees || Number(formData.fees) <= 0) return "Monthly fee is required.";
    if (!formData.time.trim()) return "Available time slot is required.";
    return null;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const err = validateStep1();
      if (err) { toast.error(err); return; }
    }
    if (currentStep === 2) {
      const err = validateStep2();
      if (err) { toast.error(err); return; }
    }
    setCurrentStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const primarySubject = formData.subjects.join(", ") || "General";
      const classesCount = formData.classesList.length || 1;

      await api.post("/tutors", {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phoneNumber: formData.phoneNumber.trim(),
        area: formData.area,
        address: formData.address.trim(),
        photo: formData.photo,
        qualification: formData.qualification.trim(),
        experience: Number(formData.experience) || 0,
        subject: primarySubject,
        subjects: formData.subjects,
        classes: classesCount,
        classesList: formData.classesList,
        fees: Number(formData.fees),
        city: "Bhopal",
        time: formData.time.trim(),
        about: formData.about.trim(),
        certificate: formData.certificate,
      });

      setSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (err) {
      if (err.response?.data?.message?.includes("E11000")) {
        toast.error("This email is already registered as a tutor.");
      } else {
        toast.error(err.response?.data?.message || "Failed to submit. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ======================== SUCCESS SCREEN ========================
  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-lg w-full text-center shadow-2xl border-emerald-100 bg-card p-8 rounded-3xl">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={45} />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground mb-3">Application Submitted!</h2>
          <p className="text-muted-foreground text-base mb-6 leading-relaxed">
            Thank you, <span className="font-semibold text-foreground">{formData.name}</span>. Your application is under review by the DestinyGurukul Admin team.
          </p>
          <div className="bg-muted p-4 rounded-2xl text-left text-sm space-y-2 mb-6 border border-border">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Status:</span>
              <span className="font-bold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-xs">Pending Review</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Area:</span>
              <span className="font-semibold text-foreground">{formData.area}, Bhopal</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Subjects:</span>
              <span className="font-semibold text-foreground">
                {formData.subjects.slice(0, 2).join(", ")}
                {formData.subjects.length > 2 ? ` +${formData.subjects.length - 2}` : ""}
              </span>
            </div>
          </div>
          <Button onClick={() => (window.location.href = "/")} className="w-full h-12 text-base font-semibold">
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  // ======================== FORM ========================
  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
            <GraduationCap size={18} />
            Join DestinyGurukul Tutor Network
          </div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl">
            Become a Home Tutor in Bhopal
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Share your expertise, teach students in your area, and earn monthly from home.
          </p>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="mb-10 bg-card border border-border p-4 sm:p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between relative">

            {/* Step 1 */}
            <div className={`flex flex-col items-center gap-2 z-10 ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep >= 1 ? "bg-primary text-white shadow-md shadow-primary/30 ring-4 ring-primary/20" : "bg-muted text-muted-foreground"}`}>
                {currentStep > 1 ? <CheckCircle2 size={20} /> : "1"}
              </div>
              <span className="text-xs sm:text-sm font-semibold">Personal Info</span>
            </div>

            <div className={`flex-1 h-1 mx-2 sm:mx-4 transition-all ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`} />

            {/* Step 2 */}
            <div className={`flex flex-col items-center gap-2 z-10 ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep >= 2 ? "bg-primary text-white shadow-md shadow-primary/30 ring-4 ring-primary/20" : "bg-muted text-muted-foreground"}`}>
                {currentStep > 2 ? <CheckCircle2 size={20} /> : "2"}
              </div>
              <span className="text-xs sm:text-sm font-semibold">Teaching Profile</span>
            </div>

            <div className={`flex-1 h-1 mx-2 sm:mx-4 transition-all ${currentStep >= 3 ? "bg-primary" : "bg-muted"}`} />

            {/* Step 3 */}
            <div className={`flex flex-col items-center gap-2 z-10 ${currentStep >= 3 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep === 3 ? "bg-primary text-white shadow-md shadow-primary/30 ring-4 ring-primary/20" : "bg-muted text-muted-foreground"}`}>
                3
              </div>
              <span className="text-xs sm:text-sm font-semibold">Resume & Submit</span>
            </div>

          </div>
        </div>

        {/* FORM CARD */}
        <Card className="shadow-2xl border-border bg-card overflow-hidden">
          <form onSubmit={handleSubmit}>

            {/* ====== STEP 1: PERSONAL & LOCATION ====== */}
            {currentStep === 1 && (
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <User className="text-primary" size={24} />
                    Personal & Location Details
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">Your contact info and area in Bhopal.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Ramesh Sharma" className="pl-10 h-12" required />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g. ramesh@example.com" className="pl-10 h-12" required />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-sm font-semibold">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="10-digit mobile number" className="pl-10 h-12" required />
                    </div>
                  </div>

                  {/* Area */}
                  <div className="space-y-2">
                    <Label htmlFor="area" className="text-sm font-semibold">Area in Bhopal *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <select
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 h-12 rounded-md border border-input bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary"
                        required
                      >
                        <option value="">-- Select Your Area --</option>
                        {BHOPAL_AREAS.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-semibold">Full Address *</Label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter your residence address in Bhopal"
                    className="w-full p-3 rounded-md border border-input bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary resize-y"
                    required
                  />
                </div>

                {/* Profile Photo */}
                <div className="space-y-2 border-t pt-4">
                  <Label className="text-sm font-semibold">Profile Photo <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-dashed border-border rounded-xl bg-muted/40">
                    {formData.photo ? (
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary shadow-sm">
                        <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, photo: "" }))}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground border">
                        <User size={32} />
                      </div>
                    )}
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <input type="file" ref={photoInputRef} accept="image/*" onChange={(e) => handleFileUpload(e, "photo")} className="hidden" />
                      <Button type="button" variant="outline" size="sm" onClick={() => photoInputRef.current?.click()} disabled={uploadingPhoto}>
                        <Upload size={16} className="mr-2" />
                        {uploadingPhoto ? "Uploading..." : "Choose Profile Photo"}
                      </Button>
                      <p className="text-xs text-muted-foreground">JPG, PNG, WEBP (Max 5MB)</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="button" onClick={handleNext} className="h-12 px-6 font-semibold">
                    Next: Teaching Profile
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </div>
              </CardContent>
            )}

            {/* ====== STEP 2: TEACHING PROFILE ====== */}
            {currentStep === 2 && (
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <GraduationCap className="text-primary" size={24} />
                    Teaching Preferences & Experience
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">Subjects, classes, fees and your availability.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Qualification */}
                  <div className="space-y-2">
                    <Label htmlFor="qualification" className="text-sm font-semibold">Highest Qualification *</Label>
                    <div className="relative">
                      <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input id="qualification" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="e.g. M.Sc Physics / B.Tech" className="pl-10 h-12" required />
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-semibold">Teaching Experience (Years)</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input id="experience" type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 3" min="0" className="pl-10 h-12" />
                    </div>
                  </div>
                </div>

                {/* Subjects */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <BookOpen size={18} className="text-primary" />
                      Subjects You Teach *
                    </Label>
                    <span className="text-xs font-semibold text-primary">{formData.subjects.length} selected</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SUBJECTS.map((subj) => {
                      const isSelected = formData.subjects.includes(subj);
                      return (
                        <button
                          key={subj}
                          type="button"
                          onClick={() => toggleSubject(subj)}
                          className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${isSelected ? "bg-primary text-white border-primary shadow-sm" : "bg-background text-foreground border-border hover:border-primary/50"}`}
                        >
                          {isSelected && <CheckCircle2 size={14} />}
                          {subj}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Input
                      placeholder="Add other subject (e.g. Sanskrit)"
                      value={customSubjectInput}
                      onChange={(e) => setCustomSubjectInput(e.target.value)}
                      className="h-10 text-xs"
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomSubject(); } }}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addCustomSubject} className="h-10">
                      <Plus size={16} /> Add
                    </Button>
                  </div>
                </div>

                {/* Classes */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <GraduationCap size={18} className="text-primary" />
                      Classes You Teach *
                    </Label>
                    <span className="text-xs font-semibold text-primary">{formData.classesList.length} selected</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {AVAILABLE_CLASSES.map((cls) => {
                      const isSelected = formData.classesList.includes(cls);
                      return (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => toggleClass(cls)}
                          className={`p-3 rounded-xl text-left text-xs font-semibold border transition-all flex items-center justify-between ${isSelected ? "bg-primary/10 text-primary border-primary shadow-sm" : "bg-background text-foreground border-border hover:border-primary/30"}`}
                        >
                          <span>{cls}</span>
                          {isSelected && <CheckCircle2 size={16} className="text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
                  {/* Fees */}
                  <div className="space-y-2">
                    <Label htmlFor="fees" className="text-sm font-semibold">Expected Monthly Fees (₹) *</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input id="fees" type="number" name="fees" value={formData.fees} onChange={handleChange} placeholder="e.g. 4000" min="500" className="pl-10 h-12" required />
                    </div>
                  </div>

                  {/* Time */}
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-sm font-semibold">Available Time Slots *</Label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input id="time" name="time" value={formData.time} onChange={handleChange} placeholder="e.g. 4 PM - 7 PM Evening" className="pl-10 h-12" required />
                    </div>
                  </div>
                </div>

                {/* About */}
                <div className="space-y-2">
                  <Label htmlFor="about" className="text-sm font-semibold">
                    About Yourself <span className="text-muted-foreground font-normal">(Optional)</span>
                  </Label>
                  <textarea
                    id="about"
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe your teaching style, experience, and achievements..."
                    className="w-full p-3 rounded-md border border-input bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary resize-y"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={handlePrev} className="h-12 px-6 font-semibold">
                    <ArrowLeft size={18} className="mr-2" /> Back
                  </Button>
                  <Button type="button" onClick={handleNext} className="h-12 px-6 font-semibold">
                    Next: Resume & Submit
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </div>
              </CardContent>
            )}

            {/* ====== STEP 3: RESUME/CERTIFICATE + SUBMIT ====== */}
            {currentStep === 3 && (
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <FileText className="text-primary" size={24} />
                    Resume / Certificate Upload
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload your degree, mark sheet, or resume. <span className="font-semibold text-foreground">Optional — but helps get approved faster.</span>
                  </p>
                </div>

                {/* Certificate / Resume Upload */}
                <div className="p-6 border border-dashed border-border rounded-2xl bg-muted/30 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Degree / Mark Sheet / Resume</h4>
                      <p className="text-xs text-muted-foreground">Upload any qualification proof or your resume (Image or PDF)</p>
                    </div>
                  </div>

                  {formData.certificate ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2 font-semibold">
                        <CheckCircle2 size={18} /> Document Uploaded Successfully
                      </span>
                      <div className="flex items-center gap-3">
                        <a href={formData.certificate} target="_blank" rel="noreferrer" className="underline font-bold text-xs">View</a>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, certificate: "" }))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input type="file" ref={certInputRef} accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, "certificate")} className="hidden" />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => certInputRef.current?.click()}
                        disabled={uploadingCert}
                        className="w-full h-12 border-dashed"
                      >
                        <Upload size={18} className="mr-2" />
                        {uploadingCert ? "Uploading..." : "Click to Upload (Image or PDF, Max 15MB)"}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Application Summary */}
                <div className="bg-muted/50 border border-border p-5 rounded-2xl space-y-3">
                  <h4 className="font-bold text-sm text-foreground uppercase tracking-wider">Application Summary</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground block">Name:</span>
                      <span className="font-semibold">{formData.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Bhopal Area:</span>
                      <span className="font-semibold text-primary">{formData.area}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Experience:</span>
                      <span className="font-semibold">{formData.experience || 0} Years</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Monthly Fee:</span>
                      <span className="font-semibold">₹{formData.fees}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Time:</span>
                      <span className="font-semibold">{formData.time}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground block">Subjects:</span>
                      <span className="font-semibold text-indigo-600">{formData.subjects.join(", ")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={handlePrev} className="h-12 px-6 font-semibold">
                    <ArrowLeft size={18} className="mr-2" /> Back
                  </Button>
                  <Button type="submit" disabled={loading} className="h-12 px-8 text-base font-semibold shadow-lg shadow-primary/20">
                    {loading ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </CardContent>
            )}

          </form>
        </Card>
      </div>
    </div>
  );
}
