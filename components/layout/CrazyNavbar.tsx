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
  Heart,
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
  OutdoorIcon,
  WarehouseIcon
} from "@/components/icons/PremiumIcons";
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
import { useWishlist } from "@/hooks/use-wishlist";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [showTopHeader, setShowTopHeader] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const { isAuthenticated, signOut } = useAuth();
  const { wishlistCount } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isAdminArea = pathname?.startsWith("/admin");

  // Close dropdowns on navigation
  useEffect(() => {
    setActiveSpace(null);
    setIsSearchModalOpen(false);
    // We don't close the cart modal automatically as user might want to keep shopping
  }, [pathname, searchParams]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDiff = currentScrollY - lastScrollY.current;

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

          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      Building: HotelIcon, // Changed from OfficeIcon to HotelIcon
      Building2: HotelIcon,
      TreePine: OutdoorIcon,
      Hotel: HotelIcon,
      School: DeskIcon,
      Store: OfficeIcon,
      Warehouse: WarehouseIcon,
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
        <div className="px-4 pl-14 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" ref={logoRef} className="flex items-center">
              <h1 className="text-lg sm:text-xl font-bold tracking-tighter font-heading whitespace-nowrap">
                Authentic <span className="text-blue-800">Furniture</span>
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
        className="fixed top-0 w-full z-50 bg-slate-900 text-white h-10"
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
            <div className="hidden md:block text-xs sm:text-sm font-medium">
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
                          <h1 className="text-lg font-bold font-heading whitespace-nowrap">
                            Authentic{" "}
                            <span className="text-blue-800">Furniture</span>
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
                          className="block py-2 px-2 text-sm font-medium rounded-md hover:bg-muted font-heading"
                        >
                          Products
                        </Link>
                        <Link
                          href="/blog"
                          className="block py-2 px-2 text-sm font-medium rounded-md hover:bg-muted font-heading"
                        >
                          Blog
                        </Link>
                        <Link
                          href="/e-catalogue"
                          className="block py-2 px-2 text-sm font-medium rounded-md hover:bg-muted font-heading"
                        >
                          E-Catalogue
                        </Link>
                        <Link
                          href="/showroom"
                          className="block py-2 px-2 text-sm font-medium rounded-md hover:bg-muted font-heading"
                        >
                          Showroom
                        </Link>
                        <Link
                          href="/about"
                          className="block py-2 px-2 text-sm font-medium rounded-md hover:bg-muted font-heading"
                        >
                          About Us
                        </Link>
                        <Link
                          href="/wishlist"
                          className="flex items-center justify-between py-2 px-2 text-sm font-medium rounded-md hover:bg-muted font-heading"
                        >
                          <span className="flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            Wishlist
                          </span>
                          {wishlistCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                              {wishlistCount > 99 ? '99+' : wishlistCount}
                            </span>
                          )}
                        </Link>
                      </nav>
                      <div className="px-2 py-3">
                        <Accordion type="single" collapsible>
                          <AccordionItem value="spaces">
                            <AccordionTrigger className="px-2 font-heading">
                              Shop by Space
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 px-2">
                                {spaces.map((space) => (
                                  <Link
                                    key={space.id}
                                    href={`/products?space=${space.slug}`}
                                    className="block py-2 text-sm hover:bg-muted rounded-md font-medium"
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
                            className="block w-full text-center bg-blue-800 hover:bg-blue-700 text-white py-2 rounded-md font-heading"
                          >
                            Login
                          </Link>
                        ) : (
                          <button
                            onClick={handleSignOut}
                            className="w-full text-center border border-red-600 text-red-600 py-2 rounded-md font-heading"
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
                  className="text-lg sm:text-xl font-bold tracking-tighter font-heading whitespace-nowrap"
                >
                  Authentic <span className="text-blue-800">Furniture</span>
                </motion.h1>
              </Link>
            </div>

            {/* Desktop Navigation with Crazy Animations */}
            <nav className="hidden md:flex items-center space-x-1">
              {/* Shop by Space with Mega Menu */}
              <div
                className="relative group"
                onMouseEnter={() => {
                  setActiveSpace("spaces");
                  // Default to first space if none selected
                  if (!selectedSpaceId && spaces.length > 0) {
                    setSelectedSpaceId(spaces[0].id);
                  }
                }}
                onMouseLeave={() => setActiveSpace(null)}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors font-heading"
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
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-800 transition-all duration-300 group-hover:w-full"></span>

                <AnimatePresence>
                  {activeSpace === "spaces" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98, x: "-50%" }}
                      animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                      exit={{ opacity: 0, y: 10, scale: 0.98, x: "-50%" }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 mt-2 w-[800px] bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden ring-1 ring-slate-900/5"
                    >
                      <div className="flex h-[400px]">
                        {/* Sidebar */}
                        <div className="w-72 bg-slate-50/50 dark:bg-slate-900/50 border-r border-slate-100 dark:border-slate-800 p-4 overflow-y-auto custom-scrollbar">
                          <div className="space-y-1">
                            {spaces.map((space) => {
                              const IconComponent = getIconComponent(
                                space.icon || "Table"
                              );
                              const isActive = selectedSpaceId === space.id;

                              return (
                                <motion.button
                                  key={space.id}
                                  onClick={() => setSelectedSpaceId(space.id)}
                                  onMouseEnter={() => setSelectedSpaceId(space.id)}
                                  className={cn(
                                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 font-heading",
                                    isActive
                                      ? "bg-white dark:bg-slate-800 text-blue-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
                                      : "text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                                  )}
                                >
                                  <div className={cn(
                                    "p-2 rounded-lg transition-colors",
                                    isActive ? "bg-slate-100 dark:bg-blue-900/30" : "bg-transparent"
                                  )}>
                                    <IconComponent className={cn(
                                      "w-4 h-4",
                                      isActive ? "text-blue-800" : "text-slate-500 dark:text-slate-400"
                                    )} />
                                  </div>
                                  <span>{space.name}</span>
                                  {isActive && (
                                    <motion.div
                                      layoutId="activeIndicator"
                                      className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-800"
                                    />
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6 bg-white dark:bg-slate-950">
                          {selectedSpaceId && (
                            <div className="h-full flex flex-col">
                              {spaces.map((space) => {
                                if (space.id !== selectedSpaceId) return null;

                                return (
                                  <motion.div
                                    key={space.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="h-full flex flex-col"
                                  >
                                    <div className="flex items-center justify-between mb-6">
                                      <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 font-heading">
                                          {space.name}
                                        </h3>
                                      </div>
                                      <Link
                                        href={`/products?space=${space.slug}`}
                                        className="text-sm font-medium text-blue-800 hover:text-blue-700 flex items-center gap-1 group/link font-heading"
                                      >
                                        View All
                                        <ChevronDown className="w-4 h-4 -rotate-90 transition-transform group-hover/link:translate-x-1" />
                                      </Link>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar">
                                      {space.subcategories?.map((subcategory, idx) => {
                                        // Override icon for Complementary
                                        const iconName = subcategory.name.toLowerCase().includes('complementary')
                                          ? 'Lamp'
                                          : (subcategory.icon || "Table");

                                        const SubIconComponent = getIconComponent(iconName);

                                        return (
                                          <Link
                                            key={subcategory.id}
                                            href={`/products?space=${space.slug}&subcategory=${subcategory.slug}`}
                                          >
                                            <motion.div
                                              initial={{ opacity: 0, y: 10 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              transition={{ delay: idx * 0.05 }}
                                              className="group/card flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all duration-200"
                                            >
                                              <div className="mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 group-hover/card:bg-white dark:group-hover/card:bg-slate-800 group-hover/card:shadow-sm transition-all">
                                                <SubIconComponent className="w-5 h-5 text-slate-500 group-hover/card:text-blue-800 transition-colors" />
                                              </div>
                                              <div>
                                                <h4 className="font-medium text-sm text-slate-900 dark:text-slate-200 group-hover/card:text-blue-800 transition-colors font-heading">
                                                  {subcategory.name}
                                                </h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                                                  {subcategory.description || `Browse ${subcategory.name} collection`}
                                                </p>
                                              </div>
                                            </motion.div>
                                          </Link>
                                        );
                                      })}
                                    </div>

                                    {/* Featured / Promo Area (Optional) */}
                                    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 flex items-center justify-between">
                                        <div>
                                          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 font-heading">
                                            Looking to furnish your {space.name}?
                                          </p>
                                          <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5 font-medium">
                                            Wholesale rate available. Contact: 09037725829
                                          </p>
                                        </div>
                                        <Button size="sm" variant="secondary" className="bg-white dark:bg-slate-800 text-blue-800 hover:bg-slate-100 font-heading">
                                          Contact Us
                                        </Button>
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          )}
                        </div>
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
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-800 transition-all duration-300 group-hover:w-full"></span>
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

              {/* Wishlist moved to sidebar */}
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
