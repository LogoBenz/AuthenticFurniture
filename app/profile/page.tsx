"use client";

import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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


