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
    <section className="relative pt-4 sm:pt-6 pb-4 sm:pb-6 bg-white dark:bg-slate-900">
      {/* Full width - no container */}
      <div className="w-full">
        {/* Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-4 w-full max-w-[1320px] mx-auto px-4">

          {/* Left Main Card - NextUI Style - 883x500 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-xl transition-all duration-300 flex-shrink-0"
            style={{ aspectRatio: '883/500', width: '883px', maxWidth: '100%' }}
          >
            {/* Background Image Slideshow */}
            <div className="absolute inset-0">
              <img
                src={mainHeroImages[mainCurrentImageIndex]}
                alt="Modern Nigerian Living Room Furniture"
                className="w-full h-full object-contain transition-opacity duration-500"
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
          <div className="flex flex-col gap-4 flex-shrink-0">
            {/* Top Right Card - NextUI Style - 429x240 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative overflow-hidden rounded-xl transition-all duration-300"
              style={{ aspectRatio: '429/240', width: '429px', maxWidth: '100%' }}
            >
              <img
                src={topRightImage}
                alt="Office Furniture"
                className="w-full h-full object-cover object-center"
              />
            </motion.div>

            {/* Bottom Right Card - NextUI Style - 429x240 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative overflow-hidden rounded-xl transition-all duration-300"
              style={{ aspectRatio: '429/240', width: '429px', maxWidth: '100%' }}
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
