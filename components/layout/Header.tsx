"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Settings, LogOut, Lock, Facebook, Instagram, Linkedin, Twitter, Armchair, Gamepad2, Sofa, Table, Leaf, Puzzle, Search, User, ChevronDown, Home, Briefcase, Building, TreePine, Archive, Bed, GraduationCap, Users, Sun, Lamp, Utensils, Wine, Umbrella, Building2, School, Hotel, Store, Warehouse } from "lucide-react";

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
import { SearchModal } from "@/components/ui/SearchModal";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { getSpacesForNavigation } from "@/lib/categories";
import { Space, Subcategory } from "@/types";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [hoveredSpace, setHoveredSpace] = useState<Space | null>(null);
  const [showAdminHint, setShowAdminHint] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showPromoHeader, setShowPromoHeader] = useState(false);
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

  // Load spaces for navigation
  useEffect(() => {
    const loadSpaces = async () => {
      try {
        const spacesData = await getSpacesForNavigation();
        setSpaces(spacesData);
      } catch (error) {
        console.error('Error loading spaces:', error);
      }
    };
    loadSpaces();
  }, []);

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

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      // Spaces
      'Home': Home,
      'Briefcase': Briefcase,
      'Building': Building2,
      'Building2': Building2,
      'TreePine': TreePine,
      'Hotel': Hotel,
      'School': School,
      'Store': Store,
      'Warehouse': Warehouse,
      // Subcategories
      'Sofa': Sofa,
      'Bed': Bed,
      'Archive': Archive,
      'Table': Table,
      'GraduationCap': Armchair, // Better icon for chairs
      'Users': Users,
      'Armchair': Armchair,
      'Sun': Sun,
      'Lamp': Lamp,
      'Utensils': Utensils,
      'Wine': Wine,
      'Umbrella': Umbrella,
    };
    return iconMap[iconName] || Table; // Default to Table icon
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
      {/* Promotional Header - Desktop Only */}
      {showPromoHeader && (
        <div className="hidden lg:block bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-b border-amber-200 dark:border-amber-800">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-center relative">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200 text-center">
                🏠 Furnish your Home, Office, WorkSpace, Hotel, Bar & Lounge with us!
              </p>
              <button
                onClick={() => setShowPromoHeader(false)}
                className="absolute right-0 p-1 hover:bg-amber-200 dark:hover:bg-amber-800 rounded-full transition-colors"
                aria-label="Dismiss promotional message"
              >
                <X className="h-4 w-4 text-amber-700 dark:text-amber-300" />
              </button>
            </div>
          </div>
        </div>
      )}

      <header id="site-header"
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
        style={{ top: showPromoHeader ? '40px' : '0' }}
      >
        {/* Top social bar */}
        <div
          className={`transition-all duration-300 bg-slate-900 text-white ${
            isMobile && isScrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
          } overflow-hidden`}
      >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-2 text-white/90">
              <div className="flex items-center space-x-4">
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
              <div className="hidden md:block text-xs sm:text-sm">
                Bulk? Wholesale Quote Available. Contact: 09037725829
              </div>
              <div className="md:hidden text-[11px]">
                Bulk Quote Available
              </div>
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
                      {/* Navigation links */}
                      <nav className="px-2 space-y-1">
                        <Link href="/products" className="block py-2 px-2 text-sm font-medium rounded-md hover:bg-muted">Products</Link>
                        <Link href="/blog" className="block py-2 px-2 text-sm font-medium rounded-md hover:bg-muted">Blog</Link>
                        <Link href="/e-catalogue" className="block py-2 px-2 text-sm font-medium rounded-md hover:bg-muted">E-Catalogue</Link>
                        <Link href="/showroom" className="block py-2 px-2 text-sm font-medium rounded-md hover:bg-muted">Showroom</Link>
                        <Link href="/about" className="block py-2 px-2 text-sm font-medium rounded-md hover:bg-muted">About Us</Link>
                        <Link href="/careers" className="block py-2 px-2 text-sm font-medium rounded-md hover:bg-muted">Careers</Link>
                      </nav>
                      {/* Shop by Space accordion */}
                      <div className="px-2 py-3">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="spaces">
                            <AccordionTrigger className="px-2">
                              <span className="flex items-center gap-3">
                                <Home className="h-5 w-5 text-slate-600" />
                                <span className="font-medium">Shop by Space</span>
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 px-2">
                                {spaces.map((space) => {
                                  const IconComponent = getIconComponent(space.icon || 'Table');
                                  return (
                                    <Accordion key={space.id} type="single" collapsible className="w-full">
                                      <AccordionItem value={space.id} className="border-none">
                                        <AccordionTrigger className="px-2 py-2 text-sm font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                          <span className="flex items-center gap-3">
                                            <IconComponent className="h-4 w-4 text-slate-600" />
                                            <span>{space.name}</span>
                                          </span>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                          <ul className="space-y-1 pl-6">
                                            {space.subcategories?.map((subcategory) => {
                                              const SubIconComponent = getIconComponent(subcategory.icon || 'Table');
                                              return (
                                                <li key={subcategory.id}>
                                                  <Link 
                                                    href={`/products?space=${space.slug}&subcategory=${subcategory.slug}`}
                                                    className="flex items-center gap-3 text-sm py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                  >
                                                    <SubIconComponent className="h-4 w-4 text-slate-500" />
                                                    <span>{subcategory.name}</span>
                                                  </Link>
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        </AccordionContent>
                                      </AccordionItem>
                                    </Accordion>
                                  );
                                })}
                                <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                                <Link
                                  href="/products"
                                  className="flex items-center gap-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 py-2 rounded-md transition-colors"
                                >
                                  <span>View All Products</span>
                                </Link>
                              </div>
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

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                  <span>Shop by Space</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {/* shadcn-style Professional Mega Menu */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[580px] bg-popover dark:bg-slate-950 rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      {spaces.map((space) => {
                        const IconComponent = getIconComponent(space.icon || 'Table');
                        return (
                          <div key={space.id} className="space-y-2">
                            {/* Space Header - shadcn style */}
                            <Link
                              href={`/products?space=${space.slug}`}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors group/header"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-background">
                                <IconComponent className="h-4 w-4 text-muted-foreground group-hover/header:text-foreground transition-colors" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold leading-none truncate">
                                  {space.name}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {space.subcategories?.length || 0} items
                                </p>
                              </div>
                              <ChevronDown className="h-4 w-4 text-muted-foreground rotate-[-90deg] opacity-0 group-hover/header:opacity-100 transition-opacity" />
                            </Link>
                            
                            {/* Subcategories - shadcn style */}
                            <div className="ml-10 space-y-1">
                              {space.subcategories?.slice(0, 4).map((subcategory) => {
                                const SubIconComponent = getIconComponent(subcategory.icon || 'Table');
                                return (
                                  <Link
                                    key={subcategory.id}
                                    href={`/products?space=${space.slug}&subcategory=${subcategory.slug}`}
                                    className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors group/sub"
                                  >
                                    <SubIconComponent className="h-3.5 w-3.5 text-muted-foreground group-hover/sub:text-foreground transition-colors" />
                                    <span className="truncate">{subcategory.name}</span>
                                  </Link>
                                );
                              })}
                              {space.subcategories && space.subcategories.length > 4 && (
                                <Link
                                  href={`/products?space=${space.slug}`}
                                  className="flex items-center px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  +{space.subcategories.length - 4} more
                                </Link>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Footer - shadcn style */}
                    <div className="mt-4 pt-4 border-t">
                      <Link
                        href="/products"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        <span>View All Products</span>
                        <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <Link
                href="/blog"
                className="text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/e-catalogue"
                className="text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
              >
                E-Catalogue
              </Link>
              <Link
                href="/showroom"
                className="text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
              >
                Showroom
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/careers"
                className="text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
              >
                Careers
              </Link>
            </nav>

            {/* Right icons: search, profile, cart */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsSearchModalOpen(true)}
                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
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

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />
    </>
  );
}