"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center">
      {/* Background Image with Enhanced Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/3705539/pexels-photo-3705539.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
          backgroundPosition: "center"
        }}
      >
        {/* Enhanced Dark Overlay for Better Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/60 dark:from-black/80 dark:via-black/60 dark:to-black/70"></div>
        
        {/* Additional Gradient Overlay for Text Area */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          {/* Enhanced Text Container with Background */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl"
                style={{ 
                  textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8), 1px 1px 3px rgba(0, 0, 0, 0.9)' 
                }}>
              Authentic Furniture for Modern Spaces
            </h1>
            <p className="text-xl text-white/95 mb-8 max-w-2xl font-medium"
               style={{ 
                 textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7), 1px 1px 2px rgba(0, 0, 0, 0.8)' 
               }}>
              Imported from China. Designed for Nigerian homes, lounges & offices.
              Premium quality for discerning clients.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                asChild
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-500"
              >
                <Link href="/products">
                  Browse Products
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg" 
                className="bg-white/15 backdrop-blur-sm border-white/30 text-white hover:bg-white/25 hover:border-white/40 rounded-md px-8 shadow-xl transition-all duration-300"
                style={{ 
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' 
                }}
              >
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}