'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const testimonials = [
    {
      id: 1,
      name: "Oluwaseun Adebayo",
      role: "Office Manager, Lagos Tech Hub",
      content: "We furnished our entire office with Authentic Furniture. The quality is exceptional, and their team was professional throughout the process. Highly recommend for corporate spaces.",
      image: "/modern_office_workspace.png",
      avatar: "https://i.pravatar.cc/150?u=1",
      rating: 5
    },
    {
      id: 2,
      name: "Chioma Okonkwo",
      role: "Interior Designer",
      content: "As an interior designer, I've worked with many furniture suppliers. Authentic Furniture stands out for their attention to detail and quality control. My clients are always impressed.",
      image: "/stylish_lounge_area.png",
      avatar: "https://i.pravatar.cc/150?u=2",
      rating: 5
    },
    {
      id: 3,
      name: "Ibrahim Musa",
      role: "Hotel Owner",
      content: "We ordered custom reception furniture for our boutique hotel. The craftsmanship and finish exceeded our expectations. Will definitely work with them for our next expansion.",
      image: "/luxury_hotel_lobby.png",
      avatar: "https://i.pravatar.cc/150?u=3",
      rating: 5
    },
    {
      id: 4,
      name: "Ngozi Eze",
      role: "Homeowner",
      content: "The delivery was swift and the installation team was very polite. The sofa fits perfectly in my living room and is incredibly comfortable.",
      image: "/modern_living_room.png",
      avatar: "https://i.pravatar.cc/150?u=4",
      rating: 5
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div className="text-left mb-12">
          <span className="text-sm font-semibold tracking-wider text-amber-500 uppercase mb-2 block">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Our Client Reviews
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Buttons - Absolute positioned */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 hidden md:flex"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 hidden md:flex"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4 md:-ml-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_32%] min-w-0 pl-4 md:pl-6"
                >
                  <div className="relative h-[500px] rounded-2xl overflow-hidden group">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={testimonial.image}
                        alt="Project background"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* Content Card */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 relative shadow-xl">
                        <div className="text-center">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                            {testimonial.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">
                            {testimonial.role}
                          </p>

                          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 line-clamp-4">
                            "{testimonial.content}"
                          </p>

                          <div className="flex justify-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}