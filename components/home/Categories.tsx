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
import { HorizontalProductRow } from "@/components/products/HorizontalProductRow";
import { FeaturedDealsGrid } from "@/components/products/FeaturedDealsGrid";
import { getPromoProducts, getBestSellers, getFeaturedDeals } from "@/lib/products";
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

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 text-center">
          Shop by Categories
        </h2>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto text-lg">
          Discover our carefully curated furniture collections designed for every space and style
        </p>

        {/* Horizontal sliding carousel for all devices */}
        <div className="w-full">
          <div className="flex justify-start px-4">
            <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 max-w-full">
              {orderedSubcategories.map((subcategory) => {
                const IconComponent = getIconComponent(subcategory.icon || 'Table');
                return (
                  <Link
                    href={`/products?subcategory=${subcategory.slug}`}
                    key={subcategory.id}
                    className="flex-shrink-0 group flex flex-col items-center p-4 rounded-xl bg-white border-2 border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 min-w-[140px] hover:scale-105"
                  >
                    <div className="w-14 h-14 mb-3 flex items-center justify-center rounded-full bg-slate-50 group-hover:bg-blue-50 transition-colors duration-300">
                      <IconComponent className="w-7 h-7 text-slate-700 group-hover:text-blue-600 transition-colors duration-300 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-sm font-semibold text-center text-slate-900 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                      {subcategory.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Deals Grid - replaces Promo Products with 2+4 layout */}
      <FeaturedDealsGrid title="Deals of the Week" fetcher={getFeaturedDeals} />

      {/* Best Sellers - keeps original horizontal layout */}
      <HorizontalProductRow title="Best Sellers" fetcher={getBestSellers} />
    </section>
  );
}
