"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn, UserPlus, AlertCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [emailNotConfirmed, setEmailNotConfirmed] = useState<string>("");
  const [isResendingConfirmation, setIsResendingConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Redirect to dashboard if already authenticated
          router.push('/admin/dashboard');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    checkAuth();
  }, [router]);

  const handleResendConfirmation = async () => {
    if (!emailNotConfirmed) return;
    
    setIsResendingConfirmation(true);
    setError("");
    setSuccess("");

    try {
      // Use signUp again to resend confirmation email
      const { error } = await supabase.auth.signUp({
        email: emailNotConfirmed,
        password: "temporary-password", // This won't be used since user already exists
        options: {
          emailRedirectTo: `${window.location.origin}/auth/login`
        }
      });

      if (error) throw error;

      setSuccess("Confirmation email sent! Please check your inbox and spam folder.");
      setEmailNotConfirmed("");
    } catch (error: any) {
      console.error('Resend confirmation error:', error);
      setError(error.message || 'Failed to resend confirmation email');
    } finally {
      setIsResendingConfirmation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setEmailNotConfirmed("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }

        if (formData.password.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }

        // Sign up new user
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/login`
          }
        });

        if (error) throw error;

        if (data.user && !data.session) {
          setSuccess("Account created! Please check your email to verify your account before signing in.");
          setIsSignUp(false);
          setFormData({ email: formData.email, password: "", confirmPassword: "" });
        } else if (data.session) {
          setSuccess("Account created and signed in successfully!");
          setTimeout(() => {
            router.push('/admin/dashboard');
          }, 1000);
        }
      } else {
        // Sign in existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        if (data.session) {
          setSuccess("Signed in successfully!");
          setTimeout(() => {
            // Redirect to dashboard after successful login
            router.push('/admin/dashboard');
          }, 1000);
        }
      }
    } catch (error: any) {
      // Handle specific email not confirmed error
      if (error.message === 'Email not confirmed' || 
          (error.code && error.code === 'email_not_confirmed')) {
        setEmailNotConfirmed(formData.email);
        setError("");
      } else {
        console.error('Auth error:', error);
        setError(error.message || 'An error occurred during authentication');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user starts typing
    setEmailNotConfirmed(""); // Clear email confirmation state
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? "Create Admin Account" : "Admin Login"}
          </CardTitle>
          <p className="text-muted-foreground">
            {isSignUp 
              ? "Create an account to manage products" 
              : "Sign in to access the admin dashboard"
            }
          </p>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {emailNotConfirmed && (
            <Alert className="mb-4 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
              <Mail className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <div className="space-y-3">
                  <p>
                    Your email address <strong>{emailNotConfirmed}</strong> needs to be verified before you can sign in.
                  </p>
                  <p className="text-sm">
                    Please check your email inbox (and spam folder) for a verification link. If you didn&apos;t receive the email, you can request a new one.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResendConfirmation}
                    disabled={isResendingConfirmation}
                    className="w-full"
                  >
                    {isResendingConfirmation ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-600 border-t-transparent mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Resend Confirmation Email
                      </>
                    )}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </>
              ) : (
                <>
                  {isSignUp ? <UserPlus className="h-4 w-4 mr-2" /> : <LogIn className="h-4 w-4 mr-2" />}
                  {isSignUp ? "Create Account" : "Sign In"}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              type="button"
              variant="link"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setSuccess("");
                setEmailNotConfirmed("");
                setFormData({ email: "", password: "", confirmPassword: "" });
              }}
              disabled={isLoading}
            >
              {isSignUp 
                ? "Already have an account? Sign in" 
                : "Need an account? Create one"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}