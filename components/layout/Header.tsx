"use client";

import Link from "next/link";
import { useState, useEffect, useRef, createContext, useContext, useCallback } from "react";
import {
  Menu,
  X,
  Search,
  User,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  LogOut,
  ChevronDown,
  ArrowRight,
  Home,
  Briefcase,
  Building2,
  TreePine,
  Hotel,
  School,
  Store,
  Warehouse,
  Sofa,
  Bed,
  Archive,
  Table,
  Armchair,
  Sun,
  Lamp,
  Utensils,
  Wine,
  Umbrella,
  Users
} from "lucide-react";
import * as HoverCard from "@radix-ui/react-hover-card";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { CartIndicator } from "@/components/ui/cart-indicator";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { EnquiryCartModal } from "@/components/products/EnquiryCartModal";
import { SearchModal } from "@/components/ui/SearchModal";
import { useAuth } from "@/hooks/use-auth";
import { useWishlist } from "@/hooks/use-wishlist";
import { WishlistIndicator } from "@/components/ui/WishlistIndicator";
import { useRouter, usePathname } from "next/navigation";
import { getSpacesForNavigation } from "@/lib/categories";
import { Space } from "@/types";

// --- Icons & Helpers ---

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20 8.5c-2.1-.5-3.8-2-4.5-4v-.5h-3v12.2c0 1.7-1.4 3.1-3.1 3.1S6.3 17.9 6.3 16.2s1.4-3.1 3.1-3.1c.3 0 .6 0 .9.1V10c-.3 0-.6-.1-.9-.1-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6V9.6c1.2 1 2.7 1.7 4.5 1.9V8.5z" />
    </svg>
  );
}



const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    'Home': Home,
    'Briefcase': Briefcase,
    'Building': Building2,
    'Building2': Building2,
    'TreePine': TreePine,
    'Hotel': Hotel,
    'School': School,
    'Store': Store,
    'Warehouse': Warehouse,
    'Sofa': Sofa,
    'Bed': Bed,
    'Archive': Archive,
    'Table': Table,
    'GraduationCap': Armchair,
    'Users': Users,
    'Armchair': Armchair,
    'Sun': Sun,
    'Lamp': Lamp,
    'Utensils': Utensils,
    'Wine': Wine,
    'Umbrella': Umbrella,
  };
  return iconMap[iconName] || Table;
};

// --- Navigation Context ---

interface NavigationContextType {
  isScrolled: boolean;
  isMobile: boolean;
  spaces: Space[];
}

const NavigationContext = createContext<NavigationContextType>({
  isScrolled: false,
  isMobile: false,
  spaces: [],
});

export const useNavigation = () => useContext(NavigationContext);

// --- Hooks ---

function useHideOnScroll() {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const diff = currentScrollY - lastScrollY.current;

          // Only update if difference is significant (hysteresis) to prevent jitter
          if (Math.abs(diff) > 10) {
            // Hide if scrolling down and past 100px
            // Show if scrolling up
            if (diff > 0 && currentScrollY > 100) {
              setIsHidden(true);
            } else if (diff < 0) {
              setIsHidden(false);
            }
          }
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isHidden;
}

