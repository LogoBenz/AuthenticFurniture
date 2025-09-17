import { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminSidebarProvider } from "@/components/admin/AdminSidebarContext";
import { AdminMainContent } from "@/components/admin/AdminMainContent";

export const metadata: Metadata = {
  title: "Admin Dashboard | Authentic Furniture",
  description: "Manage your furniture inventory and business operations",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminSidebarProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <AdminSidebar />
        <AdminMainContent>
          {children}
        </AdminMainContent>
      </div>
    </AdminSidebarProvider>
  );
}