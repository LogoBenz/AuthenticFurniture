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
  Store, 
  ArrowUp,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  ChevronUp,
  Info,
  HelpCircle,
  FileText,
  Landmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Us
              </Link>
              <Link href="/profile/orders" className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Order Tracking
              </Link>
              <Link href="/contact#store" className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
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
              <Link href="/about" className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Info className="w-4 h-4 mr-2"/>About Us</Link>
              <Link href="/careers" className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><FileText className="w-4 h-4 mr-2"/>Careers</Link>
              <Link href="/faq" className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><HelpCircle className="w-4 h-4 mr-2"/>FAQ</Link>
              <Link href="/privacy-policy" className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><FileText className="w-4 h-4 mr-2"/>Privacy Policy</Link>
              <Link href="/terms" className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Landmark className="w-4 h-4 mr-2"/>Terms of Service</Link>
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
              <div className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                <MapPin className="w-5 h-5 mr-3 text-slate-600 dark:text-slate-300 flex-shrink-0 mt-0.5" />
                <span>No. 22b, Sunny Bus Stop, Olojo Drive, Alaba International Market, Ojo, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <Phone className="w-5 h-5 mr-3 text-slate-600 dark:text-slate-300" />
                <a href="tel:+23490377725829" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  090377725829
                </a>
              </div>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <Mail className="w-5 h-5 mr-3 text-slate-600 dark:text-slate-300" />
                <a href="mailto:authenticfurnituresltd@gmail.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  authenticfurnituresltd@gmail.com
                </a>
              </div>
              
              {/* Social Media */}
              <div className="pt-2">
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">Follow Us</p>
                <div className="flex space-x-3 text-slate-600 dark:text-slate-300">
                  <a href="https://facebook.com/authenticfurniture" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-600">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="https://instagram.com/authenticfurniture" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-600">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="https://twitter.com/authenticfurni" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-sky-500">
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 mb-8 border border-slate-200 dark:border-slate-600">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Secure Payment Options
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Your payment information is protected with bank-level security</p>
            </div>
            
            {/* Payment Methods Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="text-2xl mb-1">🏦</div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Bank Transfer</div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="text-2xl mb-1">💳</div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300">POS Payment</div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="text-2xl mb-1">💵</div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Cash on Delivery</div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="text-2xl mb-1">📱</div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Mobile Money</div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="text-2xl mb-1">🔒</div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Secure Online</div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="text-2xl mb-1">⚡</div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Instant Pay</div>
                </div>
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
                <div className="flex items-center justify-center text-blue-600 font-bold text-sm">
                  <Phone className="w-4 h-4 mr-1" />
                  090377725829
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Main Line</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center text-green-600 font-bold text-sm">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  WhatsApp Support
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Quick Response</p>
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
