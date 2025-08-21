"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sofa, Home, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        {/* Mobile-First Hero Layout */}
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-10 lg:grid-rows-2 lg:gap-6 max-w-7xl mx-auto">
          {/* Main Hero Card - Full width on mobile */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 lg:row-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-blue-700 to-blue-800 min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80"
                alt="Modern Nigerian Living Room Furniture"
                className="w-full h-full object-cover object-center opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
            </div>
            {/* Content */}
            <div className="relative p-6 sm:p-8 lg:p-12 flex flex-col justify-between h-full">
              <div className="text-white">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Sofa className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-blue-200 font-semibold text-sm">Living Room</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 leading-tight">
                  Authentic Furniture for Nigerian Homes
                </h1>
                <p className="text-blue-100 text-base sm:text-lg mb-6 lg:mb-8 max-w-md">
                  Discover sofas, sectionals, and lounge sets designed for comfort, style, and durability—perfect for your home and family gatherings.
                </p>
                <Button 
                  asChild
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 sm:px-8 shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
                >
                  <Link href="/products?category=living-room">
                    Shop Living Room
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              {/* Product Image Overlay - Hidden on mobile */}
              <div className="relative lg:ml-8 hidden lg:block">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
                  alt="Sofa Set"
                  className="w-64 h-48 lg:w-80 lg:h-60 object-cover rounded-xl border-4 border-white/20 shadow-lg"
                />
              </div>
            </div>
            {/* Brand/Tagline */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-900 font-bold text-sm">AF</span>
              </div>
              <span className="text-white font-bold text-sm hidden sm:inline">AFRIFURNITURE</span>
            </div>
          </motion.div>

          {/* Category Cards - Stack on mobile */}
          <div className="lg:col-span-4 space-y-4 lg:space-y-0 lg:grid lg:grid-rows-2 lg:gap-4">
            {/* Home Office Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 min-h-[200px] sm:min-h-[250px]"
            >
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80"
                  alt="Home Office Furniture"
                  className="w-full h-full object-cover object-center opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              <div className="relative p-4 sm:p-6 h-full flex flex-col justify-between">
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                  </div>
                  <h3 className="text-white font-semibold text-base sm:text-lg mb-2">Home Office</h3>
                  <p className="text-blue-100 text-xs sm:text-sm">Desks, chairs & storage for productive workspaces</p>
                </div>
                <Button 
                  asChild
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-full text-sm"
                >
                  <Link href="/products?category=office">
                    Shop Office
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Bedroom Sets Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 min-h-[200px] sm:min-h-[250px]"
            >
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=600&q=80"
                  alt="Bedroom Furniture"
                  className="w-full h-full object-cover object-center opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>
              <div className="relative p-4 sm:p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-blue-600 text-xs font-semibold">New</span>
                  </div>
                  <h3 className="text-slate-900 dark:text-white font-bold text-base sm:text-lg mb-1 flex items-center gap-1">
                    <Home className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    Bedroom Sets
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mb-4">
                    Beds, wardrobes & nightstands for restful nights
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-blue-700 font-bold text-xs sm:text-sm">COMFORT</span>
                  </div>
                  <Button 
                    asChild
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0"
                  >
                    <Link href="/products?category=bedroom">
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Popular Categories heading removed to avoid duplication; section is rendered by components/home/Categories */}
      </div>
    </section>
  );
}