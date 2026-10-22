
import React, { useState } from "react";
import api from "@/api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
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

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
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

  // Register submission
  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post(
        "/users/register",
        formData
      );

      toast.success(
        "Account created successfully! Please sign in."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.log(err);

      const errMsg =
        err.response?.data?.message ||
        "Registration failed. Please try again.";

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

      <div className="w-full max-w-lg relative z-10">

        {/* Logo */}
        <div className="text-center mb-6">

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-card border-border border shadow-sm border border-border hover:shadow-md transition"
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
              Create Your Account
            </CardTitle>

            <CardDescription className="text-muted-foreground text-sm">
              Join thousands of students and find verified
              home tutors near you
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

              {/* Full Name */}
              <div className="space-y-2">

                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700"
                >
                  Full Name
                </Label>

                <div className="relative">

                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />

                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Sonam Nagar"
                    className="pl-10 h-12"
                    required
                  />

                </div>
              </div>

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

              {/* Phone + Password */}
              <div className="grid sm:grid-cols-2 gap-4">

                {/* Phone */}
                <div className="space-y-2">

                  <Label
                    htmlFor="phoneNumber"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Phone Number
                  </Label>

                  <div className="relative">

                    <Phone
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />

                    <Input
                      id="phoneNumber"
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="pl-10 h-12"
                      required
                    />

                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">

                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Password
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
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
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

              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-semibold mt-3"
              >
                {loading ? (
                  "Creating Account..."
                ) : (
                  <>
                    Create Student Account
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
              Already have an account?{" "}

              <Link
                to="/login"
                className="font-bold text-primary hover:text-indigo-800 hover:underline"
              >
                Sign In
              </Link>
            </p>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">

              <ShieldCheck
                size={14}
                className="text-emerald-500"
              />

              <span>
                By signing up, you agree to our Terms of
                Service & Privacy Policy
              </span>

            </div>

          </CardFooter>

        </Card>
      </div>
    </div>
  );
}


