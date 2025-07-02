"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Calendar,
  Download,
  Filter,
  PieChart,
  LineChart
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { formatPrice } from "@/lib/products";

interface SalesData {
  period: string;
  revenue: number;
  orders: number;
  customers: number;
  averageOrderValue: number;
}

interface ProductPerformance {
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
  profitMargin: number;
}

interface RegionalData {
  region: string;
  revenue: number;
  orders: number;
  growth: number;
}

function ReportsContent() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [regionalData, setRegionalData] = useState<RegionalData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReportsData();
  }, [selectedPeriod]);

  const loadReportsData = async () => {
    // Simulate reports data
    const mockSalesData: SalesData[] = [
      {
        period: "January 2024",
        revenue: 2500000,
        orders: 45,
        customers: 38,
        averageOrderValue: 55556
      },
      {
        period: "December 2023",
        revenue: 3200000,
        orders: 52,
        customers: 41,
        averageOrderValue: 61538
      },
      {
        period: "November 2023",
        revenue: 1800000,
        orders: 32,
        customers: 28,
        averageOrderValue: 56250
      },
      {
        period: "October 2023",
        revenue: 2100000,
        orders: 38,
        customers: 33,
        averageOrderValue: 55263
      }
    ];

    const mockProductPerformance: ProductPerformance[] = [
      {
        name: "Ergonomic Office Chair",
        category: "Office Chairs",
        unitsSold: 25,
        revenue: 1875000,
        profitMargin: 40
      },
      {
        name: "Executive Conference Table",
        category: "Conference Furniture",
        unitsSold: 8,
        revenue: 3600000,
        profitMargin: 45
      },
      {
        name: "Luxury Lounge Chair",
        category: "Lounge Chairs",
        unitsSold: 15,
        revenue: 1800000,
        profitMargin: 38
      },
      {
        name: "Premium Leather Sofa Set",
        category: "Living Room",
        unitsSold: 6,
        revenue: 4500000,
        profitMargin: 42
      }
    ];

    const mockRegionalData: RegionalData[] = [
      {
        region: "Lagos",
        revenue: 8500000,
        orders: 125,
        growth: 15.2
      },
      {
        region: "Abuja",
        revenue: 4200000,
        orders: 68,
        growth: 8.7
      },
      {
        region: "Port Harcourt",
        revenue: 2800000,
        orders: 42,
        growth: 12.3
      },
      {
        region: "Kano",
        revenue: 1500000,
        orders: 28,
        growth: 5.1
      }
    ];

    setSalesData(mockSalesData);
    setProductPerformance(mockProductPerformance);
    setRegionalData(mockRegionalData);
    setIsLoading(false);
  };

  const currentPeriod = salesData[0];
  const previousPeriod = salesData[1];
  
  const revenueGrowth = previousPeriod 
    ? ((currentPeriod?.revenue - previousPeriod.revenue) / previousPeriod.revenue) * 100 
    : 0;
  
  const ordersGrowth = previousPeriod 
    ? ((currentPeriod?.orders - previousPeriod.orders) / previousPeriod.orders) * 100 
    : 0;

  const totalRevenue = salesData.reduce((sum, data) => sum + data.revenue, 0);
  const totalOrders = salesData.reduce((sum, data) => sum + data.orders, 0);
  const totalCustomers = salesData.reduce((sum, data) => sum + data.customers, 0);

  if (isLoading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading reports...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Financial Reports</h1>
          <p className="text-muted-foreground">
            Sales analytics and business intelligence for Nigerian market
          </p>
        </div>

        {/* Report Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Report Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
                
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(currentPeriod?.revenue || 0)}</div>
              <div className="flex items-center text-xs">
                {revenueGrowth >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                )}
                <span className={revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(revenueGrowth).toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentPeriod?.orders || 0}</div>
              <div className="flex items-center text-xs">
                {ordersGrowth >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                )}
                <span className={ordersGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(ordersGrowth).toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(currentPeriod?.averageOrderValue || 0)}</div>
              <p className="text-xs text-muted-foreground">
                Per transaction
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentPeriod?.customers || 0}</div>
              <p className="text-xs text-muted-foreground">
                This period
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                Sales Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <p className="font-medium">{data.period}</p>
                      <p className="text-sm text-muted-foreground">{data.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatPrice(data.revenue)}</p>
                      <p className="text-sm text-muted-foreground">
                        AOV: {formatPrice(data.averageOrderValue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Regional Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Regional Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionalData.map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <p className="font-medium">{region.region}</p>
                      <p className="text-sm text-muted-foreground">{region.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatPrice(region.revenue)}</p>
                      <div className="flex items-center text-sm">
                        <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                        <span className="text-green-600">{region.growth}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productPerformance.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-8 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Units Sold</p>
                      <p className="font-bold">{product.unitsSold}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="font-bold">{formatPrice(product.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Profit Margin</p>
                      <Badge variant="default">{product.profitMargin}%</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Nigerian Market Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Nigerian Market Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h3 className="font-medium text-blue-800 dark:text-blue-200">Payment Preferences</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Bank Transfer</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mobile Money</span>
                    <span className="font-medium">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Installments</span>
                    <span className="font-medium">25%</span>
                  </div>
                </div>
              </div>

              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <h3 className="font-medium text-green-800 dark:text-green-200">Peak Sales Periods</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>December</span>
                    <span className="font-medium">+35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>March</span>
                    <span className="font-medium">+20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>September</span>
                    <span className="font-medium">+15%</span>
                  </div>
                </div>
              </div>

              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <h3 className="font-medium text-purple-800 dark:text-purple-200">Customer Segments</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Corporate</span>
                    <span className="font-medium">60%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retail</span>
                    <span className="font-medium">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bulk Buyers</span>
                    <span className="font-medium">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <ReportsContent />
    </ProtectedRoute>
  );
}