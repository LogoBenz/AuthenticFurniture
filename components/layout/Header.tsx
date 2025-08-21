"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Settings, LogOut, Lock, Facebook, Instagram, Linkedin, Twitter, Armchair, Gamepad2, Sofa, Table, Leaf, Puzzle, Search, User } from "lucide-react";

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20 8.5c-2.1-.5-3.8-2-4.5-4v-.5h-3v12.2c0 1.7-1.4 3.1-3.1 3.1S6.3 17.9 6.3 16.2s1.4-3.1 3.1-3.1c.3 0 .6 0 .9.1V10c-.3 0-.6-.1-.9-.1-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6V9.6c1.2 1 2.7 1.7 4.5 1.9V8.5z" />
    </svg>
  );
}
import { ModeToggle } from "@/components/ui/mode-toggle";
import { CartIndicator } from "@/components/ui/cart-indicator";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { EnquiryCartModal } from "@/components/products/EnquiryCartModal";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [showAdminHint, setShowAdminHint] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);
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

      // Update CSS var for header height on scroll as it changes with compact mode
      const headerEl = document.getElementById('site-header');
      if (headerEl) {
        const rect = headerEl.getBoundingClientRect();
        document.documentElement.style.setProperty('--header-offset', `${rect.height}px`);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track viewport to know when to auto-hide the top bar on mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768); // md breakpoint
    checkMobile();
    window.addEventListener('resize', checkMobile);
    // Initialize header offset on mount
    const headerEl = document.getElementById('site-header');
    if (headerEl) {
      const rect = headerEl.getBoundingClientRect();
      document.documentElement.style.setProperty('--header-offset', `${rect.height}px`);
    }

    return () => window.removeEventListener('resize', checkMobile);
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
      <header id="site-header" className="fixed top-0 w-full z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800">
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
      <header id="site-header"
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        {/* Top social bar */}
        <div
          className={`transition-all duration-300 bg-slate-900 text-white ${
            isMobile && isScrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
          } overflow-hidden`}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center space-x-4 py-2 text-white/90">
              <a href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" aria-label="TikTok" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <TikTokIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className={`container mx-auto px-4 ${isScrolled ? 'py-2 sm:py-3' : 'py-3 sm:py-5'}`}>
          <div className="flex items-center justify-between">
            {/* Left: hamburger + logo */}
            <div className="flex items-center gap-2">
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="p-2 rounded-md text-foreground" aria-label="Open menu">
                      <Menu size={20} />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[70vw] max-w-none p-0" aria-label="Mobile navigation menu">
                    {/* Darken the right 30% via overlay provided by SheetOverlay (already 80%) */}
                    <div className="h-full flex flex-col">
                      {/* Top area with logo */}
                      <div className="flex items-center justify-between px-4 py-3 border-b">
                        <Link href="/" className="flex items-center">
                          <h1 className="text-lg font-bold tracking-tighter">Authentic <span className="text-blue-600 dark:text-blue-500">Furniture</span></h1>
                        </Link>
                      </div>
                      {/* Search bar */}
                      <div className="p-4">
                        <Input placeholder="Search products, categories..." className="w-full h-10 rounded-md" />
                      </div>
                      {/* Quick links */}
                      <nav className="px-2 space-y-1">
                        <Link href="/" className="block py-2 px-2 text-sm font-medium rounded-md hover:bg-muted">Home</Link>
                        <Link href="/products" className="block py-2 px-2 text-sm font-medium rounded-md hover:bg-muted">Products</Link>
                      </nav>
                      {/* Categories accordion */}
                      <div className="px-2 py-3">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="cat-1">
                            <AccordionTrigger className="px-2">
                              <span className="flex items-center gap-3">
                                <Armchair className="h-5 w-5 text-slate-600" />
                                <span className="font-medium">Chairs</span>
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="space-y-1 px-2">
                                <li><Link href="/products?category=Office%20Chairs" className="flex items-center gap-3 text-sm py-2 rounded-md hover:bg-muted"><Armchair className="h-4 w-4 text-slate-500" />Office</Link></li>
                                <li><Link href="/products?category=Gaming%20Chairs" className="flex items-center gap-3 text-sm py-2 rounded-md hover:bg-muted"><Gamepad2 className="h-4 w-4 text-slate-500" />Gaming</Link></li>
                                <li><Link href="/products?category=Lounge%20Chairs" className="flex items-center gap-3 text-sm py-2 rounded-md hover:bg-muted"><Sofa className="h-4 w-4 text-slate-500" />Lounge</Link></li>
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="cat-2">
                            <AccordionTrigger className="px-2">
                              <span className="flex items-center gap-3">
                                <Table className="h-5 w-5 text-slate-600" />
                                <span className="font-medium">Tables</span>
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="space-y-1 px-2">
                                <li><Link href="/products?category=Office%20Tables" className="flex items-center gap-3 text-sm py-2 rounded-md hover:bg-muted"><Table className="h-4 w-4 text-slate-500" />Office</Link></li>
                                <li><Link href="/products?category=Dining%20Tables" className="flex items-center gap-3 text-sm py-2 rounded-md hover:bg-muted"><Table className="h-4 w-4 text-slate-500" />Dining</Link></li>
                                <li><Link href="/products?category=Bar%20Tables" className="flex items-center gap-3 text-sm py-2 rounded-md hover:bg-muted"><Table className="h-4 w-4 text-slate-500" />Bar</Link></li>
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="cat-3">
                            <AccordionTrigger className="px-2">
                              <span className="flex items-center gap-3">
                                <Sofa className="h-5 w-5 text-slate-600" />
                                <span className="font-medium">Sofas & Living Room</span>
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="space-y-1 px-2">
                                <li><Link href="/products?category=Living%20Room" className="flex items-center gap-3 text-sm py-2 rounded-md hover:bg-muted"><Sofa className="h-4 w-4 text-slate-500" />Living</Link></li>
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="cat-4">
                            <AccordionTrigger className="px-2">
                              <span className="flex items-center gap-3">
                                <Leaf className="h-5 w-5 text-slate-600" />
                                <span className="font-medium">Garden & Outdoor</span>
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="space-y-1 px-2">
                                <li><Link href="/products?category=Outdoor%20Furniture" className="flex items-center gap-3 text-sm py-2 rounded-md hover:bg-muted"><Leaf className="h-4 w-4 text-slate-500" />Outdoor Furniture</Link></li>
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="cat-5">
                            <AccordionTrigger className="px-2">
                              <span className="flex items-center gap-3">
                                <Puzzle className="h-5 w-5 text-slate-600" />
                                <span className="font-medium">Accessories</span>
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="space-y-1 px-2">
                                <li><Link href="/products?category=Accessories" className="flex items-center gap-3 text-sm py-2 rounded-md hover:bg-muted"><Puzzle className="h-4 w-4 text-slate-500" />All Accessories</Link></li>
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                      {/* Promo highlights */}
                      <div className="px-4 py-4 space-y-2">
                        <div className="text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 rounded px-3 py-2">🔥 Pay Small Small – Flexible Payment</div>
                        <div className="text-xs font-medium bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded px-3 py-2">🚚 Free Delivery in Lagos & Abuja</div>
                        <div className="text-xs font-medium bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded px-3 py-2">⭐ Weekend Deals Up to 20% Off</div>
                      </div>
                      {/* Bottom: theme toggle + auth */}
                      <div className="mt-auto p-4 border-t">
                        <div className="mb-3 flex items-center justify-between rounded-md bg-muted px-3 py-2">
                          <span className="text-sm font-medium">Theme</span>
                          <ModeToggle />
                        </div>
                        {!isAuthenticated ? (
                          <Link href="/auth/login" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-semibold">Login / Sign Up</Link>
                        ) : (
                          <button
                            onClick={handleSignOut}
                            className="mt-2 w-full text-center border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 py-2 rounded-md text-sm font-semibold"
                          >
                            Log out
                          </button>
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <Link href="/" ref={logoRef} className="flex items-center">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tighter text-foreground">
                  Authentic <span className="text-blue-600 dark:text-blue-500">Furniture</span>
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation (center area empty for now) */}
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
            </nav>

            {/* Right icons: search, profile, cart */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950">
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" sideOffset={8} className="p-2 w-72 sm:w-96">
                  <Input autoFocus placeholder="Search products, categories..." className="h-10" />
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (isAuthenticated ? router.push('/profile') : router.push('/join'))}
                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartModalOpen(true)}
                className="relative hover:bg-blue-50 dark:hover:bg-blue-950 p-2"
              >
                <CartIndicator />
                <span className="sr-only">View enquiry cart</span>
              </Button>
            </div>
          </div>
          {/* Drawer replaces old dropdown */}
        </div>
      </header>

      {/* Enquiry Cart Modal */}
      <EnquiryCartModal 
        isOpen={isCartModalOpen} 
        onClose={() => setIsCartModalOpen(false)} 
      />

      {/* Search popover handled inline above */}
    </>
  );
}