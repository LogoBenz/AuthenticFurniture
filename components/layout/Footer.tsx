"use client";

import Link from "next/link";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Truck, 
  CreditCard, 
  Shield, 
  ShoppingCart, 
  Wrench, 
  Store, 
  ArrowUp,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/2348123456789', '_blank');
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Customer Service Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Customer Service</h3>
            <div className="space-y-3">
              <Link href="/contact" className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Phone className="w-4 h-4 mr-2" />
                Contact Us
              </Link>
              <Link href="/refund-policy" className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Shield className="w-4 h-4 mr-2" />
                Refund & Cancellation
              </Link>
              <Link href="/bank-accounts" className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <CreditCard className="w-4 h-4 mr-2" />
                Bank Accounts
              </Link>
              <Link href="/order-tracking" className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Order Tracking
              </Link>
              <Link href="/maintenance" className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Wrench className="w-4 h-4 mr-2" />
                Maintenance & Upkeep
              </Link>
              <Link href="/showrooms" className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Store className="w-4 h-4 mr-2" />
                Buy in Store
              </Link>
            </div>
          </div>

          {/* Delivery & Payment */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Delivery & Payment</h3>
            <div className="space-y-3">
              <Link href="/shipping" className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Truck className="w-4 h-4 mr-2" />
                Shipping & Delivery
              </Link>
              <Link href="/payment-options" className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <CreditCard className="w-4 h-4 mr-2" />
                Payment Options
              </Link>
              <Link href="/brands" className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Shield className="w-4 h-4 mr-2" />
                Our Brands
              </Link>
            </div>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Company</h3>
            {/* Desktop/Tablet: vertical stack */}
            <div className="hidden sm:flex sm:flex-col sm:space-y-3">
              <Link href="/about" className="text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link>
              <Link href="/careers" className="text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Careers</Link>
              <Link href="/faq" className="text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQ</Link>
              <Link href="/privacy-policy" className="text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link>
            </div>
            {/* Mobile: accordion */}
            <div className="sm:hidden">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none py-2 px-0 select-none">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Company Links</span>
                  <span className="ml-2 text-slate-500 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="mt-2 space-y-2 pl-1">
                  <Link href="/about" className="block text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400">About Us</Link>
                  <Link href="/careers" className="block text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400">Careers</Link>
                  <Link href="/faq" className="block text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400">FAQ</Link>
                  <Link href="/privacy-policy" className="block text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</Link>
                  <Link href="/terms" className="block text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</Link>
                </div>
              </details>
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 mr-2" />
                Lagos, Nigeria
              </div>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <Phone className="w-4 h-4 mr-2" />
                +234 812 345 6789
              </div>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <Mail className="w-4 h-4 mr-2" />
                info@authenticfurniture.ng
              </div>
              
              {/* Social Media */}
              <div className="pt-2">
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">Follow Us</p>
                <div className="flex space-x-2">
                  <a
                    href="https://facebook.com/authenticfurniture"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href="https://instagram.com/authenticfurniture"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://youtube.com/authenticfurniture"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Security Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Secure Payment</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Your payment information is protected with bank-level security</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-3 h-3 border-2 border-dashed border-slate-400 rounded-full"></div>
                  <span>Enter card details</span>
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-3 h-3 border-2 border-dashed border-slate-400 rounded-full"></div>
                  <span>Verify with OTP</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 border-2 border-dashed border-slate-400 rounded-full"></div>
                  <span>Payment confirmed</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded text-xs font-semibold">VISA</div>
                <div className="bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded text-xs font-semibold">MASTERCARD</div>
                <div className="bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded text-xs font-semibold">POS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Copyright */}
            <div className="text-sm text-slate-600 dark:text-slate-300 mb-4 lg:mb-0">
              <p>© {currentYear} Authentic Furniture. All rights reserved.</p>
              <p className="text-xs mt-1">Designed for Nigerian homes, offices & lounges</p>
            </div>

            {/* Contact Numbers */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-4 lg:mb-0">
              <div className="text-center">
                <div className="flex items-center justify-center text-red-600 font-bold text-sm">
                  <Phone className="w-4 h-4 mr-1" />
                  +234 812 345 6789
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Main Line</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center text-red-600 font-bold text-sm">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  +234 801 234 5678
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">WhatsApp Support</p>
              </div>
            </div>

            {/* Utility Buttons */}
            <div className="flex items-center space-x-2">
              {showScrollTop && (
                <Button
                  onClick={scrollToTop}
                  size="sm"
                  className="w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full p-0"
                  title="Scroll to top"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
              )}
              <Button
                onClick={openWhatsApp}
                size="sm"
                className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-full p-0"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}