// --- Components ---

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showPromoHeader, setShowPromoHeader] = useState(false); // Kept for compatibility if needed, though not in request explicitly, good to have.

  const isHidden = useHideOnScroll();
  const { isAuthenticated, signOut } = useAuth();
  const { wishlistCount } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();
  const logoRef = useRef<HTMLAnchorElement>(null);

  // Check if we're in admin area
  const isAdminArea = pathname?.startsWith('/admin');

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load spaces
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

  // Admin Shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        router.push(isAuthenticated ? '/admin/dashboard' : '/auth/login');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated, router]);

  // Long press for admin
  useEffect(() => {
    const logo = logoRef.current;
    if (!logo || isAdminArea) return;
    let timer: NodeJS.Timeout;
    const start = () => { timer = setTimeout(() => router.push(isAuthenticated ? '/admin/dashboard' : '/auth/login'), 2000); };
    const end = () => clearTimeout(timer);
    logo.addEventListener('touchstart', start);
    logo.addEventListener('touchend', end);
    logo.addEventListener('touchcancel', end);
    return () => {
      logo.removeEventListener('touchstart', start);
      logo.removeEventListener('touchend', end);
      logo.removeEventListener('touchcancel', end);
    };
  }, [isAuthenticated, router, isAdminArea]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (isAdminArea) return null; // Or return a simplified admin header if preferred, but usually handled by layout

  return (
    <NavigationContext.Provider value={{ isScrolled, isMobile, spaces }}>
      {/* Top Social Bar */}
      <div
        className={`bg-slate-900 text-white transition-all duration-300 overflow-hidden ${isHidden ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'
          }`}
      >
        <div className="container mx-auto px-4 h-10 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center space-x-4">
            <SocialLink href="#" icon={Facebook} label="Facebook" />
            <SocialLink href="#" icon={Twitter} label="Twitter" />
            <SocialLink href="#" icon={Instagram} label="Instagram" />
            <SocialLink href="#" icon={Linkedin} label="LinkedIn" />
            <SocialLink href="#" icon={TikTokIcon} label="TikTok" />
          </div>
          <div className="hidden md:block">Bulk? Wholesale Quote Available. Contact: 09037725829</div>
          <div className="md:hidden">Bulk Quote Available</div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ease-in-out border-b border-transparent
          ${isScrolled ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-slate-200 dark:border-slate-800" : "bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800"}
          ${isHidden ? '-translate-y-full' : 'translate-y-0'}
        `}
        style={{
          top: isScrolled ? '0' : '40px'
        }}
      >
        <div className={`w-full px-4 sm:px-6 lg:px-12 mx-auto ${isScrolled ? 'py-3' : 'py-5'}`}>
          <div className="flex items-center justify-between h-14">

            {/* 1. Logo Section */}
            <div className="flex items-center gap-4">
              <MobileMenu spaces={spaces} wishlistCount={wishlistCount} isAuthenticated={isAuthenticated} onSignOut={handleSignOut} />
              <Link href="/" ref={logoRef} className="flex items-center mr-8">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tighter whitespace-nowrap">
                  Authentic <span className="text-blue-600 dark:text-blue-500">Furniture</span>
                </h1>
              </Link>
            </div>

            {/* 2. Central Pill Navigation (Desktop Only) */}
            <nav className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1.5 mx-4">
              <ShopBySpaceMenu spaces={spaces} />
              <div className="h-5 w-px bg-slate-300 dark:bg-slate-600 mx-1"></div>
              <Link
                href="/showroom"
                className="px-4 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors rounded-md hover:bg-white dark:hover:bg-slate-700 shadow-sm hover:shadow-sm"
              >
                Showroom
              </Link>
              <div className="h-5 w-px bg-slate-300 dark:bg-slate-600 mx-1"></div>
              <CompanyMenu />
            </nav>

            {/* 3. Search & Icons Section */}
            <div className="flex items-center gap-3 ml-auto">

              {/* Visible Search Bar (Desktop) */}
              <div className="hidden lg:block relative w-[280px]">
                <SearchInput />
              </div>

              {/* Mobile Search Icon */}
              <div className="lg:hidden">
                <Button variant="ghost" size="icon" onClick={() => setIsSearchModalOpen(true)}>
                  <Search className="h-5 w-5" strokeWidth={1.5} />
                </Button>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(isAuthenticated ? '/profile' : '/auth/login')}
                  className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800"
                >
                  <User className="h-5 w-5" strokeWidth={1.5} />
                </Button>

                <WishlistIndicator />

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCartModalOpen(true)}
                    className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800"
                  >
                    <CartIndicator />
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      <EnquiryCartModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
    </NavigationContext.Provider>
  );
}

// --- Sub-components ---

function SocialLink({ href, icon: Icon, label }: { href: string, icon: any, label: string }) {
  return (
    <a href={href} aria-label={label} className="hover:text-blue-400 transition-colors">
      <Icon className="h-4 w-4" />
    </a>
  );
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-medium hover:text-blue-800 dark:hover:text-blue-400 transition-colors">
      {children}
    </Link>
  );
}

const MOCK_TYPES: Record<string, string[]> = {
  // Office Chairs (from assign_office_chair_types.sql)
  'Office Chairs': ['Ergonomic Chairs', 'Mesh Chairs', 'Swivel Chairs', 'Guest Chairs', 'Task Chairs'],
  'Chairs': ['Ergonomic Chairs', 'Mesh Chairs', 'Swivel Chairs', 'Guest Chairs', 'Task Chairs'],
  'office-chairs': ['Ergonomic Chairs', 'Mesh Chairs', 'Swivel Chairs', 'Guest Chairs', 'Task Chairs'],

  // Office Tables (from add_product_type.sql)
  'Office Tables': ['Executive Tables', 'Electric Desks', 'Reception Tables', 'Conference Tables', 'Standard Tables'],
  'Tables': ['Executive Tables', 'Electric Desks', 'Reception Tables', 'Conference Tables', 'Standard Tables'],
  'Desks & Tables': ['Executive Tables', 'Electric Desks', 'Reception Tables', 'Conference Tables', 'Standard Tables'],
  'office-tables': ['Executive Tables', 'Electric Desks', 'Reception Tables', 'Conference Tables', 'Standard Tables'],
  'desks-tables': ['Executive Tables', 'Electric Desks', 'Reception Tables', 'Conference Tables', 'Standard Tables'],

  // Other Fallbacks (Maintained)
  'Sofa Sets': ['L-Shaped Sofas', 'Sectional Sofas', 'Recliner Sofas', 'Chesterfield Sofas', 'Sofa Beds'],
  'Sofas': ['L-Shaped Sofas', 'Sectional Sofas', 'Recliner Sofas', 'Chesterfield Sofas', 'Sofa Beds'],
  'sofa-sets': ['L-Shaped Sofas', 'Sectional Sofas', 'Recliner Sofas', 'Chesterfield Sofas', 'Sofa Beds'],

  'Beds': ['King Size Beds', 'Queen Size Beds', 'Bunk Beds', 'Storage Beds', 'Upholstered Beds'],
  'beds': ['King Size Beds', 'Queen Size Beds', 'Bunk Beds', 'Storage Beds', 'Upholstered Beds'],

  'Cabinets': ['Wardrobes', 'Shoe Racks', 'Display Cabinets', 'Filing Cabinets', 'Sideboards'],
  'cabinets': ['Wardrobes', 'Shoe Racks', 'Display Cabinets', 'Filing Cabinets', 'Sideboards'],

  'Dining Sets': ['4-Seater Sets', '6-Seater Sets', '8-Seater Sets', 'Glass Top Tables', 'Marble Top Tables'],
  'dining-sets': ['4-Seater Sets', '6-Seater Sets', '8-Seater Sets', 'Glass Top Tables', 'Marble Top Tables'],

  'Auditorium Chairs': ['Lecture Hall Seating', 'Cinema Chairs', 'Church Seating', 'VIP Auditorium Seats'],
  'auditorium-chairs': ['Lecture Hall Seating', 'Cinema Chairs', 'Church Seating', 'VIP Auditorium Seats'],

  'Student Chairs': ['Training Chairs', 'Tablet Chairs', 'Classroom Desks', 'Library Seating'],
  'student-chairs': ['Training Chairs', 'Tablet Chairs', 'Classroom Desks', 'Library Seating'],

  'Canopy': ['Gazebos', 'Outdoor Umbrellas', 'Marquees', 'Carports'],
  'canopy': ['Gazebos', 'Outdoor Umbrellas', 'Marquees', 'Carports'],

  'Patio Sets': ['Rattan Sets', 'Garden Swings', 'Outdoor Dining', 'Sun Loungers'],
  'patio-sets': ['Rattan Sets', 'Garden Swings', 'Outdoor Dining', 'Sun Loungers'],

  'Lounges & Bars': ['Bar Stools', 'Lounge Chairs', 'Coffee Tables', 'Bar Cabinets'],
  'lounges-bars': ['Bar Stools', 'Lounge Chairs', 'Coffee Tables', 'Bar Cabinets']
};

function ShopBySpaceMenu({ spaces }: { spaces: Space[] }) {
  const [open, setOpen] = useState(false);
  const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null);
  const [activeSubcategorySlug, setActiveSubcategorySlug] = useState<string | null>(null);

  // Set default active space when menu opens or spaces load
  useEffect(() => {
    if (open && spaces.length > 0 && !activeSpaceId) {
      setActiveSpaceId(spaces[0].id);
    }
  }, [open, spaces, activeSpaceId]);

  const activeSpace = spaces.find(s => s.id === activeSpaceId) || spaces[0];
  const activeSubcategory = activeSpace?.subcategories?.find(sub => sub.slug === activeSubcategorySlug);
  // Try to find types by name or slug
  const activeTypes = activeSubcategory
    ? (MOCK_TYPES[activeSubcategory.name] || MOCK_TYPES[activeSubcategory.slug] || MOCK_TYPES[activeSubcategory.name.trim()])
    : null;

  return (
    <HoverCard.Root openDelay={100} closeDelay={200} onOpenChange={setOpen}>
      <HoverCard.Trigger asChild>
        <button
          className={`flex items-center space-x-1 px-4 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all rounded-md outline-none ${open ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm'}`}
        >
          <span>Shop by Space</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="z-50 w-[1000px] h-[550px] bg-white dark:bg-slate-950 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-0 overflow-hidden animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 flex flex-col"
          sideOffset={10}
          align="center"
        >
          {/* Main Content Area */}
          <div className="flex flex-1 overflow-hidden">

            {/* 1. Sidebar (Spaces) */}
            <div className="w-[260px] bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 py-6 overflow-y-auto">
              <div className="px-6 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Spaces</h3>
              </div>
              <div className="space-y-1 px-3">
                {spaces.map(space => {
                  const Icon = getIconComponent(space.icon || 'Table') as any;
                  const isActive = activeSpaceId === space.id;
                  return (
                    <button
                      key={space.id}
                      onMouseEnter={() => setActiveSpaceId(space.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                      {space.name}
                      {isActive && <ChevronDown className="h-4 w-4 ml-auto -rotate-90 text-blue-600/50" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Subcategories Area */}
            <div className="flex-1 bg-white dark:bg-slate-950 p-8 overflow-y-auto">
              {activeSpace && (
                <div className="h-full flex flex-col">
                  {/* Header for Active Space */}
                  <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        {activeSpace.name}
                        <Link href={`/products?space=${activeSpace.slug}`} className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1 group/link">
                          Browse All <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" />
                        </Link>
                      </h2>
                      <p className="text-slate-500 text-sm mt-1">{activeSpace.description || `Explore our ${activeSpace.name} collection`}</p>
                    </div>
                  </div>

                  {/* Grid Layout */}
                  <div className="grid grid-cols-12 gap-8 h-full">

                    {/* Subcategories Column */}
                    <div className="col-span-5 space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">Categories</h3>
                      {activeSpace.subcategories && activeSpace.subcategories.length > 0 ? (
                        activeSpace.subcategories.map(sub => (
                          <Link
                            key={sub.id}
                            href={`/products?space=${activeSpace.slug}&subcategory=${sub.slug}`}
                            onMouseEnter={() => setActiveSubcategorySlug(sub.slug)}
                            className={`group flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${activeSubcategorySlug === sub.slug
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
                              }`}
                          >
                            <span className={`font-medium ${activeSubcategorySlug === sub.slug ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>
                              {sub.name}
                            </span>
                            <ChevronDown className={`h-4 w-4 transition-all duration-200 ${activeSubcategorySlug === sub.slug ? 'text-blue-600 -rotate-90 opacity-100' : 'text-slate-300 opacity-0 group-hover:opacity-100 -rotate-90'}`} />
                          </Link>
                        ))
                      ) : (
                        <div className="text-slate-400 text-sm italic py-4">No categories found.</div>
                      )}
                    </div>

                    {/* Types Column (Dynamic) */}
                    <div className="col-span-7 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
                      {activeSubcategory ? (
                        <div className="animate-in fade-in slide-in-from-left-2 duration-200">
                          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-4">
                            <span className="text-blue-600">types of</span> {activeSubcategory.name}
                          </h3>
                          {activeTypes && activeTypes.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                              {activeTypes.map((type, idx) => (
                                <Link
                                  key={idx}
                                  href={`/products?search=${encodeURIComponent(type)}`}
                                  className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 transition-all"
                                >
                                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-blue-500"></div>
                                  {type}
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-slate-500">
                              Browse all {activeSubcategory.name.toLowerCase()}.
                              <br />
                              <Link href={`/products?space=${activeSpace.slug}&subcategory=${activeSubcategory.slug}`} className="text-blue-600 hover:underline mt-2 inline-block">
                                View Collection &rarr;
                              </Link>
                            </div>
                          )}

                          {/* Featured Image Placeholder for Subcategory? */}
                          {/* Editor's Pick section removed */}
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                          <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                            <Briefcase className="h-6 w-6 opacity-50" />
                          </div>
                          <p className="text-sm">Hover over a category<br />to see available types.</p>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shrink-0 flex justify-between items-center z-10">
            <div className="flex items-center gap-4 px-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Accepting Bulk Orders</span>
              </div>
              <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
              <span className="text-xs text-slate-500">Fast Delivery Nationwide</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/contact" className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-2">
                Get a Wholesale Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
              <ModeToggle />
            </div>
          </div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

function MobileMenu({ spaces, wishlistCount, isAuthenticated, onSignOut }: { spaces: Space[], wishlistCount: number, isAuthenticated: boolean, onSignOut: () => void }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden p-2 -ml-2">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] sm:w-[350px] p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg">Menu</h2>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                <Home className="h-5 w-5" /> Home
              </Link>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="spaces" className="border-none">
                  <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md hover:no-underline">
                    <span className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5" /> Shop by Space
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 pr-2 space-y-1">
                      {spaces.map(space => {
                        const Icon = getIconComponent(space.icon || 'Table') as any;
                        return (
                          <Accordion key={space.id} type="single" collapsible>
                            <AccordionItem value={space.id} className="border-none">
                              <AccordionTrigger className="px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md">
                                <span className="flex items-center gap-3">
                                  <Icon className="h-4 w-4" /> {space.name}
                                </span>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="pl-8 space-y-1 border-l-2 border-slate-100 dark:border-slate-800 ml-6 my-1">
                                  {space.subcategories?.map(sub => (
                                    <Link
                                      key={sub.id}
                                      href={`/products?space=${space.slug}&subcategory=${sub.slug}`}
                                      className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600"
                                    >
                                      {sub.name}
                                    </Link>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Link href="/products" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                <Archive className="h-5 w-5" /> Products
              </Link>
              <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                <Heart className="h-5 w-5" /> Wishlist
                {wishlistCount > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{wishlistCount}</span>}
              </Link>
            </nav>
          </div>

          <div className="p-4 border-t bg-slate-50 dark:bg-slate-900">
            {!isAuthenticated ? (
              <Link href="/auth/login">
                <Button className="w-full">Login / Sign Up</Button>
              </Link>
            ) : (
              <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={onSignOut}>
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CompanyMenu() {
  const [open, setOpen] = useState(false);

  return (
    <HoverCard.Root openDelay={150} closeDelay={200} onOpenChange={setOpen}>
      <HoverCard.Trigger asChild>
        <button
          className={`flex items-center space-x-1 px-4 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all rounded-md outline-none ${open ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm'}`}
        >
          <span>Company</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="z-50 w-48 bg-white dark:bg-slate-950 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 p-2 animate-in fade-in-0 zoom-in-95"
          sideOffset={10}
          align="start"
        >
          <div className="flex flex-col space-y-1">
            <Link href="/about" className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
              About Us
            </Link>
            <Link href="/blog" className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
              Blog
            </Link>
            <Link href="/e-catalogue" className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
              E-Catalogue
            </Link>
            <Link href="/contact" className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
              Contact
            </Link>
          </div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

function SearchInput() {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("q");
    if (query) {
      router.push(`/products?search=${encodeURIComponent(query.toString())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
      </div>
      <input
        type="text"
        name="q"
        placeholder="Search furniture..."
        className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm"
      />
    </form>
  );
}