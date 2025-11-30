"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Main hero carousel images with specific alignment
const mainHeroImages = [
  { src: "promoHero/gamingChairsHero.png", align: "object-left" },
  { src: "promoHero/newOfficeC.png", align: "object-left" },
  { src: "promoHero/HomeHero.png", align: "object-center" },
  { src: "promoHero/officeT.png", align: "object-left" }
];

const topRightImage = "promoHero/officeTableHero.png";
const bottomRightImage = "promoHero/sideStudentC.png";

export function Hero() {
  // State for main hero slideshow
  const [mainCurrentImageIndex, setMainCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  // Auto-rotate main hero images with smooth sliding
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setMainCurrentImageIndex((prev) => (prev + 1) % mainHeroImages.length);
    }, 5000); // Changed to 5 seconds for better viewing

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-4 pb-4 sm:pb-6 bg-white dark:bg-slate-900">
      {/* Full width - no container */}
      <div className="w-full">
        {/* Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-4 w-full max-w-[1320px] mx-auto px-2 sm:px-4 items-center justify-center">

          {/* Left Main Card - NextUI Style - 883x500 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-xl transition-all duration-300 flex-shrink-0 w-full lg:w-[883px] aspect-[4/3] sm:aspect-[16/9] lg:aspect-[883/500]"
          >
            {/* Background Image Carousel with Smooth Sliding - No Fade */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.img
                  key={mainCurrentImageIndex}
                  src={mainHeroImages[mainCurrentImageIndex].src}
                  alt="Modern Nigerian Furniture Collection"
                  className={`absolute w-full h-full object-cover ${mainHeroImages[mainCurrentImageIndex].align}`}
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                />
              </AnimatePresence>
            </div>

            {/* Dot Counter - Bottom Left Corner */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 flex items-center gap-2 z-10">
              {mainHeroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > mainCurrentImageIndex ? 1 : -1);
                    setMainCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-125 ${index === mainCurrentImageIndex
                    ? 'bg-white shadow-lg w-6'
                    : 'bg-white/40 hover:bg-white/60'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Right Column - Two cards responsive */}
          <div className="flex flex-col gap-4 flex-shrink-0 w-full lg:w-[429px]">
            {/* Top Right Card - NextUI Style - 429x240 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative overflow-hidden rounded-xl transition-all duration-300 w-full aspect-[3/2] sm:aspect-[16/9] lg:aspect-[429/240]"
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
              className="relative overflow-hidden rounded-xl transition-all duration-300 w-full aspect-[3/2] sm:aspect-[16/9] lg:aspect-[429/240]"
            >
              <img
                src={bottomRightImage}
                alt="Student Furniture"
                className="w-full h-full object-cover object-center"
              />
            </motion.div >
          </div >
        </div >
      </div >
    </section >
  );
}
