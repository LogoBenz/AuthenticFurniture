"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Static images for right cards
const mainHeroImages = [
  "promoHero/gamingChairsHero.png",
  "promoHero/newOfficeC.png"
];

const topRightImage = "promoHero/officeTableHero.png";
const bottomRightImage = "promoHero/sideStudentC.png";

export function Hero() {
  // State for main hero slideshow only
  const [mainCurrentImageIndex, setMainCurrentImageIndex] = useState(0);

  // Auto-rotate main hero images only
  useEffect(() => {
    const interval = setInterval(() => {
      setMainCurrentImageIndex((prev) => (prev + 1) % mainHeroImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-2 pb-8 sm:pb-12 lg:pb-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        {/* Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 max-w-7xl mx-auto">

          {/* Left Main Card - Responsive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-lg w-full lg:w-[65%] aspect-[16/9] lg:aspect-[883/500]"
          >
            {/* Background Image Slideshow */}
            <div className="absolute inset-0">
              <img
                src={mainHeroImages[mainCurrentImageIndex]}
                alt="Modern Nigerian Living Room Furniture"
                className="w-full h-full object-cover object-center transition-opacity duration-500"
              />
            </div>

            {/* Dot Counter - Bottom Left Corner */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 flex items-center gap-2">
              {mainHeroImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === mainCurrentImageIndex
                      ? 'bg-white shadow-lg'
                      : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Right Column - Two cards responsive */}
          <div className="flex flex-col gap-4 w-full lg:w-[35%]">
            {/* Top Right Card - Responsive */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative overflow-hidden rounded-lg w-full aspect-[16/9] lg:aspect-[429/240]"
            >
              <img
                src={topRightImage}
                alt="Office Furniture"
                className="w-full h-full object-cover object-center"
              />
            </motion.div>

            {/* Bottom Right Card - Responsive */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative overflow-hidden rounded-lg w-full aspect-[16/9] lg:aspect-[429/240]"
            >
              <img
                src={bottomRightImage}
                alt="Student Furniture"
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
