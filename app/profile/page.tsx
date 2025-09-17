"use client";

import { useAuth } from "@/hooks/use-auth";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, Sparkles, ShoppingBag, Share2, User as UserIcon } from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/join");
    }
  }, [loading, isAuthenticated, router]);

  const referralCode = user?.id?.slice(0, 8) || "—";
  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/?ref=${referralCode}` : `/?ref=${referralCode}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      alert("Referral link copied!");
    } catch {}
  };

  // Simple points model (placeholder values)
  const points = 25; // 10% for signup baseline + any starter actions
  const nextLevelPoints = 250; // to reach Level 2
  const progress = Math.min(100, Math.max(10, Math.floor((points / nextLevelPoints) * 100))); // min 10%

  const levelName = useMemo(() => {
    if (points < 250) return 'New Member';
    if (points < 750) return 'Style Apprentice';
    if (points < 1500) return 'Design Enthusiast';
    if (points < 3000) return 'Home Connoisseur';
    return 'VIP Collector';
  }, [points]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User card */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Name:</span> {user?.user_metadata?.name || "—"}</div>
            <div><span className="text-muted-foreground">Email:</span> {user?.email}</div>
            <div><span className="text-muted-foreground">Phone:</span> {user?.user_metadata?.phone || "—"}</div>
            <div><span className="text-muted-foreground">Referral code:</span> {referralCode}</div>
            <div className="pt-2">
              <Button variant="outline" size="sm">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Journey */}
        <Card>
          <CardHeader>
            <CardTitle>Your Rewards Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium flex items-center gap-2"><Trophy className="h-4 w-4 text-amber-500"/> {levelName}</div>
                <div className="text-muted-foreground">{points} / {nextLevelPoints} pts</div>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-orange-600" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-xs text-muted-foreground">You're on your way! Earn 250 points to reach Level 2: Style Apprentice.</div>
            </div>
          </CardContent>
        </Card>

        {/* How to Earn */}
        <Card>
          <CardHeader>
            <CardTitle>Start Earning Your Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded-md border p-4">
                <div className="font-medium flex items-center gap-2 mb-1"><ShoppingBag className="h-4 w-4 text-blue-600"/> Make Your First Purchase</div>
                <p className="text-muted-foreground mb-3">Earn points on every Naira spent and get a welcome discount on your first order!</p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Shop New Arrivals</Button>
              </div>
              <div className="rounded-md border p-4">
                <div className="font-medium flex items-center gap-2 mb-1"><Share2 className="h-4 w-4 text-green-600"/> Share Your Referral Link</div>
                <p className="text-muted-foreground mb-3">Get ₦5,000 credit + 50 points for your first successful referral. Your friend gets 10% off too!</p>
                <div className="flex gap-2">
                  <Input readOnly value={referralLink} className="text-xs" />
                  <Button size="sm" onClick={copyLink}>Copy Link</Button>
                </div>
              </div>
              <div className="rounded-md border p-4">
                <div className="font-medium flex items-center gap-2 mb-1"><UserIcon className="h-4 w-4 text-purple-600"/> Complete Your Profile</div>
                <p className="text-muted-foreground mb-3">Tell us your style preferences and birthday to get 20 easy points and a special birthday surprise!</p>
                <Button size="sm" variant="outline">Complete Profile</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral program */}
        <Card>
          <CardHeader>
            <CardTitle>Referral Rewards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              Share your unique link and earn rewards when friends shop.
            </div>
            <div className="flex gap-2">
              <Input readOnly value={referralLink} className="text-xs" />
              <Button onClick={copyLink} className="bg-blue-600 hover:bg-blue-700">Copy</Button>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-md border p-3">
                <div className="text-2xl font-bold">0</div>
                <div className="text-xs text-muted-foreground">Friends Referred</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-2xl font-bold">₦0</div>
                <div className="text-xs text-muted-foreground">Rewards Earned</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-2xl font-bold">₦0</div>
                <div className="text-xs text-muted-foreground">Discount Credits</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Orders & Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">No history yet.</div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 flex gap-3">
          <Button variant="outline">My Rewards</Button>
          <Button variant="outline">My Orders</Button>
          <Button variant="outline">Edit Profile</Button>
        </div>
      </div>
    </div>
  );
}


