"use client";

import Link from "next/link";
import { 
  Sofa, 
  Table, 
  Armchair, 
  GraduationCap, 
  Bed, 
  Archive,
  Home,
  Briefcase
} from "lucide-react";
import { HorizontalProductRow } from "@/components/products/HorizontalProductRow";
import { getPromoProducts, getBestSellers } from "@/lib/products";

interface Category {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const categories: Category[] = [
  {
    name: "Office Chairs",
    icon: GraduationCap,
    href: "/products?category=office-chairs"
  },
  {
    name: "Sofas",
    icon: Sofa,
    href: "/products?category=sofas"
  },
  {
    name: "Cabinets",
    icon: Archive,
    href: "/products?category=cabinets"
  },
  {
    name: "Wardrobes",
    icon: Bed,
    href: "/products?category=wardrobes"
  },
  {
    name: "Tables",
    icon: Table,
    href: "/products?category=tables"
  },
  {
    name: "Armchairs",
    icon: Armchair,
    href: "/products?category=armchairs"
  }
];

export function Categories() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 text-center">
          Shop by Category
        </h2>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto text-lg">
          Discover our carefully curated furniture collections designed for every space and style
        </p>
        
        {/* Desktop: Centered grid layout */}
        <div className="hidden md:block">
          <div className="flex justify-center">
            <div className="grid grid-cols-6 gap-6 max-w-5xl">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Link 
                    href={category.href}
                    key={category.name}
                    className="group flex flex-col items-center p-6 rounded-2xl bg-white border-2 border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-slate-50 group-hover:bg-blue-50 transition-colors duration-300">
                      <IconComponent className="w-8 h-8 text-slate-700 group-hover:text-blue-600 transition-colors duration-300 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-sm font-semibold text-center text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                      {category.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile: Horizontal slider */}
        <div className="md:hidden">
          <div className="flex justify-center px-4">
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 max-w-full">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Link 
                    href={category.href}
                    key={category.name}
                    className="flex-shrink-0 group flex flex-col items-center p-4 rounded-xl bg-white border-2 border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 min-w-[120px]"
                  >
                    <div className="w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-slate-50 group-hover:bg-blue-50 transition-colors duration-300">
                      <IconComponent className="w-6 h-6 text-slate-700 group-hover:text-blue-600 transition-colors duration-300 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-xs font-semibold text-center text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                      {category.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal product rows */}
      <HorizontalProductRow title="Promo Products" fetcher={getPromoProducts} />
      <HorizontalProductRow title="Best Sellers" fetcher={getBestSellers} />
    </section>
  );
}