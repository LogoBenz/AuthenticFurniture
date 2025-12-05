"use client";

import Link from "next/link";
import { useState, useEffect, useRef, createContext, useContext, useCallback } from "react";
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
  LogOut,
  Briefcase,
  Home,
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

function CustomSearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" fill="currentColor" {...props}>
      <path d="M10 .188A9.812 9.812 0 0 0 .187 10A9.812 9.812 0 0 0 10 19.813c2.29 0 4.393-.811 6.063-2.125l.875.875a1.845 1.845 0 0 0 .343 2.156l4.594 4.625c.713.714 1.88.714 2.594 0l.875-.875a1.84 1.84 0 0 0 0-2.594l-4.625-4.594a1.824 1.824 0 0 0-2.157-.312l-.875-.875A9.812 9.812 0 0 0 10 .188zM10 2a8 8 0 1 1 0 16a8 8 0 0 1 0-16zM4.937 7.469a5.446 5.446 0 0 0-.812 2.875a5.46 5.46 0 0 0 5.469 5.469a5.516 5.516 0 0 0 3.156-1a7.166 7.166 0 0 1-.75.03a7.045 7.045 0 0 1-7.063-7.062c0-.104-.005-.208 0-.312z" />
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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollY.current = currentScrollY;
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
        className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm top-0" : "bg-transparent top-10"
          } ${isHidden && isScrolled ? '-translate-y-full' : 'translate-y-0'}`}
        style={{ top: isHidden ? '0' : (isScrolled ? '0' : '40px') }}
      >
        <div className={`container mx-auto px-4 ${isScrolled ? 'py-2' : 'py-4'}`}>
          <div className="flex items-center justify-between">
            {/* Logo & Mobile Menu */}
            <div className="flex items-center gap-4">
              <MobileMenu spaces={spaces} wishlistCount={wishlistCount} isAuthenticated={isAuthenticated} onSignOut={handleSignOut} />

              <Link href="/" ref={logoRef} className="flex items-center">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tighter whitespace-nowrap">
                  Authentic <span className="text-blue-800 dark:text-blue-500">Furniture</span>
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <ShopBySpaceMenu spaces={spaces} />
              <NavLink href="/products">Products</NavLink>
              <NavLink href="/blog">Blog</NavLink>
              <NavLink href="/e-catalogue">E-Catalogue</NavLink>
              <NavLink href="/showroom">Showroom</NavLink>
              <NavLink href="/about">About Us</NavLink>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => setIsSearchModalOpen(true)}>
                <CustomSearchIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => router.push(isAuthenticated ? '/profile' : '/auth/login')}>
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsCartModalOpen(true)} className="relative">
                <CartIndicator />
              </Button>
              <ModeToggle />
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

function ShopBySpaceMenu({ spaces }: { spaces: Space[] }) {
  const [open, setOpen] = useState(false);

  return (
    <HoverCard.Root openDelay={150} closeDelay={200} onOpenChange={setOpen}>
      <HoverCard.Trigger asChild>
        <button
          className={`flex items-center space-x-1 text-sm font-medium hover:text-blue-800 dark:hover:text-blue-400 transition-colors outline-none ${open ? 'text-blue-800 dark:text-blue-400' : ''}`}
        >
          <span>Shop by Space</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="z-50 w-[600px] bg-white dark:bg-slate-950 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 p-6 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2"
          sideOffset={10}
          align="center"
        >
          <div className="grid grid-cols-2 gap-6">
            {spaces.map(space => {
              const Icon = getIconComponent(space.icon || 'Table');
              return (
                <div key={space.id} className="space-y-3">
                  <Link href={`/products?space=${space.slug}`} className="flex items-center gap-2 group">
                    <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-md group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                      <Icon className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{space.name}</div>
                      <div className="text-xs text-slate-500">{space.subcategories?.length || 0} Categories</div>
                    </div>
                  </Link>
                  <div className="pl-11 space-y-1">
                    {space.subcategories?.slice(0, 4).map(sub => (
                      <Link
                        key={sub.id}
                        href={`/products?space=${space.slug}&subcategory=${sub.slug}`}
                        className="block text-sm text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                    {(space.subcategories?.length || 0) > 4 && (
                      <Link href={`/products?space=${space.slug}`} className="block text-xs text-blue-600 font-medium hover:underline">
                        View all
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 -mx-6 -mb-6 p-4">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Need help designing your space?
            </div>
            <Link href="/contact" className="text-sm font-semibold text-blue-700 hover:underline">
              Book a Consultation &rarr;
            </Link>
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
                        const Icon = getIconComponent(space.icon || 'Table');
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