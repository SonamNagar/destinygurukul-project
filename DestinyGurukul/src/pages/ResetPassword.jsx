
import React, { useState } from "react";
import api from "@/api/axiosInstance";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  GraduationCap,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
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

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    // Check password match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    // Check password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        `/users/reset-password/${token}`,
        {
          password,
        }
      );

      toast.success(
        response.data.message ||
          "Password reset successful!"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.log(err);

      const errMsg =
        err.response?.data?.message ||
        "Failed to reset password. Link may have expired.";

      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background accents */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-200/50 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-200/50 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-6">

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-card shadow-sm border border-border hover:shadow-md transition"
          >
            <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-white">
              <GraduationCap size={20} />
            </div>

            <span className="font-extrabold text-foreground text-lg tracking-tight">
              Destiny
              <span className="text-primary">
                Gurukul
              </span>
            </span>
          </Link>

        </div>

        {/* Card */}
        <Card className="shadow-xl border-border">

          {/* Header */}
          <CardHeader className="text-center pb-6">

            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-primary flex items-center justify-center mx-auto mb-3">
              <KeyRound size={24} />
            </div>

            <CardTitle className="text-2xl font-extrabold text-foreground">
              Set New Password
            </CardTitle>

            <CardDescription className="text-muted-foreground text-sm">
              Please enter and confirm your new secure
              password
            </CardDescription>

          </CardHeader>

          {/* Content */}
          <CardContent>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* New Password */}
              <div className="space-y-2">

                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700"
                >
                  New Password
                </Label>

                <div className="relative">

                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />

                  <Input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter new password (min 6 chars)"
                    className="pl-10 pr-10 h-12"
                    required
                    minLength={6}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">

                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold text-gray-700"
                >
                  Confirm Password
                </Label>

                <div className="relative">

                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />

                  <Input
                    id="confirmPassword"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Confirm new password"
                    className="pl-10 pr-10 h-12"
                    required
                    minLength={6}
                  />

                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-semibold mt-2"
              >
                {loading ? (
                  "Resetting Password..."
                ) : (
                  <>
                    Update Password
                    <ArrowRight
                      size={18}
                      className="ml-1"
                    />
                  </>
                )}
              </Button>

            </form>
          </CardContent>

          {/* Footer */}
          <CardFooter className="flex justify-center border-t border-border pt-6">

            <Link
              to="/login"
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition"
            >
              Cancel and Return to Sign In
            </Link>

          </CardFooter>

        </Card>
      </div>
    </div>
  );
}

