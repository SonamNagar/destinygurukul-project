import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import {
  UserCheck,
  UserX,
  Clock,
  GraduationCap,
  ShieldCheck,
  FileText,
  MapPin,
  ExternalLink,
  X,
  BadgeCheck,
  Calendar,
  Building2,
  ClipboardCheck,
  Star,
  Award,
  RefreshCw,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TutorApplications() {
  const [selectedDoc, setSelectedDoc] = useState(null); // { title, url }

  // Offline Interview Scheduling Modal State
  const [selectedForInterview, setSelectedForInterview] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    interviewDate: "",
    interviewTime: "11:00 AM",
    interviewLocation: "DestinyGurukul Office, Indore",
    instructions:
      "Please arrive 10–15 minutes before your scheduled interview time and bring your resume and relevant educational documents.",
    submitting: false,
  });

  // Offline Interview Evaluation Modal State
  const [selectedForEvaluation, setSelectedForEvaluation] = useState(null);
  const [evaluationForm, setEvaluationForm] = useState({
    decision: "approve", // 'approve' | 'reject' | 'reschedule'
    subjectKnowledge: 5,
    communicationSkills: 5,
    teachingSkills: 5,
    confidence: 5,
    remarks: "",
    rejectionReason: "",
    newDate: "",
    newTime: "11:00 AM",
    newLocation: "DestinyGurukul Office, Indore",
    newInstructions: "Please arrive 10–15 minutes before your scheduled interview time.",
    submitting: false,
  });

  // Fetch applications
  const fetchApplications = async () => {
    const response = await api.get("/admin/tutors");
    return response.data;
  };

  const {
    data: applications = [],
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["tutorApplications"],
    queryFn: fetchApplications,
  });

  const error = queryError
    ? queryError.response?.data?.message ||
      (queryError.response?.status === 403
        ? "You are not authorized to access tutor applications."
        : "Unable to load tutor applications.")
    : "";

  // Open Schedule Modal
  function openScheduleModal(app) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split("T")[0];

    setSelectedForInterview(app);
    setInterviewForm({
      interviewDate: app.interview?.date || defaultDate,
      interviewTime: app.interview?.time || "11:00 AM",
      interviewLocation: app.interview?.location || "DestinyGurukul Office, Indore",
      instructions:
        app.interview?.instructions ||
        "Please arrive 10–15 minutes before your scheduled interview time and bring your resume and relevant educational documents.",
      submitting: false,
    });
  }

  // Submit Schedule Offline Interview
  async function handleScheduleInterviewSubmit(e) {
    e.preventDefault();
    if (!selectedForInterview) return;

    if (!interviewForm.interviewDate || !interviewForm.interviewTime) {
      toast.error("Please specify both interview date and time.");
      return;
    }

    try {
      setInterviewForm((prev) => ({ ...prev, submitting: true }));
      await api.post(`/admin/tutors/${selectedForInterview._id}/schedule-interview`, {
        interviewDate: interviewForm.interviewDate,
        interviewTime: interviewForm.interviewTime,
        interviewLocation: interviewForm.interviewLocation,
        instructions: interviewForm.instructions,
      });

      toast.success(
        `🗓️ Offline Interview scheduled! Email notification sent to ${selectedForInterview.name}.`
      );
      setSelectedForInterview(null);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to schedule interview.");
    } finally {
      setInterviewForm((prev) => ({ ...prev, submitting: false }));
    }
  }

  // Open Evaluation Modal
  function openEvaluationModal(app) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split("T")[0];

    setSelectedForEvaluation(app);
    setEvaluationForm({
      decision: "approve",
      subjectKnowledge: app.interview?.evaluation?.subjectKnowledge || 5,
      communicationSkills: app.interview?.evaluation?.communicationSkills || 5,
      teachingSkills: app.interview?.evaluation?.teachingSkills || 5,
      confidence: app.interview?.evaluation?.confidence || 5,
      remarks: app.interview?.evaluation?.remarks || "",
      rejectionReason: "",
      newDate: defaultDate,
      newTime: "11:00 AM",
      newLocation: app.interview?.location || "DestinyGurukul Office, Indore",
      newInstructions: "Please arrive 10–15 minutes early.",
      submitting: false,
    });
  }

  // Submit Evaluation Result
  async function handleEvaluationSubmit(e) {
    e.preventDefault();
    if (!selectedForEvaluation) return;

    try {
      setEvaluationForm((prev) => ({ ...prev, submitting: true }));
      await api.post(`/admin/tutors/${selectedForEvaluation._id}/interview-result`, {
        decision: evaluationForm.decision,
        subjectKnowledge: evaluationForm.subjectKnowledge,
        communicationSkills: evaluationForm.communicationSkills,
        teachingSkills: evaluationForm.teachingSkills,
        confidence: evaluationForm.confidence,
        remarks: evaluationForm.remarks,
        rejectionReason: evaluationForm.rejectionReason,
        newDate: evaluationForm.newDate,
        newTime: evaluationForm.newTime,
        newLocation: evaluationForm.newLocation,
        newInstructions: evaluationForm.newInstructions,
      });

      if (evaluationForm.decision === "approve") {
        toast.success(`🎉 Tutor Approved! Welcome email sent to ${selectedForEvaluation.name}.`);
      } else if (evaluationForm.decision === "reject") {
        toast.success(`Tutor rejected. Status update email sent to ${selectedForEvaluation.name}.`);
      } else {
        toast.success(
          `📅 Interview rescheduled! Updated email sent to ${selectedForEvaluation.name}.`
        );
      }

      setSelectedForEvaluation(null);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit evaluation.");
    } finally {
      setEvaluationForm((prev) => ({ ...prev, submitting: false }));
    }
  }

  // Direct Quick Approve (without full interview form)
  async function handleDirectApprove(id) {
    const confirmApprove = window.confirm(
      "Approve this tutor directly? This will verify their profile and grant Teacher access."
    );
    if (!confirmApprove) return;

    try {
      await api.put(`/admin/tutor-applications/${id}`, {
        status: "approved",
        verifiedBadge: true,
        identityVerified: true,
        qualificationVerified: true,
      });

      refetch();
      toast.success("Tutor approved and email sent!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Unable to approve application.");
    }
  }

  // Direct Quick Reject
  async function handleDirectReject(id) {
    const reason = prompt("Enter rejection reason to send to tutor via email:");
    if (!reason || !reason.trim()) return;

    try {
      await api.put(`/admin/tutor-applications/${id}`, {
        status: "rejected",
        rejectionReason: reason.trim(),
      });

      refetch();
      toast.success("Tutor application rejected and email sent.");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Unable to reject application.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground animate-pulse">
          Loading tutor applications...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-card border-border border shadow-lg rounded-2xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-3">Access Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => refetch()}
            className="mt-5 bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:bg-primary/90 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <GraduationCap size={36} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Tutor Recruitment & Offline Interviews
              </h1>
              <p className="text-indigo-200 text-xs sm:text-sm mt-1">
                Schedule offline interviews, score candidates, and send automatic email updates.
              </p>
            </div>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-2xl backdrop-blur text-sm font-semibold border border-white/20">
            Total: {applications.length} Applications
          </div>
        </div>

        {/* NO APPLICATION */}
        {applications.length === 0 && (
          <div className="bg-card border border-border rounded-3xl shadow-sm p-12 text-center">
            <GraduationCap size={60} className="mx-auto text-muted-foreground/40 mb-4" />
            <h2 className="text-2xl font-bold text-foreground">No Tutor Applications Yet</h2>
            <p className="text-muted-foreground mt-2">
              No tutor has submitted an application for review.
            </p>
          </div>
        )}

        {/* APPLICATIONS LIST */}
        <div className="space-y-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className={`bg-card border rounded-3xl shadow-md p-6 sm:p-8 transition-all hover:shadow-lg ${
                app.status === "interview_scheduled"
                  ? "border-purple-300 dark:border-purple-800 ring-2 ring-purple-500/20"
                  : "border-border"
              }`}
            >
              {/* TOP HEADER */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
                <div className="flex items-start gap-4">
                  {/* Photo Preview */}
                  {app.photo ? (
                    <img
                      src={app.photo}
                      alt={app.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-primary shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground font-bold text-xl border">
                      {app.name ? app.name.charAt(0).toUpperCase() : "T"}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-2xl font-extrabold text-foreground">{app.name}</h2>
                      {app.verifiedBadge && (
                        <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
                          <BadgeCheck size={14} /> Verified Tutor
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {app.email} • {app.phoneNumber}
                    </p>
                    <p className="text-xs text-primary font-semibold flex items-center gap-1 mt-1">
                      <MapPin size={14} /> {app.area || "Area"}, {app.city || "Bhopal"}
                    </p>
                  </div>
                </div>

                {/* STATUS BADGES */}
                <div>
                  {app.status === "approved" && (
                    <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-bold text-sm">
                      <UserCheck size={18} />
                      Approved
                    </span>
                  )}
                  {app.status === "interview_scheduled" && (
                    <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold text-sm animate-pulse">
                      <Calendar size={18} />
                      Offline Interview Scheduled
                    </span>
                  )}
                  {app.status === "rejected" && (
                    <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold text-sm">
                      <UserX size={18} />
                      Rejected
                    </span>
                  )}
                  {(!app.status || app.status === "pending") && (
                    <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-bold text-sm">
                      <Clock size={18} />
                      Pending Review
                    </span>
                  )}
                </div>
              </div>

              {/* DETAILS GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-border text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Subject</span>
                  <span className="font-semibold text-foreground text-base text-primary">
                    {app.subject}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Qualification</span>
                  <span className="font-semibold text-foreground">{app.qualification}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Experience</span>
                  <span className="font-semibold text-foreground">{app.experience} Years</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Monthly Fee</span>
                  <span className="font-semibold text-foreground">₹{app.fees}</span>
                </div>
              </div>

              {/* OFFLINE INTERVIEW DETAILS BANNER */}
              {app.interview?.date && (
                <div className="my-5 p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-800 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-300">
                      <Building2 size={20} className="text-purple-600 dark:text-purple-400" />
                      <span>Offline Interview Details (In-Person)</span>
                    </div>
                    <span className="bg-purple-200/80 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 text-xs px-3 py-1 rounded-full font-semibold">
                      Mode: In-Person Office Visit
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                    <div className="bg-white/80 dark:bg-slate-900/60 p-3 rounded-xl border border-purple-100 dark:border-purple-900">
                      <span className="text-muted-foreground block text-[11px]">Date</span>
                      <strong className="text-foreground">{app.interview.date}</strong>
                    </div>
                    <div className="bg-white/80 dark:bg-slate-900/60 p-3 rounded-xl border border-purple-100 dark:border-purple-900">
                      <span className="text-muted-foreground block text-[11px]">Time</span>
                      <strong className="text-foreground">{app.interview.time}</strong>
                    </div>
                    <div className="bg-white/80 dark:bg-slate-900/60 p-3 rounded-xl border border-purple-100 dark:border-purple-900">
                      <span className="text-muted-foreground block text-[11px]">Location</span>
                      <strong className="text-foreground">{app.interview.location}</strong>
                    </div>
                  </div>

                  {app.interview.instructions && (
                    <p className="text-xs text-purple-800 dark:text-purple-300">
                      <strong>Instructions:</strong> {app.interview.instructions}
                    </p>
                  )}

                  {/* Previous Evaluation Scores if any */}
                  {app.interview.evaluation?.subjectKnowledge && (
                    <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-800 text-xs">
                      <p className="font-bold text-purple-900 dark:text-purple-300 mb-1 flex items-center gap-1.5">
                        <Award size={15} /> Interview Evaluation Record:
                      </p>
                      <div className="flex flex-wrap gap-3 text-slate-700 dark:text-slate-300">
                        <span>Subject Knowledge: <strong>{app.interview.evaluation.subjectKnowledge}/5</strong></span>
                        <span>Communication: <strong>{app.interview.evaluation.communicationSkills}/5</strong></span>
                        <span>Teaching: <strong>{app.interview.evaluation.teachingSkills}/5</strong></span>
                        <span>Confidence: <strong>{app.interview.evaluation.confidence}/5</strong></span>
                      </div>
                      {app.interview.evaluation.remarks && (
                        <p className="text-muted-foreground mt-1">
                          <em>Admin Remarks: "{app.interview.evaluation.remarks}"</em>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* UPLOADED DOCUMENTS & KYC PROOFS */}
              <div className="bg-muted/40 p-4 rounded-2xl my-4 border border-border">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-primary" />
                  Uploaded Verification Proofs
                </h4>
                <div className="flex flex-wrap gap-3">
                  {/* Certificate */}
                  {app.certificate ? (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedDoc({
                          title: `Qualification Certificate - ${app.name}`,
                          url: app.certificate,
                        })
                      }
                      className="flex items-center gap-2 bg-card border border-border px-3.5 py-2 rounded-xl text-xs font-semibold text-foreground hover:border-primary transition cursor-pointer"
                    >
                      <FileText size={16} className="text-indigo-600" />
                      View Certificate
                      <ExternalLink size={14} className="text-muted-foreground" />
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground italic bg-card px-3 py-1.5 rounded-xl border">
                      No Certificate Uploaded
                    </span>
                  )}
                </div>
              </div>

              {/* REJECTION REASON IF ANY */}
              {app.status === "rejected" && app.rejectionReason && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs mb-4">
                  <span className="font-bold">Rejection Reason:</span> {app.rejectionReason}
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex items-center flex-wrap gap-3 pt-4 border-t border-border">
                {/* 1. Schedule Offline Interview (If Pending) */}
                {(!app.status || app.status === "pending") && (
                  <Button
                    onClick={() => openScheduleModal(app)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20"
                  >
                    <Calendar size={18} />
                    Schedule Offline Interview
                  </Button>
                )}

                {/* 2. Conduct & Evaluate Interview (If Interview Scheduled) */}
                {app.status === "interview_scheduled" && (
                  <>
                    <Button
                      onClick={() => openEvaluationModal(app)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20"
                    >
                      <ClipboardCheck size={18} />
                      Take Interview & Evaluate
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => openScheduleModal(app)}
                      className="border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <RefreshCw size={16} />
                      Reschedule
                    </Button>
                  </>
                )}

                {/* Direct Approve */}
                {app.status !== "approved" && (
                  <Button
                    variant="outline"
                    onClick={() => handleDirectApprove(app._id)}
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck size={16} />
                    Direct Approve
                  </Button>
                )}

                {/* Reject */}
                {app.status !== "rejected" && (
                  <Button
                    variant="outline"
                    onClick={() => handleDirectReject(app._id)}
                    className="border-red-200 text-red-600 hover:bg-red-50 font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserX size={16} />
                    Reject
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          MODAL 1: SCHEDULE OFFLINE INTERVIEW
      ======================================================== */}
      {selectedForInterview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedForInterview(null)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground cursor-pointer p-1"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Calendar size={26} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Schedule Offline Interview</h3>
                <p className="text-xs text-muted-foreground">
                  Candidate: <strong>{selectedForInterview.name}</strong> ({selectedForInterview.subject})
                </p>
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 rounded-xl p-3.5 mb-5 text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-2 font-medium">
              <Building2 size={18} className="text-indigo-600 flex-shrink-0" />
              <span>Offline In-Person Interview — Candidate will receive an automated invitation email.</span>
            </div>

            <form onSubmit={handleScheduleInterviewSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Interview Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={interviewForm.interviewDate}
                    onChange={(e) =>
                      setInterviewForm({ ...interviewForm, interviewDate: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Interview Time *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 11:00 AM"
                    value={interviewForm.interviewTime}
                    onChange={(e) =>
                      setInterviewForm({ ...interviewForm, interviewTime: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground font-medium focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex gap-1.5 mt-2">
                    {["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setInterviewForm({ ...interviewForm, interviewTime: t })}
                        className="text-[11px] bg-muted hover:bg-muted/80 text-foreground px-2 py-0.5 rounded-md border border-border cursor-pointer"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Interview Location / Office Address *
                </label>
                <input
                  type="text"
                  required
                  value={interviewForm.interviewLocation}
                  onChange={(e) =>
                    setInterviewForm({ ...interviewForm, interviewLocation: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground font-medium focus:outline-none focus:border-indigo-500"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setInterviewForm({
                        ...interviewForm,
                        interviewLocation: "DestinyGurukul Office, Indore",
                      })
                    }
                    className="text-xs text-primary hover:underline cursor-pointer"
                  >
                    • DestinyGurukul Office, Indore
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setInterviewForm({
                        ...interviewForm,
                        interviewLocation: "DestinyGurukul Office, MP Nagar, Bhopal",
                      })
                    }
                    className="text-xs text-primary hover:underline cursor-pointer"
                  >
                    • MP Nagar Office, Bhopal
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Instructions for Candidate
                </label>
                <textarea
                  rows={3}
                  value={interviewForm.instructions}
                  onChange={(e) =>
                    setInterviewForm({ ...interviewForm, instructions: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-xs leading-relaxed focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setSelectedForInterview(null)}
                  className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted font-medium text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={interviewForm.submitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-indigo-500/20"
                >
                  <Send size={15} />
                  {interviewForm.submitting ? "Scheduling & Sending Email..." : "Schedule & Send Email 📧"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: CONDUCT & EVALUATE OFFLINE INTERVIEW
      ======================================================== */}
      {selectedForEvaluation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedForEvaluation(null)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground cursor-pointer p-1"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ClipboardCheck size={26} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Offline Interview Evaluation</h3>
                <p className="text-xs text-muted-foreground">
                  Candidate: <strong>{selectedForEvaluation.name}</strong> ({selectedForEvaluation.subject})
                </p>
              </div>
            </div>

            <form onSubmit={handleEvaluationSubmit} className="space-y-5 text-sm">
              {/* 4 SCORING CRITERIA (1-5) */}
              <div className="bg-muted/40 p-4 rounded-2xl border border-border space-y-3.5">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Candidate Evaluation Scores (1 to 5)
                </h4>

                {[
                  {
                    key: "subjectKnowledge",
                    label: "1. Subject Knowledge",
                    desc: "Conceptual clarity, syllabus mastery",
                  },
                  {
                    key: "communicationSkills",
                    label: "2. Communication Skills",
                    desc: "Fluency, tone, articulation",
                  },
                  {
                    key: "teachingSkills",
                    label: "3. Teaching Methodology",
                    desc: "Student engagement, explanation simplicity",
                  },
                  {
                    key: "confidence",
                    label: "4. Confidence & Attitude",
                    desc: "Professional demeanor, punctuality",
                  },
                ].map((crit) => (
                  <div
                    key={crit.key}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-card rounded-xl border border-border/80"
                  >
                    <div>
                      <span className="font-semibold text-xs text-foreground block">
                        {crit.label}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{crit.desc}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() =>
                            setEvaluationForm({ ...evaluationForm, [crit.key]: score })
                          }
                          className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition cursor-pointer ${
                            evaluationForm[crit.key] >= score
                              ? "bg-amber-400 text-amber-950 shadow-sm"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          <Star size={13} className="fill-current" />
                          <span className="ml-0.5">{score}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* ADMIN REMARKS */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Admin Remarks & Candidate Feedback
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Excellent explanation of class 10 concepts. Candidate demonstrated strong patience."
                  value={evaluationForm.remarks}
                  onChange={(e) =>
                    setEvaluationForm({ ...evaluationForm, remarks: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-xs leading-relaxed focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* FINAL DECISION SELECTOR */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Final Decision *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: "approve",
                      title: "Approve Tutor",
                      desc: "Send Approval Email & grant teaching access",
                      color: "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300",
                    },
                    {
                      id: "reject",
                      title: "Reject",
                      desc: "Send polite rejection email with feedback",
                      color: "border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-800 dark:text-red-300",
                    },
                    {
                      id: "reschedule",
                      title: "Reschedule",
                      desc: "Schedule another date and notify tutor",
                      color: "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300",
                    },
                  ].map((dec) => (
                    <label
                      key={dec.id}
                      className={`p-3 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                        evaluationForm.decision === dec.id
                          ? dec.color + " ring-2 ring-primary/20 shadow-sm"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="radio"
                          name="decision"
                          value={dec.id}
                          checked={evaluationForm.decision === dec.id}
                          onChange={(e) =>
                            setEvaluationForm({ ...evaluationForm, decision: e.target.value })
                          }
                          className="accent-primary"
                        />
                        <span className="font-bold text-xs">{dec.title}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground leading-tight">
                        {dec.desc}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* IF RESCHEDULE CHOSEN: SHOW NEW SCHEDULE FIELDS */}
              {evaluationForm.decision === "reschedule" && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl space-y-3 animate-in fade-in duration-200">
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300">
                    Reschedule Interview Schedule
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                        New Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={evaluationForm.newDate}
                        onChange={(e) =>
                          setEvaluationForm({ ...evaluationForm, newDate: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                        New Time *
                      </label>
                      <input
                        type="text"
                        required
                        value={evaluationForm.newTime}
                        onChange={(e) =>
                          setEvaluationForm({ ...evaluationForm, newTime: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* IF REJECT CHOSEN: OPTIONAL REJECTION REASON */}
              {evaluationForm.decision === "reject" && (
                <div className="animate-in fade-in duration-200">
                  <label className="block text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">
                    Rejection Reason (included in email to candidate)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Needs deeper subject practice for secondary syllabus."
                    value={evaluationForm.rejectionReason}
                    onChange={(e) =>
                      setEvaluationForm({ ...evaluationForm, rejectionReason: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-background border border-red-200 rounded-xl text-xs"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setSelectedForEvaluation(null)}
                  className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted font-medium text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={evaluationForm.submitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-500/20"
                >
                  <Send size={15} />
                  {evaluationForm.submitting
                    ? "Saving & Sending Decision..."
                    : "Submit Result & Send Email 📧"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW DIALOG */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">{selectedDoc.title}</h3>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 flex justify-center bg-muted/30">
              {selectedDoc.url.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={selectedDoc.url}
                  className="w-full h-[500px] rounded-xl border"
                  title="PDF Preview"
                />
              ) : (
                <img
                  src={selectedDoc.url}
                  alt={selectedDoc.title}
                  className="max-h-[500px] object-contain rounded-xl shadow"
                />
              )}
            </div>
            <div className="p-4 border-t border-border flex justify-end gap-3 bg-card">
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-border hover:bg-muted cursor-pointer"
              >
                Close
              </button>
              <a
                href={selectedDoc.url}
                target="_blank"
                rel="noreferrer"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
              >
                <ExternalLink size={16} /> Open Full View
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
