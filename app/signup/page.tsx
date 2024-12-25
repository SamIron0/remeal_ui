"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.push("/");
      }
      const params = new URLSearchParams(window.location.search);
      const callback = params.get("callbackUrl");
      const emailParam = params.get("email");
      if (callback) {
        setCallbackUrl(callback);
      }
      if (emailParam) {
        setEmail(emailParam);
      }
    })();
  });

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${
              process.env.NEXT_PUBLIC_BASE_URL
            }/auth/callback${
              callbackUrl
                ? `?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : ""
            }`,
          },
        });

      if (signUpError) throw signUpError;

      if (signUpData.user) {
        toast.success(
          "Sign up successful! Please check your email to verify your account."
        );
        router.push(
          `/login${
            callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""
          }${
            email
              ? `${callbackUrl ? "&" : "?"}email=${encodeURIComponent(email)}`
              : ""
          }`
        );
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 w-full">
      <div className="flex w-full max-w-lg flex-col  justify-center mx-auto py-12 px-4 sm:px-6 mb-8">
        <div>
          <h2 className="mt-6 text-3xl font-semibold   text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link
              href={`/login${
                callbackUrl
                  ? `?callbackUrl=${encodeURIComponent(callbackUrl)}`
                  : ""
              }${
                email
                  ? `${callbackUrl ? "&" : "?"}email=${encodeURIComponent(
                      email
                    )}`
                  : ""
              }`}
              className="font-medium hover:underline text-primary hover:text-primary-dark"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className="mt-8">
          <form onSubmit={signUp} className="space-y-6">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
            </Button>
          </form>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
