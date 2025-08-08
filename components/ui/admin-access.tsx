"use client";

import { useState, useEffect } from "react";
import { Settings, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

interface AdminAccessProps {
  variant?: "subtle" | "icon" | "text";
  className?: string;
}

export function AdminAccess({ variant = "subtle", className = "" }: AdminAccessProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [showHint, setShowHint] = useState(false);

  const handleAdminClick = () => {
    if (isAuthenticated) {
      router.push('/admin/dashboard');
    } else {
      router.push('/auth/login');
    }
  };

  // Show hint for authorized users after a delay
  useEffect(() => {
    if (isAuthenticated && !loading) {
      const timer = setTimeout(() => {
        setShowHint(true);
      }, 5000); // Show after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading]);

  // Don't render anything for unauthorized users in subtle mode
  if (variant === "subtle" && !isAuthenticated) {
    return null;
  }

  // Icon-only variant
  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleAdminClick}
        className={`p-1 h-auto ${className}`}
        title={isAuthenticated ? "Admin Dashboard" : "Admin Login"}
      >
        <Settings className="h-3 w-3" />
      </Button>
    );
  }

  // Text variant
  if (variant === "text") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleAdminClick}
        className={`text-xs text-muted-foreground hover:text-foreground ${className}`}
      >
        {isAuthenticated ? "Dashboard" : "Admin"}
      </Button>
    );
  }

  // Subtle variant (default) - only shows for authenticated users
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {showHint && (
        <span className="text-xs text-muted-foreground mr-2">
          Press Ctrl+Shift+A for admin access
        </span>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleAdminClick}
        className="p-1 h-auto text-muted-foreground hover:text-foreground"
        title="Admin Dashboard"
      >
        <Lock className="h-3 w-3" />
      </Button>
    </div>
  );
} 