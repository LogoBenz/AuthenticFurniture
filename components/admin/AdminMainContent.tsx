'use client';

import { useAdminSidebar } from './AdminSidebarContext';
import { cn } from '@/lib/utils';

interface AdminMainContentProps {
  children: React.ReactNode;
}

export function AdminMainContent({ children }: AdminMainContentProps) {
  const { isCollapsed } = useAdminSidebar();

  return (
    <main 
      className={cn(
        "transition-all duration-300 ease-in-out min-h-screen",
        isCollapsed ? "lg:pl-20" : "lg:pl-80"
      )}
    >
      <div className="p-6 lg:p-8">
        {children}
      </div>
    </main>
  );
}
