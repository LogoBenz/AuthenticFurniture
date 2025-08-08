import Link from "next/link";
import { Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { AdminAccess } from "@/components/ui/admin-access";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Authentic Furniture</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Imported from China. Designed for Nigerian homes, lounges & offices.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/authenticfurn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://instagram.com/authenticfurniture"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} className="sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors text-sm sm:text-base"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors text-sm sm:text-base"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors text-sm sm:text-base"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors text-sm sm:text-base"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Store Information</h3>
            
            {/* Lagos Store */}
            <div className="mb-4 sm:mb-6">
              <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 text-slate-900 dark:text-slate-100">Lagos:</h4>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-start">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Victoria Island, Lagos State</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                  <a
                    href="tel:+2348012345678"
                    className="text-xs sm:text-sm hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                  >
                    +2348012345678
                  </a>
                </div>
              </div>
            </div>

            {/* Abuja Store */}
            <div className="mb-4 sm:mb-6">
              <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 text-slate-900 dark:text-slate-100">Abuja:</h4>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-start">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Garki District, FCT Abuja</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                  <a
                    href="tel:+2348023456789"
                    className="text-xs sm:text-sm hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                  >
                    +2348023456789
                  </a>
                </div>
              </div>
            </div>

            {/* General Contact */}
            <div>
              <div className="flex items-center mb-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                <a
                  href="mailto:info@authenticfurniture.ng"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                >
                  info@authenticfurniture.ng
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-muted-foreground">
            <p>© {currentYear} Authentic Furniture. All rights reserved.</p>
            <div className="mt-2 sm:mt-0">
              <AdminAccess variant="subtle" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}