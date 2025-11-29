"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Package,
  Users,
  MapPin,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  BarChart3,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getAllProducts, getAllCustomers, getAllOrders, formatPrice } from "@/lib/db";
import { Product, Customer, Order } from "@/types";
import Link from "next/link";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { RecentOrders } from "@/components/admin/RecentOrders";
import { TopProducts } from "@/components/admin/TopProducts";

function DashboardContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    inStockProducts: 0,
    lowStockProducts: 0,
    featuredProducts: 0,
    totalValue: 0,
    categories: 0,
    totalCustomers: 0,
    vipCustomers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [productsData, customersData, ordersData] = await Promise.all([
        getAllProducts(),
        getAllCustomers(),
        getAllOrders()
      ]);

      setProducts(productsData);
      setCustomers(customersData);
      setOrders(ordersData);

      // Calculate dashboard statistics
      const stats = {
        totalProducts: productsData.length,
        inStockProducts: productsData.filter(p => p.inStock).length,
        lowStockProducts: Math.floor(productsData.length * 0.1), // Simulate 10% low stock
        featuredProducts: productsData.filter(p => p.isFeatured).length,
        totalValue: productsData.reduce((sum, p) => sum + p.price, 0),
        categories: new Set(productsData.map(p => p.category)).size,
        totalCustomers: customersData.length,
        vipCustomers: customersData.filter(c => c.status === 'vip').length,
        totalOrders: ordersData.length,
        pendingOrders: ordersData.filter(o => o.status === 'pending').length,
        totalRevenue: ordersData.reduce((sum, o) => sum + o.total, 0),
        averageOrderValue: ordersData.length > 0 ? ordersData.reduce((sum, o) => sum + o.total, 0) / ordersData.length : 0
      };

      setDashboardStats(stats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: "Add Product", href: "/admin", icon: Package, color: "bg-blue-600" },
    { label: "Manage Orders", href: "/admin/orders", icon: ShoppingCart, color: "bg-green-600" },
    { label: "Customer Management", href: "/admin/customers", icon: Users, color: "bg-purple-600" },
    { label: "Delivery Zones", href: "/admin/logistics", icon: MapPin, color: "bg-orange-600" },
    { label: "Financial Reports", href: "/admin/reports", icon: BarChart3, color: "bg-indigo-600" },
    { label: "Marketing Tools", href: "/admin/marketing", icon: TrendingUp, color: "bg-pink-600" }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Dashboard Overview
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Welcome to your furniture business control center
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Products</CardTitle>
            <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{dashboardStats.totalProducts}</div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              {dashboardStats.inStockProducts} in stock
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{dashboardStats.totalCustomers}</div>
            <p className="text-xs text-green-700 dark:text-green-300">
              {dashboardStats.vipCustomers} VIP customers
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{dashboardStats.totalOrders}</div>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              {dashboardStats.pendingOrders} pending
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{formatPrice(dashboardStats.totalRevenue)}</div>
            <p className="text-xs text-orange-700 dark:text-orange-300">
              Avg: {formatPrice(dashboardStats.averageOrderValue)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {dashboardStats.lowStockProducts > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardHeader className="py-4">
            <CardTitle className="flex items-center text-base text-orange-800 dark:text-orange-200">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Stock Alert: {dashboardStats.lowStockProducts} products are running low on stock.
              <Link href="/admin/inventory" className="ml-auto text-sm underline font-medium hover:text-orange-900 dark:hover:text-orange-100">
                View inventory →
              </Link>
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {/* Charts Section */}
      <DashboardCharts />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Orders */}
        <div className="lg:col-span-2 space-y-8">
          <RecentOrders orders={orders} />

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <Button
                      variant="outline"
                      className="h-24 w-full flex flex-col items-center justify-center space-y-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 transition-all hover:scale-105"
                    >
                      <div className={`p-2.5 rounded-full ${action.color} text-white shadow-sm`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium">{action.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Top Products & Insights */}
        <div className="space-y-8">
          <TopProducts products={products} />

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Bank Transfer</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Mobile Money</span>
                  <span className="font-medium">30%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Card Payment</span>
                  <span className="font-medium">25%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}