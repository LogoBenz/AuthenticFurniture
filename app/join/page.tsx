"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Users, KeyRound, Diamond } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function JoinPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { name: form.name, phone: form.phone } }
      });
      if (error) throw error;
      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Build the Home You Love. Get Rewarded for It.
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Join our family to unlock exclusive member discounts, cash rewards for referrals, and the best furniture deals in Nigeria.
          </p>
          <div className="mt-6">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-6 text-base">
              Unlock My Rewards
            </Button>
          </div>
        </section>

        {/* Three Benefits */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-indigo-600" />
                Share the Good Taste
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-300">
              Good things are meant to be shared. Invite friends and family to beautify their space. When they make their first purchase, we'll thank you with up to ₦10,000 in shopping credits or direct cash rewards. It's easy to share your link via WhatsApp!
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <KeyRound className="h-5 w-5 text-indigo-600" />
                Our Way of Saying 'Well Done'
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-300">
              Whether you're furnishing a new home or sourcing for a business, your loyalty means everything. The more you shop, the more you save. Unlock exclusive discounts, early access to sales, and special perks for bulk buyers. Smart shopping, rewarded.
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Diamond className="h-5 w-5 text-indigo-600" />
                For Your Eyes Only
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-300">
              As a member, you're always first in line. Get VIP access to limited-edition collections, new arrivals before anyone else, and special member-only prices during sales events like Black Friday. Consider it the Aso-ebi for your home—perfectly coordinated and exclusive to you.
            </CardContent>
          </Card>
        </section>

        {/* Signup Card */}
        <section className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Become a Member</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Auth entry point: Google + single phone/email field */}
              <div className="grid gap-4">
                <Button type="button" className="w-full bg-white text-slate-900 border border-slate-200 hover:bg-slate-50">
                  <span className="mr-2">G</span>
                  Continue with Google
                </Button>
                <div className="relative">
                  <Input placeholder="Enter Phone Number or Email" />
                </div>
                {error && <div className="text-red-600 text-sm">{error}</div>}
                <Button type="button" className="bg-orange-600 hover:bg-orange-700" disabled={loading}>
                  Continue
                </Button>
                <p className="text-xs text-slate-500">
                  Already have an account? <a href="#" className="text-orange-600 hover:underline">Sign In</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}


