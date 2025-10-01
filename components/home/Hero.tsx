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
        {/* Layout with exact pixel dimensions */}
        <div className="flex flex-col lg:flex-row gap-6 max-w-none mx-auto">

          {/* Left Main Card - 883 x 500 px */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-lg w-[883px] h-[500px]"
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
            <div className="absolute bottom-6 left-4 flex items-center gap-2">
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

          {/* Right Column - Two cards: 429 x 240 px each */}
          <div className="flex flex-col gap-4 w-[429px]">
            {/* Top Right Card - 429 x 240 px */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative overflow-hidden rounded-lg w-[429px] h-[240px]"
            >
              <img
                src={topRightImage}
                alt="Office Furniture"
                className="w-full h-full object-cover object-center"
              />
              {/* Ready for your GIF - just replace the img src with: */}
              {/* "promoHero/your-animation.gif" when you upload it */}
            </motion.div>

            {/* Bottom Right Card - 429 x 240 px */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative overflow-hidden rounded-lg w-[429px] h-[240px]"
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
