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

const topRightImage = "promoHero/officeDealsRevamp.png";
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
    <section className="relative pb-4 sm:pb-6 bg-white dark:bg-slate-900">
      {/* Full width - no container */}
      <div className="w-full">
        {/* Responsive Layout: Flex Column for Top/Bottom structure */}
        <div className="flex flex-col gap-4 w-full">

          {/* Top Main Card - Full Width Edge to Edge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden transition-all duration-300 w-full h-[650px] sm:h-auto sm:aspect-[16/9] lg:aspect-[21/9]"
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
                    sizes="100vw"
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

          {/* Bottom Row - 3 Cards (2 on Mobile) - Contained */}
          <div className="w-[95%] mx-auto px-2 sm:px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {/* Card 1: Office Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative overflow-hidden rounded-xl transition-all duration-300 w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-[16/9]"
              >
                <Image
                  src={`/${topRightImage}`}
                  alt="Office Furniture"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </motion.div>

              {/* Card 2: Refer and Earn (New) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative overflow-hidden rounded-xl transition-all duration-300 w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-[16/9]"
              >
                <Image
                  src="/promoHero/referAndEarn.png"
                  alt="Refer and Earn"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </motion.div>

              {/* Card 3: Student Chair (Hidden on Mobile) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative overflow-hidden rounded-xl transition-all duration-300 w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-[16/9] hidden lg:block"
              >
                <Image
                  src={`/${bottomRightImage}`}
                  alt="Student Furniture"
                  fill
                  className="object-cover object-center"
                  sizes="33vw"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
