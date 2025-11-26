"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Search,
  User,
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import { 
  SofaIcon, 
  BedIcon, 
  ChairIcon, 
  TableIcon, 
  DeskIcon, 
  CabinetIcon, 
  LampIcon, 
  ShelfIcon,
  HomeIcon,
  OfficeIcon,
  HotelIcon,
  RestaurantIcon,
  OutdoorIcon
} from "@/components/icons/FurnitureIcons";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { CartIndicator } from "@/components/ui/cart-indicator";
import { WishlistIndicator } from "@/components/ui/WishlistIndicator";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { EnquiryCartModal } from "@/components/products/EnquiryCartModal";
import { SearchModal } from "@/components/ui/SearchModal";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { getSpacesForNavigation } from "@/lib/categories";
import { Space } from "@/types";

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20 8.5c-2.1-.5-3.8-2-4.5-4v-.5h-3v12.2c0 1.7-1.4 3.1-3.1 3.1S6.3 17.9 6.3 16.2s1.4-3.1 3.1-3.1c.3 0 .6 0 .9.1V10c-.3 0-.6-.1-.9-.1-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6V9.6c1.2 1 2.7 1.7 4.5 1.9V8.5z" />
    </svg>
  );
}

export function CrazyNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [activeSpace, setActiveSpace] = useState<string | null>(null);
  const [showTopHeader, setShowTopHeader] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const { isAuthenticated, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAdminArea = pathname?.startsWith("/admin");

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDiff = currentScrollY - lastScrollY;
          
          // Top header: hide on first scroll down
          if (currentScrollY > 10) {
            setShowTopHeader(false);
            setIsScrolled(true);
          } else {
            setShowTopHeader(true);
            setIsScrolled(false);
          }
          
          // Navbar: hide when scrolling down past 100px, show when scrolling up
          if (currentScrollY > 100 && scrollDiff > 5) {
            setShowNavbar(false);
          } else if (scrollDiff < -5) {
            setShowNavbar(true);
          }
          
          // Always show navbar at the very top
          if (currentScrollY < 50) {
            setShowNavbar(true);
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const loadSpaces = async () => {
      try {
        const spacesData = await getSpacesForNavigation();
        setSpaces(spacesData);
      } catch (error) {
        console.error("Error loading spaces:", error);
      }
    };
    loadSpaces();
  }, []);

  // Admin keyboard shortcut: Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        if (isAuthenticated) {
          router.push('/admin/products');
        } else {
          router.push('/auth/login');
        }
      }
    };

    if (!isAdminArea) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAuthenticated, router, isAdminArea]);

  // Mobile long-press on logo for admin access
  useEffect(() => {
    const logo = logoRef.current;
    if (!logo || isAdminArea) return;

    let longPressTimer: NodeJS.Timeout | null = null;

    const handleTouchStart = () => {
      longPressTimer = setTimeout(() => {
        if (isAuthenticated) {
          router.push('/admin/products');
        } else {
          router.push('/auth/login');
        }
      }, 2000); // 2 second long press
    };

    const handleTouchEnd = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
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
  }, [isAuthenticated, router, isAdminArea]);

  const getIconComponent = (iconName: string) => {
    const iconMap: {
      [key: string]: React.ComponentType<{ className?: string }>;
    } = {
      // Spaces
      Home: HomeIcon,
      Briefcase: OfficeIcon,
      Building: OfficeIcon,
      Building2: HotelIcon,
      TreePine: OutdoorIcon,
      Hotel: HotelIcon,
      School: OfficeIcon,
      Store: OfficeIcon,
      Warehouse: OfficeIcon,
      // Furniture types
      Sofa: SofaIcon,
      Bed: BedIcon,
      Archive: CabinetIcon,
      Table: TableIcon,
      GraduationCap: ChairIcon,
      Users: ChairIcon,
      Armchair: ChairIcon,
      Sun: OutdoorIcon,
      Lamp: LampIcon,
      Utensils: RestaurantIcon,
      Wine: RestaurantIcon,
      Umbrella: OutdoorIcon,
    };
    return iconMap[iconName] || TableIcon;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isAdminArea) {
    return (
      <header className="fixed top-0 w-full z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b">
        <div className="px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" ref={logoRef} className="flex items-center">
              <h1 className="text-lg sm:text-xl font-bold tracking-tighter">
                Authentic <span className="text-blue-600">Furniture</span>
              </h1>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {isAuthenticated && (
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
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

  return (
    <>
      {/* Social Media Top Bar */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: showTopHeader ? 0 : -40 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 w-full z-50 bg-slate-900 text-white"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 text-white/90">
            <div className="flex items-center space-x-4">
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-white transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="X (Twitter)"
                className="hover:text-white transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-white transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="hover:text-white transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="TikTok"
                className="hover:text-white transition-colors"
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
            </div>
            <div className="hidden md:block text-xs sm:text-sm">
              Bulk? Wholesale Quote Available. Contact: 09037725829
            </div>
            <div className="md:hidden text-[11px]">Bulk Quote Available</div>
          </div>
        </div>
      </motion.div>

      <motion.header
        initial={{ y: -100 }}
        animate={{ 
          y: showNavbar ? 0 : -100,
          top: showTopHeader ? 40 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed w-full z-40 shadow-md",
          isScrolled
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl"
            : "bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm"
        )}
      >
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Mobile Menu + Logo */}
            <div className="flex items-center gap-3">
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Menu size={20} />
                    </motion.button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[70vw] max-w-none p-0">
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between px-4 py-3 border-b">
                        <Link href="/">
                          <h1 className="text-lg font-bold">
                            Authentic{" "}
                            <span className="text-blue-600">Furniture</span>
                          </h1>
                        </Link>
                      </div>
                      <div className="p-4">
                        <Input
                          placeholder="Search products..."
                          className="w-full"
                        />
                      </div>
                      <nav className="px-2 space-y-1">
                        <Link
                          href="/products"
                          className="block py-2 px-2 text-sm font-medium rounded-md hover:bg-muted"
                        >
                          Products
                        </Link>
                        <Link
                          href="/blog"
                          className="block py-2 px-2 text-sm font-medium rounded-md hover:bg-muted"
                        >
                          Blog
                        </Link>
                        <Link
                          href="/e-catalogue"
                          className="block py-2 px-2 text-sm font-medium rounded-md hover:bg-muted"
                        >
                          E-Catalogue
                        </Link>
                        <Link
                          href="/showroom"
                          className="block py-2 px-2 text-sm font-medium rounded-md hover:bg-muted"
                        >
                          Showroom
                        </Link>
                        <Link
                          href="/about"
                          className="block py-2 px-2 text-sm font-medium rounded-md hover:bg-muted"
                        >
                          About Us
                        </Link>
                      </nav>
                      <div className="px-2 py-3">
                        <Accordion type="single" collapsible>
                          <AccordionItem value="spaces">
                            <AccordionTrigger className="px-2">
                              Shop by Space
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 px-2">
                                {spaces.map((space) => (
                                  <Link
                                    key={space.id}
                                    href={`/products?space=${space.slug}`}
                                    className="block py-2 text-sm hover:bg-muted rounded-md"
                                  >
                                    {space.name}
                                  </Link>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                      <div className="mt-auto p-4 border-t">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm font-medium">Theme</span>
                          <ModeToggle />
                        </div>
                        {!isAuthenticated ? (
                          <Link
                            href="/auth/login"
                            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                          >
                            Login
                          </Link>
                        ) : (
                          <button
                            onClick={handleSignOut}
                            className="w-full text-center border border-red-600 text-red-600 py-2 rounded-md"
                          >
                            Log out
                          </button>
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <Link href="/" ref={logoRef}>
                <motion.h1
                  whileHover={{ scale: 1.02 }}
                  className="text-lg sm:text-xl font-bold tracking-tighter"
                >
                  Authentic <span className="text-blue-600">Furniture</span>
                </motion.h1>
              </Link>
            </div>

            {/* Desktop Navigation with Crazy Animations */}
            <nav className="hidden md:flex items-center space-x-1">
              {/* Shop by Space with Mega Menu */}
              <div
                className="relative group"
                onMouseEnter={() => setActiveSpace("spaces")}
                onMouseLeave={() => setActiveSpace(null)}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors"
                >
                  <span>Shop by Space</span>
                  <motion.div
                    animate={{ rotate: activeSpace === "spaces" ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.button>
                {/* Animated underline */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>

                <AnimatePresence>
                  {activeSpace === "spaces" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-[600px] bg-white dark:bg-slate-950 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                          {spaces.map((space, index) => {
                            const IconComponent = getIconComponent(
                              space.icon || "Table"
                            );
                            return (
                              <motion.div
                                key={space.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="space-y-2"
                              >
                                <Link
                                  href={`/products?space=${space.slug}`}
                                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group"
                                >
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                                    <IconComponent className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-sm">
                                      {space.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {space.subcategories?.length || 0}{" "}
                                      categories
                                    </p>
                                  </div>
                                </Link>

                                {/* Subcategories */}
                                <div className="ml-10 space-y-1">
                                  {space.subcategories
                                    ?.slice(0, 3)
                                    .map((subcategory) => {
                                      const SubIconComponent = getIconComponent(
                                        subcategory.icon || "Table"
                                      );
                                      return (
                                        <Link
                                          key={subcategory.id}
                                          href={`/products?space=${space.slug}&subcategory=${subcategory.slug}`}
                                          className="flex items-center gap-2 px-2 py-1.5 text-xs rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group/sub"
                                        >
                                          <SubIconComponent className="h-3.5 w-3.5 text-muted-foreground group-hover/sub:text-foreground transition-colors" />
                                          <span className="truncate">
                                            {subcategory.name}
                                          </span>
                                        </Link>
                                      );
                                    })}
                                  {space.subcategories &&
                                    space.subcategories.length > 3 && (
                                      <Link
                                        href={`/products?space=${space.slug}`}
                                        className="flex items-center px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                      >
                                        +{space.subcategories.length - 3} more
                                      </Link>
                                    )}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="mt-4 pt-4 border-t"
                        >
                          <Link
                            href="/products"
                            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                          >
                            View All Products
                          </Link>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {[
                { href: "/blog", label: "Blog" },
                { href: "/e-catalogue", label: "E-Catalogue" },
                { href: "/showroom", label: "Showroom" },
                { href: "/about", label: "About Us" },
                { href: "/careers", label: "Careers" },
              ].map((link) => (
                <motion.div
                  key={link.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <Link
                    href={link.href}
                    className="px-3 py-1.5 block text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                  {/* Animated underline */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </motion.div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsSearchModalOpen(true)}
                  className="p-2"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    isAuthenticated
                      ? router.push("/profile")
                      : router.push("/join")
                  }
                  className="p-2"
                >
                  <User className="h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCartModalOpen(true)}
                  className="relative p-2"
                >
                  <CartIndicator />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <WishlistIndicator />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      <EnquiryCartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
}
