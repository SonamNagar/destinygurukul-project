
import React, { useState } from "react";
import api from "@/api/axiosInstance";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import {GraduationCap,Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck,} from "lucide-react";

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

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Input change
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // Login submission
  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/users/login", formData);

      // Tokens ab httpOnly cookie mein hain — sirf user info save karo
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      toast.success(
        `Welcome back, ${response.data.user.name}!`
      );

      // Redirect URL
      const redirectUrl = searchParams.get("redirect");

      if (redirectUrl) {
        navigate(redirectUrl);
        return;
      }

      // Role based navigation
      const role = response.data.user.role;

      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "teacher") {
        localStorage.setItem(
          "teacherEmail",
          response.data.user.email
        );

        navigate("/teacher-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (err) {
      console.log(err);

      const errMsg =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";

      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-200/50 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-200/50 rounded-full blur-3xl pointer-events-none" />

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

            <CardTitle className="text-3xl font-extrabold text-foreground">
              Welcome Back
            </CardTitle>

            <CardDescription className="text-muted-foreground text-sm">
              Sign in to your account to continue learning
              or teaching
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

              {/* Email */}
              <div className="space-y-2">

                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700"
                >
                  Email Address
                </Label>

                <div className="relative">

                  <Mail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />

                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="pl-10 h-12"
                    required
                  />

                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">

                <div className="flex items-center justify-between">

                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Password
                  </Label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-primary hover:text-indigo-800 hover:underline"
                  >
                    Forgot Password?
                  </Link>

                </div>

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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-12"
                    required
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

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-semibold mt-2"
              >
                {loading ? (
                  "Signing In..."
                ) : (
                  <>
                    Sign In
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
          <CardFooter className="flex flex-col border-t border-border pt-6 text-center space-y-4">

            <p className="text-sm text-muted-foreground">
              Don't have an account yet?{" "}

              <Link
                to="/register"
                className="font-bold text-primary hover:text-indigo-800 hover:underline"
              >
                Create an account
              </Link>
            </p>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">

              <ShieldCheck
                size={14}
                className="text-emerald-500"
              />

              <span>
                Safe & Secure 256-bit Encrypted Connection
              </span>

            </div>

          </CardFooter>

        </Card>
      </div>
    </div>
  );
}

