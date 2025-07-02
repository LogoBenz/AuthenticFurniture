import { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar />
      <main className="lg:pl-80 pt-16">
        <div className="px-4 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}