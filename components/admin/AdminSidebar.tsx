"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MapPin,
  BarChart3,
  MessageSquare,
  Settings,
  Warehouse,
  TrendingUp,
  FileText,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Tags,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAdminSidebar } from "./AdminSidebarContext";

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Overview and key metrics",
    category: "overview"
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
    description: "Manage product catalog",
    category: "content"
  },
  {
    title: "Spaces & Categories",
    href: "/admin/spaces",
    icon: Home,
    description: "Manage spaces and subcategories",
    category: "content"
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Tags,
    description: "Manage product categories and cover photos",
    category: "content"
  },
  {
    title: "Inventory",
    href: "/admin/inventory",
    icon: Warehouse,
    description: "Stock levels and tracking",
    category: "content"
  },
  {
    title: "Warehouses",
    href: "/admin/warehouses",
    icon: MapPin,
    description: "Warehouse locations and management",
    category: "content"
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    description: "Order management and fulfillment",
    category: "management"
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
    description: "Customer database and communication",
    category: "management"
  },
  {
    title: "Logistics",
    href: "/admin/logistics",
    icon: MapPin,
    description: "Delivery zones and drivers",
    category: "management"
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
    description: "Sales analytics and insights",
    category: "analytics"
  },
  {
    title: "Marketing",
    href: "/admin/marketing",
    icon: TrendingUp,
    description: "Campaigns and promotions",
    category: "analytics"
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
    description: "Payment tracking and verification",
    category: "management"
  },
  {
    title: "Blog",
    href: "/admin/blog",
    icon: FileText,
    description: "Blog posts and content management",
    category: "content"
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
    icon: MessageSquare,
    description: "Customer reviews and feedback",
    category: "content"
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "System configuration",
    category: "settings"
  }
];

const categories = {
  overview: "Dashboard",
  content: "Content Management",
  management: "User Management", 
  analytics: "Reports & Analytics",
  settings: "Settings"
};

export function AdminSidebar() {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useAdminSidebar();
  const [isHovered, setIsHovered] = useState(false);

  const groupedItems = adminNavItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof adminNavItems>);

  // Determine if sidebar should show expanded content
  const showExpanded = !isCollapsed || isHovered;

  const SidebarContent = ({ isMobile = false }) => {
    const shouldShowExpanded = isMobile || showExpanded;
    
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={cn(
          "flex items-center border-b border-slate-200 dark:border-slate-700",
          isCollapsed && !isMobile && !isHovered ? "justify-center p-3" : "justify-between p-4"
        )}>
          {shouldShowExpanded && (
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
              Admin Panel
            </h2>
          )}
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "h-8 w-8 p-0 flex-shrink-0 hover:bg-slate-200 dark:hover:bg-slate-700",
                !shouldShowExpanded && "mx-auto"
              )}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className={cn(
          "flex-1 overflow-y-auto space-y-6 scrollbar-hide scrollbar-hover",
          isCollapsed && !isMobile && !isHovered ? "p-2" : "p-4"
        )}>
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              {shouldShowExpanded && (
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 whitespace-nowrap px-2">
                  {categories[category as keyof typeof categories]}
                </h3>
              )}
              <div className="space-y-1">
                {items.map((item) => {
                  const isActive = pathname === item.href;
                  const isIconOnly = isCollapsed && !isMobile && !isHovered;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => isMobile && setIsMobileOpen(false)}
                      className={cn(
                        "group flex items-center rounded-lg text-sm font-medium transition-all duration-200 relative",
                        isIconOnly ? "p-3 justify-center mx-auto w-12 h-12" : "p-3",
                        isActive
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 shadow-sm"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                      )}
                      title={isIconOnly ? item.title : undefined}
                    >
                      <item.icon
                        className={cn(
                          "flex-shrink-0 transition-colors",
                          isIconOnly ? "h-6 w-6" : "h-5 w-5 mr-3",
                          isActive
                            ? "text-blue-600 dark:text-blue-300"
                            : "text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400"
                        )}
                      />
                      {shouldShowExpanded && (
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{item.title}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white dark:bg-slate-900 shadow-md"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-slate-900 shadow-xl">
            <SidebarContent isMobile />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div 
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:dark:bg-slate-900 lg:border-r lg:border-slate-200 lg:dark:border-slate-700 transition-all duration-300 ease-in-out z-40",
          isCollapsed && !isHovered ? "lg:w-20" : "lg:w-80",
          isCollapsed && isHovered && "shadow-2xl lg:border-r-2"
        )}
        onMouseEnter={() => {
          if (isCollapsed) {
            setIsHovered(true);
          }
        }}
        onMouseLeave={() => {
          if (isCollapsed) {
            setIsHovered(false);
          }
        }}
      >
        <SidebarContent />
      </div>
    </>
  );
}