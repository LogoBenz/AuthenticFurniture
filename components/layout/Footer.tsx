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
  ChevronDown,
  Info,
  HelpCircle,
  FileText,
  Landmark,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

function FooterSection({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-800 md:border-none pb-4 md:pb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-lg font-bold text-white font-heading tracking-wide md:cursor-default md:mb-6"
      >
        {title}
        <ChevronDown className={`w-5 h-5 md:hidden transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`space-y-4 mt-4 md:mt-0 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 md:max-h-none md:opacity-100'}`}>
        {children}
      </div>
    </div>
  );
}

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
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 font-body">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">

          {/* Customer Service Links */}
          <FooterSection title="Customer Service">
            <Link href="/contact" className="flex items-center text-sm hover:text-blue-400 transition-colors group">
              <MessageCircle className="w-4 h-4 mr-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
              Contact Us
            </Link>
            <Link href="/profile/orders" className="flex items-center text-sm hover:text-blue-400 transition-colors group">
              <ShoppingCart className="w-4 h-4 mr-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
              Order Tracking
            </Link>
            <Link href="/contact#store" className="flex items-center text-sm hover:text-blue-400 transition-colors group">
              <Store className="w-4 h-4 mr-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
              Buy in Store
            </Link>
          </FooterSection>

          {/* Delivery & Payment */}
          <FooterSection title="Delivery & Payment">
            <Link href="/shipping" className="flex items-center text-sm hover:text-blue-400 transition-colors group">
              <Truck className="w-4 h-4 mr-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
              Shipping & Delivery
            </Link>
            <Link href="/payment-options" className="flex items-center text-sm hover:text-blue-400 transition-colors group">
              <CreditCard className="w-4 h-4 mr-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
              Payment Options
            </Link>
            <Link href="/brands" className="flex items-center text-sm hover:text-blue-400 transition-colors group">
              <Shield className="w-4 h-4 mr-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
              Our Brands
            </Link>
          </FooterSection>

          {/* Company Info */}
          <FooterSection title="Company">
            <Link href="/about" className="flex items-center text-sm hover:text-blue-400 transition-colors group">
              <Info className="w-4 h-4 mr-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
              About Us
            </Link>
            <Link href="/careers" className="flex items-center text-sm hover:text-blue-400 transition-colors group">
              <FileText className="w-4 h-4 mr-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
              Careers
            </Link>
            <Link href="/faq" className="flex items-center text-sm hover:text-blue-400 transition-colors group">
              <HelpCircle className="w-4 h-4 mr-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
              FAQ
            </Link>
            <Link href="/privacy-policy" className="flex items-center text-sm hover:text-blue-400 transition-colors group">
              <FileText className="w-4 h-4 mr-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
              Privacy Policy
            </Link>
            <Link href="/terms" className="flex items-center text-sm hover:text-blue-400 transition-colors group">
              <Landmark className="w-4 h-4 mr-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
              Terms of Service
            </Link>
          </FooterSection>

          {/* Contact & Social */}
          <FooterSection title="Get in Touch">
            <div className="space-y-5">
              <div className="flex items-start text-sm group">
                <MapPin className="w-4 h-4 mr-3 text-slate-500 flex-shrink-0 mt-0.5 group-hover:text-blue-400 transition-colors" />
                <span className="leading-relaxed group-hover:text-blue-400 transition-colors">No. 22b, Sunny Bus Stop, Olojo Drive, Alaba International Market, Ojo, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center text-sm group">
                <Phone className="w-4 h-4 mr-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
                <a href="tel:+23490377725829" className="hover:text-blue-400 transition-colors group-hover:text-blue-400">
                  090377725829
                </a>
              </div>
              <div className="flex items-center text-sm group">
                <Mail className="w-4 h-4 mr-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
                <a href="mailto:authenticfurnituresltd@gmail.com" className="hover:text-blue-400 transition-colors group-hover:text-blue-400">
                  authenticfurnituresltd@gmail.com
                </a>
              </div>

              {/* Social Media */}
              <div className="pt-4">
                <div className="flex space-x-4">
                  <a href="https://facebook.com/authenticfurniture" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="https://instagram.com/authenticfurniture" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-all duration-300">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="https://twitter.com/authenticfurni" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all duration-300">
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </FooterSection>
        </div>

        <div className="h-px bg-slate-800 my-10"></div>

        {/* Secure Payment Options - Redesigned */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-full">
              <Shield className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">Secure Payment Options</h4>
              <p className="text-xs text-slate-500">Protected with bank-level security</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {["Bank Transfer", "POS Payment", "Cash on Delivery", "Secure Online"].map((method) => (
              <div key={method} className="flex items-center gap-2 text-sm text-slate-400">
                <Check className="w-3 h-3 text-blue-500" />
                <span>{method}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-slate-900 text-xs text-slate-500">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p>© {currentYear} Authentic Furniture. All rights reserved.</p>
            <p className="mt-1">Designed for Nigerian homes, offices & lounges</p>
          </div>

          {/* Utility Buttons */}
          <div className="flex items-center space-x-3">
            {showScrollTop && (
              <Button
                onClick={scrollToTop}
                size="icon"
                className="bg-slate-800 hover:bg-blue-600 text-white rounded-full transition-all duration-300 shadow-lg"
                title="Scroll to top"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
            )}
            <Button
              onClick={openWhatsApp}
              size="icon"
              className="bg-green-600 hover:bg-green-700 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-green-500/20"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
