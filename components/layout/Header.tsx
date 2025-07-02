"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Settings, LogOut } from "lucide-react";
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
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <h1 className="text-xl font-bold tracking-tighter text-foreground">
                Authentic <span className="text-blue-600 dark:text-blue-500">Furniture</span>
              </h1>
            </Link>

            <div className="flex items-center space-x-4">
              {!loading && isAuthenticated && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-sm font-medium text-foreground hover:text-red-600 dark:hover:text-red-500 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
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
            ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold tracking-tighter text-foreground">
                Authentic <span className="text-blue-600 dark:text-blue-500">Furniture</span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
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
              
              {/* Admin/Auth Links */}
              {!loading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAdminClick}
                        className="text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Dashboard
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        className="text-sm font-medium text-foreground hover:text-red-600 dark:hover:text-red-500 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-1" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAdminClick}
                      className="text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Admin
                    </Button>
                  )}
                </>
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
                className="relative hover:bg-blue-50 dark:hover:bg-blue-950"
              >
                <CartIndicator />
                <span className="sr-only">View enquiry cart</span>
              </Button>
              
              <ModeToggle />
              
              <button
                onClick={toggleMenu}
                className="ml-2 p-2 rounded-md text-foreground"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pt-4 pb-3">
              <nav className="flex flex-col space-y-3">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors py-2"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors py-2"
                >
                  Products
                </Link>
                
                {/* Mobile Admin/Auth Links */}
                {!loading && (
                  <>
                    {isAuthenticated ? (
                      <>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            handleAdminClick();
                          }}
                          className="text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors py-2 flex items-center text-left"
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Dashboard
                        </button>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            handleSignOut();
                          }}
                          className="text-sm font-medium text-foreground hover:text-red-600 dark:hover:text-red-500 transition-colors py-2 flex items-center text-left"
                        >
                          <LogOut className="h-4 w-4 mr-1" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleAdminClick();
                        }}
                        className="text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors py-2 flex items-center text-left"
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Admin
                      </button>
                    )}
                  </>
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