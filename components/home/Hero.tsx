"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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

  const changeSlide = (newIndex: number, direction: 'next' | 'prev') => {
    setMainCurrentImageIndex(newIndex);
  };

  // Auto-rotate main hero images with smooth sliding
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (mainCurrentImageIndex + 1) % mainHeroImages.length;
      changeSlide(nextIndex, 'next');
    }, 5000);

    return () => clearInterval(interval);
  }, [mainCurrentImageIndex]);

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
            {/* Background Image Carousel with Framer Motion */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mainCurrentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={`/${mainHeroImages[mainCurrentImageIndex].src}`}
                    alt="Modern Nigerian Furniture Collection"
                    fill
                    className={`object-cover ${mainHeroImages[mainCurrentImageIndex].align}`}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 883px, 883px"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dot Counter - Bottom Left Corner */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 flex items-center gap-2 z-10">
              {mainHeroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const direction = index > mainCurrentImageIndex ? 'next' : 'prev';
                    changeSlide(index, direction);
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
              <Image
                src={`/${topRightImage}`}
                alt="Office Furniture"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 429px, 429px"
              />
            </motion.div>

            {/* Bottom Right Card - NextUI Style - 429x240 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative overflow-hidden rounded-xl transition-all duration-300 w-full aspect-[3/2] sm:aspect-[16/9] lg:aspect-[429/240]"
            >
              <Image
                src={`/${bottomRightImage}`}
                alt="Student Furniture"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 429px, 429px"
              />
            </motion.div>
          </div >
        </div >
      </div >
    </section >
  );
}
