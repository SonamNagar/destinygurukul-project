import React, { useState } from "react";
import api from "@/api/axiosInstance";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  GraduationCap,
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetUrl, setResetUrl] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/users/forgot-password",
        { email }
      );

      toast.success(response.data.message || "Reset link generated!");
      setSubmitted(true);
      if (response.data.resetUrl) {
        setResetUrl(response.data.resetUrl);
      }
    } catch (err) {
      console.log(err);
      const errMsg =
        err.response?.data?.message || "Failed to process password reset.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* BACKGROUND ACCENTS */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-200/50 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* LOGO BADGE */}
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-card shadow-xs border border-border hover:shadow-md transition"
          >
            <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-white">
              <GraduationCap size={20} />
            </div>
            <span className="font-extrabold text-foreground text-lg tracking-tight">
              Destiny<span className="text-primary">Gurukul</span>
            </span>
          </Link>
        </div>

        <Card className="shadow-xl border-border backdrop-blur-md">
          <CardHeader className="text-center pb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-primary flex items-center justify-center mx-auto mb-3">
              <KeyRound size={24} />
            </div>
            <CardTitle className="text-2xl font-extrabold text-foreground">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Enter your registered email and we'll help you reset your password
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                {error}
              </div>
            )}

            {submitted ? (
              <div className="space-y-5 text-center py-2">
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-sm space-y-2">
                  <div className="flex items-center justify-center gap-2 font-bold text-emerald-700">
                    <CheckCircle2 size={20} />
                    Reset Link Ready
                  </div>
                  <p className="text-xs text-emerald-600">
                    A secure password reset link has been generated for <strong>{email}</strong>.
                  </p>
                </div>

                {resetUrl && (
                  <div className="p-3 bg-background rounded-xl text-left">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Direct Reset Link:</p>
                    <a
                      href={resetUrl}
                      className="text-xs text-primary font-mono break-all hover:underline"
                    >
                      {resetUrl}
                    </a>
                  </div>
                )}

                <Button
                  onClick={() => {
                    if (resetUrl) {
                      window.location.href = resetUrl;
                    }
                  }}
                  variant="gradient"
                  className="w-full h-11"
                >
                  Proceed to Reset Password
                  <ArrowRight size={16} className="ml-1.5" />
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Your Registered Email
                  </Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  variant="gradient"
                  className="w-full h-12 text-base font-semibold mt-2"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex justify-center border-t border-border pt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition"
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
