"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  TrendingUp, 
  MessageSquare, 
  Mail,
  Users,
  Gift,
  Calendar,
  Send,
  Eye,
  BarChart3,
  Target,
  Megaphone,
  Star
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp' | 'social';
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  audience: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  startDate: string;
  endDate: string;
  budget: number;
  revenue: number;
}

interface ReferralProgram {
  id: string;
  customerName: string;
  referralCode: string;
  referralsCount: number;
  successfulReferrals: number;
  totalEarned: number;
  status: 'active' | 'inactive';
}

function MarketingContent() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [referralPrograms, setReferralPrograms] = useState<ReferralProgram[]>([]);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'referrals' | 'promotions'>('campaigns');
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMarketingData();
  }, []);

  const loadMarketingData = async () => {
    // Simulate marketing data
    const mockCampaigns: Campaign[] = [
      {
        id: "CAMP-001",
        name: "New Year Furniture Sale",
        type: "email",
        status: "completed",
        audience: "All Customers",
        sentCount: 1250,
        openRate: 32.5,
        clickRate: 8.2,
        conversionRate: 2.1,
        startDate: "2024-01-01",
        endDate: "2024-01-15",
        budget: 50000,
        revenue: 850000
      },
      {
        id: "CAMP-002",
        name: "Office Furniture WhatsApp Blast",
        type: "whatsapp",
        status: "active",
        audience: "Corporate Customers",
        sentCount: 450,
        openRate: 85.2,
        clickRate: 25.6,
        conversionRate: 8.9,
        startDate: "2024-01-10",
        endDate: "2024-01-25",
        budget: 25000,
        revenue: 320000
      },
      {
        id: "CAMP-003",
        name: "Valentine's Day Home Decor",
        type: "sms",
        status: "scheduled",
        audience: "Retail Customers",
        sentCount: 0,
        openRate: 0,
        clickRate: 0,
        conversionRate: 0,
        startDate: "2024-02-10",
        endDate: "2024-02-16",
        budget: 30000,
        revenue: 0
      }
    ];

    const mockReferrals: ReferralProgram[] = [
      {
        id: "REF-001",
        customerName: "Adebayo Johnson",
        referralCode: "ADEBAYO2024",
        referralsCount: 8,
        successfulReferrals: 5,
        totalEarned: 125000,
        status: "active"
      },
      {
        id: "REF-002",
        customerName: "Chinedu Okafor",
        referralCode: "CHINEDU2024",
        referralsCount: 12,
        successfulReferrals: 9,
        totalEarned: 225000,
        status: "active"
      },
      {
        id: "REF-003",
        customerName: "Fatima Abdullahi",
        referralCode: "FATIMA2024",
        referralsCount: 3,
        successfulReferrals: 2,
        totalEarned: 50000,
        status: "active"
      }
    ];

    setCampaigns(mockCampaigns);
    setReferralPrograms(mockReferrals);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'scheduled': return 'secondary';
      case 'active': return 'default';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'whatsapp': return MessageSquare;
      case 'social': return TrendingUp;
      default: return Mail;
    }
  };

  const marketingStats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalRevenue: campaigns.reduce((sum, c) => sum + c.revenue, 0),
    averageOpenRate: campaigns.reduce((sum, c) => sum + c.openRate, 0) / campaigns.length || 0,
    totalReferrals: referralPrograms.reduce((sum, r) => sum + r.referralsCount, 0),
    activeReferrers: referralPrograms.filter(r => r.status === 'active').length,
    referralRevenue: referralPrograms.reduce((sum, r) => sum + r.totalEarned, 0)
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading marketing data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Marketing Tools</h1>
          <p className="text-muted-foreground">
            Manage campaigns, referrals, and promotional activities
          </p>
        </div>

        {/* Marketing Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{marketingStats.activeCampaigns}</div>
              <p className="text-xs text-muted-foreground">
                {marketingStats.totalCampaigns} total campaigns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campaign Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{(marketingStats.totalRevenue / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-muted-foreground">
                From all campaigns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{marketingStats.averageOpenRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Across all channels
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Referrers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{marketingStats.activeReferrers}</div>
              <p className="text-xs text-muted-foreground">
                {marketingStats.totalReferrals} total referrals
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'campaigns'
                ? 'bg-white dark:bg-slate-700 text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Megaphone className="h-4 w-4 inline mr-2" />
            Campaigns
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'referrals'
                ? 'bg-white dark:bg-slate-700 text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Referral Program
          </button>
          <button
            onClick={() => setActiveTab('promotions')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'promotions'
                ? 'bg-white dark:bg-slate-700 text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Gift className="h-4 w-4 inline mr-2" />
            Promotions
          </button>
        </div>

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Marketing Campaigns</CardTitle>
                <Button onClick={() => setIsCampaignModalOpen(true)}>
                  <Send className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => {
                  const TypeIcon = getTypeIcon(campaign.type);
                  return (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <TypeIcon className="h-5 w-5 text-blue-600" />
                          <h3 className="font-medium">{campaign.name}</h3>
                          <Badge variant={getStatusColor(campaign.status) as any}>
                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Audience:</span>
                            <p>{campaign.audience}</p>
                          </div>
                          <div>
                            <span className="font-medium">Sent:</span>
                            <p>{campaign.sentCount.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">Open Rate:</span>
                            <p>{campaign.openRate}%</p>
                          </div>
                          <div>
                            <span className="font-medium">Revenue:</span>
                            <p>₦{(campaign.revenue / 1000).toLocaleString()}K</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Referral Program Tab */}
        {activeTab === 'referrals' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Referral Program</CardTitle>
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  Add Referrer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {referralPrograms.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{referral.customerName}</h3>
                        <Badge variant="outline">{referral.referralCode}</Badge>
                        <Badge variant={referral.status === 'active' ? 'default' : 'secondary'}>
                          {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Total Referrals:</span>
                          <p>{referral.referralsCount}</p>
                        </div>
                        <div>
                          <span className="font-medium">Successful:</span>
                          <p>{referral.successfulReferrals}</p>
                        </div>
                        <div>
                          <span className="font-medium">Success Rate:</span>
                          <p>{((referral.successfulReferrals / referral.referralsCount) * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <span className="font-medium">Total Earned:</span>
                          <p>₦{(referral.totalEarned / 1000).toLocaleString()}K</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm">
                        <Star className="h-4 w-4 mr-1" />
                        Reward
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Promotions Tab */}
        {activeTab === 'promotions' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Seasonal Promotions</CardTitle>
                <Button>
                  <Gift className="h-4 w-4 mr-2" />
                  Create Promotion
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 rounded-lg border">
                  <h3 className="font-bold text-lg mb-2">Valentine's Day Special</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    20% off on all living room furniture for couples
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">Feb 10-16, 2024</Badge>
                    <Button size="sm">Activate</Button>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border">
                  <h3 className="font-bold text-lg mb-2">Ramadan Office Sale</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Special pricing for corporate furniture during Ramadan
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">Mar 10 - Apr 10, 2024</Badge>
                    <Button size="sm" variant="outline">Schedule</Button>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg border">
                  <h3 className="font-bold text-lg mb-2">Independence Day Promo</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Nigerian-made furniture celebration with special discounts
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">Oct 1-7, 2024</Badge>
                    <Button size="sm" variant="outline">Plan</Button>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950 rounded-lg border">
                  <h3 className="font-bold text-lg mb-2">End of Year Clearance</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Massive discounts to clear inventory for new year
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">Dec 15-31, 2024</Badge>
                    <Button size="sm" variant="outline">Plan</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Campaign Creation Modal */}
        <Dialog open={isCampaignModalOpen} onOpenChange={setIsCampaignModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Campaign Name</label>
                <Input placeholder="Enter campaign name" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Campaign Type</label>
                  <select className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm">
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="social">Social Media</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Target Audience</label>
                  <select className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm">
                    <option value="all">All Customers</option>
                    <option value="retail">Retail Customers</option>
                    <option value="corporate">Corporate Customers</option>
                    <option value="vip">VIP Customers</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Campaign Message</label>
                <Textarea 
                  placeholder="Enter your campaign message..."
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <Input type="date" />
                </div>
                
                <div>
                  <label className="text-sm font-medium">End Date</label>
                  <Input type="date" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Budget (NGN)</label>
                <Input type="number" placeholder="Enter campaign budget" />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCampaignModalOpen(false)}>
                  Cancel
                </Button>
                <Button>
                  Create Campaign
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function MarketingPage() {
  return (
    <ProtectedRoute>
      <MarketingContent />
    </ProtectedRoute>
  );
}