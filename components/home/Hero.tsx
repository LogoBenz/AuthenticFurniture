"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sofa, Home, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        {/* Two-column layout: Large hero card on left, smaller cards on right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Large Hero Card - Left side */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-blue-700 to-blue-800 min-h-[400px] sm:min-h-[500px] lg:h-auto"
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
              
              {/* Product Image Overlay - Bottom left */}
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

          {/* Right Column - Two smaller cards stacked */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Living Room Card - Top */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 aspect-[4/3]"
            >
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80"
                  alt="Living Room Furniture"
                  className="w-full h-full object-cover object-center opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              <div className="relative p-4 h-full flex flex-col justify-between">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Sofa className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">Living Room</h3>
                  <p className="text-blue-100 text-xs">Comfortable sofas, coffee tables & entertainment units</p>
                </div>
                <Button 
                  asChild
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-full text-xs"
                >
                  <Link href="/products?category=living-room">
                    Shop Living Room
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Home Office Card - Bottom */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 aspect-[4/3]"
            >
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80"
                  alt="Home Office Furniture"
                  className="w-full h-full object-cover object-center opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              <div className="relative p-4 h-full flex flex-col justify-between">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">Home Office</h3>
                  <p className="text-blue-100 text-xs">Desks, chairs & storage for productive workspaces</p>
                </div>
                <Button 
                  asChild
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-full text-xs"
                >
                  <Link href="/products?category=office">
                    Shop Office
                  </Link>
                </Button>
              </div>
            </motion.div>


          </div>
        </div>
      </div>
    </section>
  );
}