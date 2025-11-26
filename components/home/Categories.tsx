"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Sofa,
  Table,
  Armchair,
  GraduationCap,
  Bed,
  Archive,
  Home,
  Briefcase,
  Monitor,
  Users,
  Plus
} from "lucide-react";
import { FeaturedDealsGrid } from "@/components/products/FeaturedDealsGrid";
import { getFeaturedDeals } from "@/lib/products";
import { getAllSpaces } from "@/lib/categories";
import { Space, Subcategory } from "@/types";

export function Categories() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const spacesData = await getAllSpaces();
        setSpaces(spacesData);

        // Extract all subcategories from all spaces
        const allSubcategories = spacesData.flatMap(space => space.subcategories || []);
        setSubcategories(allSubcategories);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      'Home': Home,
      'Briefcase': Briefcase,
      'Sofa': Sofa,
      'Bed': Bed,
      'Archive': Archive,
      'Table': Table,
      'GraduationCap': GraduationCap,
      'Armchair': Armchair,
      'Monitor': Monitor,
      'Users': Users,
      'Plus': Plus,
    };
    return iconMap[iconName] || Table; // Default to Table icon
  };

  // Priority subcategories in order
  const getPrioritySubcategories = () => {
    const priorityNames = ['Office Tables', 'Student Chairs', 'Office Chairs', 'Complementary'];

    return subcategories
      .filter(sub => priorityNames.includes(sub.name))
      .sort((a, b) => {
        const aIndex = priorityNames.indexOf(a.name);
        const bIndex = priorityNames.indexOf(b.name);
        return aIndex - bIndex;
      });
  };

  // Get remaining subcategories (not in priority list)
  const getRemainingSubcategories = () => {
    const priorityNames = ['Office Tables', 'Student Chairs', 'Office Chairs', 'Complementary'];
    return subcategories.filter(sub => !priorityNames.includes(sub.name));
  };

  // Combine priority and remaining subcategories
  const getOrderedSubcategories = () => {
    const priority = getPrioritySubcategories();
    const remaining = getRemainingSubcategories();
    return [...priority, ...remaining];
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mr-3"></div>
            <span className="text-muted-foreground">Loading categories...</span>
          </div>
        </div>
      </section>
    );
  }

  const orderedSubcategories = getOrderedSubcategories();

  // Define popular categories with clean product images on white backgrounds
  const popularCategories = [
    { 
      name: 'Student Chairs', 
      slug: 'student-chairs', 
      image: '/catImg/student-chair.png',
      productCount: 8
    },
    { 
      name: 'Office Tables', 
      slug: 'office-tables', 
      image: '/catImg/oTable.png',
      productCount: 21
    },
    { 
      name: 'Complementory', 
      slug: 'complementory', 
      image: '/catImg/compCat.png',
      productCount: 0
    },
    { 
      name: 'Office Chairs', 
      slug: 'office-chairs', 
      image: '/catImg/oChair.png',
      productCount: 11
    },
    { 
      name: 'Sofa Sets', 
      slug: 'sofa-sets', 
      image: '/catImg/sofaCar.png',
      productCount: 30
    },
    { 
      name: 'Auditorium Chairs', 
      slug: 'auditorium-chairs', 
      image: '/catImg/AuditoriumCat.png',
      productCount: 0
    },
    { 
      name: 'Conference Table', 
      slug: 'conference-table', 
      image: '/catImg/cabinet.png',
      productCount: 0
    },
    { 
      name: 'Dining Sets', 
      slug: 'dining-sets', 
      image: '/catImg/patioCat.png',
      productCount: 0
    },
  ];

  return (
    <section className="pt-4 pb-8 sm:pt-6 sm:pb-10 bg-white">
      <div className="max-w-[85rem] mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-[28px] font-heading font-semibold text-slate-900 tracking-tight">
            Popular Categories
          </h2>
        </div>

        {/* Horizontal Sliding Carousel - One Row */}
        <div className="relative max-w-7xl mx-auto">
          {/* Scrollable Container */}
          <div className="overflow-x-auto scrollbar-hide pb-4">
            <div className="flex gap-6 px-2">
              {popularCategories.map((category) => {
                // Categories that need zoom out (padding)
                const needsZoomOut = ['complementory', 'office-chairs', 'auditorium-chairs', 'conference-table'].includes(category.slug);
                
                return (
                  <Link
                    href={`/products?subcategory=${category.slug}`}
                    key={category.slug}
                    className="group flex-shrink-0 w-[200px] sm:w-[220px]"
                  >
                    {/* Card with sharp corners */}
                    <div className="bg-white border border-slate-300 transition-all duration-300 ease-out hover:border-slate-500 hover:shadow-lg overflow-hidden">
                      {/* Pure White Image Container - Landscape */}
                      <div className={`relative aspect-[4/3] bg-white overflow-hidden ${needsZoomOut ? 'p-4' : ''}`}>
                        <img
                          src={category.image}
                          alt={category.name}
                          className={`w-full h-full transition-transform duration-500 ease-out group-hover:scale-110 ${needsZoomOut ? 'object-contain' : 'object-cover'}`}
                        />
                      </div>
                    
                    {/* Clean Text - Center Aligned */}
                    <div className="text-center px-3 py-2 border-t border-slate-100">
                      <h3 className="text-sm font-heading font-semibold text-slate-900 tracking-tight">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>
          </div>

          {/* Scroll Fade Indicators */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Spacer between Popular Categories and DOTW */}
      <div className="h-8"></div>

      {/* Featured Deals Grid - replaces Promo Products with 2+4 layout */}
      <FeaturedDealsGrid title="Deals of the Week" fetcher={getFeaturedDeals} />
    </section>
  );
}
