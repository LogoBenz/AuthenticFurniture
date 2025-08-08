"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Settings, LogOut, Lock } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { CartIndicator } from "@/components/ui/cart-indicator";
import { Button } from "@/components/ui/button";
import { EnquiryCartModal } from "@/components/products/EnquiryCartModal";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [showAdminHint, setShowAdminHint] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const { isAuthenticated, signOut, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're in admin area
  const isAdminArea = pathname?.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show admin hint for authorized users after a delay
  useEffect(() => {
    if (isAuthenticated && !loading && !isAdminArea) {
      const timer = setTimeout(() => {
        setShowAdminHint(true);
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading, isAdminArea]);

  // Hidden admin access via keyboard shortcut (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Shift+A
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        if (isAuthenticated) {
          router.push('/admin/dashboard');
        } else {
          router.push('/auth/login');
        }
      }
    };

    // Only add listener if not in admin area
    if (!isAdminArea) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAuthenticated, router, isAdminArea]);

  // Mobile long-press gesture for admin access
  useEffect(() => {
    const logo = logoRef.current;
    if (!logo || isAdminArea) return;

    const handleTouchStart = () => {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          router.push('/admin/dashboard');
        } else {
          router.push('/auth/login');
        }
      }, 2000); // 2 second long press
      
      setLongPressTimer(timer);
    };

    const handleTouchEnd = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
    };

    logo.addEventListener('touchstart', handleTouchStart);
    logo.addEventListener('touchend', handleTouchEnd);
    logo.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      logo.removeEventListener('touchstart', handleTouchStart);
      logo.removeEventListener('touchend', handleTouchEnd);
      logo.removeEventListener('touchcancel', handleTouchEnd);
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [isAuthenticated, router, isAdminArea, longPressTimer]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
      router.push('/admin/dashboard');
    } else {
      router.push('/auth/login');
    }
  };

  // Don't render the full header in admin area - just a minimal top bar
  if (isAdminArea) {
    return (
      <header className="fixed w-full z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <h1 className="text-lg sm:text-xl font-bold tracking-tighter text-foreground">
                Authentic <span className="text-blue-600 dark:text-blue-500">Furniture</span>
              </h1>
            </Link>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {!loading && isAuthenticated && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-xs sm:text-sm font-medium text-foreground hover:text-red-600 dark:hover:text-red-500 transition-colors"
                >
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              )}
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Regular header for public pages
  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm py-2 sm:py-3"
            : "bg-transparent py-3 sm:py-5"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" ref={logoRef} className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tighter text-foreground">
                Authentic <span className="text-blue-600 dark:text-blue-500">Furniture</span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Link
                href="/"
                className="text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
              >
                Products
              </Link>
              
              {/* Admin Hint for authorized users */}
              {showAdminHint && isAuthenticated && (
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>Ctrl+Shift+A for admin</span>
                </div>
              )}
              
              {/* Cart Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartModalOpen(true)}
                className="relative hover:bg-blue-50 dark:hover:bg-blue-950"
              >
                <CartIndicator />
                <span className="sr-only">View enquiry cart</span>
              </Button>
              
              <ModeToggle />
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartModalOpen(true)}
                className="relative hover:bg-blue-50 dark:hover:bg-blue-950 p-2"
              >
                <CartIndicator />
                <span className="sr-only">View enquiry cart</span>
              </Button>
              
              <ModeToggle />
              
              <button
                onClick={toggleMenu}
                className="ml-1 p-2 rounded-md text-foreground"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pt-3 pb-4 border-t border-slate-200 dark:border-slate-800 mt-3">
              <nav className="flex flex-col space-y-3">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors py-2 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors py-2 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Products
                </Link>
                
                {/* Mobile Admin Access - Only for authenticated users */}
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleAdminClick();
                    }}
                    className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors py-2 px-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950 flex items-center text-left"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Dashboard
                  </button>
                )}
                
                {/* Mobile Admin Hint */}
                {showAdminHint && isAuthenticated && (
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground py-2 px-2">
                    <Lock className="h-3 w-3" />
                    <span>Long-press logo for quick admin access</span>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Enquiry Cart Modal */}
      <EnquiryCartModal 
        isOpen={isCartModalOpen} 
        onClose={() => setIsCartModalOpen(false)} 
      />
    </>
  );
}