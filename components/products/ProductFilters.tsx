"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  spaces?: Array<{ id: string; name: string; slug: string; subcategories?: Array<{ id: string; name: string; slug: string }> }>;
  totalProducts?: number;
  isAdmin?: boolean;
}

export function ProductFilters({ spaces = [], totalProducts = 0, isAdmin = false }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read current filters from searchParams
  const currentSort = searchParams.get('sort') || 'newest';
  const currentMinPrice = parseInt(searchParams.get('price_min') || '0');
  const currentMaxPrice = parseInt(searchParams.get('price_max') || '1000000');
  const currentSpace = searchParams.get('space') || '';
  const currentSubcategory = searchParams.get('subcategory') || '';
  const currentAvailability = searchParams.get('availability')?.split(',').filter(Boolean) || [];

  // Local state for UI interactions (price slider)
  const [priceRange, setPriceRange] = useState<[number, number]>([currentMinPrice, currentMaxPrice]);

  // Update URL parameters function - preserves existing filters
  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset to page 1 when filters change
    params.set('page', '1');

    // Navigate to updated URL
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const handleSpaceChange = (spaceSlug: string, checked: boolean) => {
    if (checked) {
      updateFilters({
        space: spaceSlug,
        subcategory: null
      });
    } else {
      updateFilters({ space: null });
    }
  };

  const handleSubcategoryChange = (subcategorySlug: string, checked: boolean) => {
    updateFilters({
      subcategory: checked ? subcategorySlug : null
    });
  };

  const handleAvailabilityChange = (value: string, checked: boolean) => {
    const newAvailability = checked
      ? [...currentAvailability, value]
      : currentAvailability.filter(a => a !== value);

    updateFilters({
      availability: newAvailability.length > 0 ? newAvailability.join(',') : null
    });
  };

  const handleSortChange = (value: string) => {
    updateFilters({
      sort: value !== 'newest' ? value : null
    });
  };

  const handlePriceRangeApply = () => {
    updateFilters({
      price_min: priceRange[0] > 0 ? priceRange[0].toString() : null,
      price_max: priceRange[1] < 1000000 ? priceRange[1].toString() : null
    });
  };

  const clearAllFilters = () => {
    router.push('/products?page=1', { scroll: false });
    setPriceRange([0, 1000000]);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (currentSort !== 'newest') count++;
    if (currentMinPrice > 0 || currentMaxPrice < 1000000) count++;
    if (currentSpace) count++;
    if (currentSubcategory) count++;
    if (currentAvailability.length > 0) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center gap-2 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide w-[calc(100%+2rem)] sm:w-full">

        {/* Filter Group */}
        <div className="flex flex-row items-center gap-2 flex-shrink-0 order-2 sm:order-1">
          {/* Space Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 rounded-lg px-4 text-sm font-medium transition-colors border whitespace-nowrap",
                  currentSpace
                    ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800 hover:text-white"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                Space
                <ChevronDown className={cn("ml-2 h-4 w-4 transition-transform", currentSpace && "text-white")} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Filter by Space</h4>
                  <p className="text-sm text-muted-foreground">Select a space to view.</p>
                </div>
                <div className="space-y-2">
                  {spaces.map((space) => (
                    <div key={space.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`space-${space.slug}`}
                        checked={currentSpace === space.slug}
                        onCheckedChange={(checked) =>
                          handleSpaceChange(space.slug, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`space-${space.slug}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {space.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Category Filter (Only if Space is selected) */}
          {currentSpace && spaces.find(s => s.slug === currentSpace)?.subcategories && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-9 rounded-lg px-4 text-sm font-medium transition-colors border whitespace-nowrap",
                    currentSubcategory
                      ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800 hover:text-white"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  Category
                  <ChevronDown className={cn("ml-2 h-4 w-4 transition-transform", currentSubcategory && "text-white")} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Category</h4>
                    <p className="text-sm text-muted-foreground">Select a category.</p>
                  </div>
                  <div className="space-y-2">
                    {spaces
                      .find(s => s.slug === currentSpace)
                      ?.subcategories?.map((subcategory) => (
                        <div key={subcategory.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`subcategory-${subcategory.slug}`}
                            checked={currentSubcategory === subcategory.slug}
                            onCheckedChange={(checked) =>
                              handleSubcategoryChange(subcategory.slug, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={`subcategory-${subcategory.slug}`}
                            className="text-sm cursor-pointer flex-1"
                          >
                            {subcategory.name}
                          </Label>
                        </div>
                      ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Price Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 rounded-lg px-4 text-sm font-medium transition-colors border whitespace-nowrap",
                  (currentMinPrice > 0 || currentMaxPrice < 1000000)
                    ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800 hover:text-white"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                Price
                <ChevronDown className={cn("ml-2 h-4 w-4 transition-transform", (currentMinPrice > 0 || currentMaxPrice < 1000000) && "text-white")} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-4" align="start">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Price Range</h4>
                  <p className="text-sm text-muted-foreground">Adjust the price range.</p>
                </div>
                <div className="pt-4">
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    max={1000000}
                    min={0}
                    step={10000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-4">
                    <span>₦{priceRange[0].toLocaleString()}</span>
                    <span>₦{priceRange[1].toLocaleString()}</span>
                  </div>
                  <Button
                    onClick={handlePriceRangeApply}
                    size="sm"
                    className="w-full mt-4"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Availability Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 rounded-lg px-4 text-sm font-medium transition-colors border whitespace-nowrap",
                  currentAvailability.length > 0
                    ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800 hover:text-white"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                Availability
                <ChevronDown className={cn("ml-2 h-4 w-4 transition-transform", currentAvailability.length > 0 && "text-white")} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Availability</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="in-stock"
                      checked={currentAvailability.includes('in_stock')}
                      onCheckedChange={(checked) =>
                        handleAvailabilityChange('in_stock', checked as boolean)
                      }
                    />
                    <Label htmlFor="in-stock" className="text-sm cursor-pointer flex-1">
                      In Stock
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="out-of-stock"
                      checked={currentAvailability.includes('out_of_stock')}
                      onCheckedChange={(checked) =>
                        handleAvailabilityChange('out_of_stock', checked as boolean)
                      }
                    />
                    <Label htmlFor="out-of-stock" className="text-sm cursor-pointer flex-1">
                      Out of Stock
                    </Label>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {activeFiltersCount > 0 && (
            <Button
              variant="link"
              size="sm"
              onClick={clearAllFilters}
              className="h-9 px-3 text-slate-500 hover:text-slate-900 whitespace-nowrap"
            >
              Reset
            </Button>
          )}
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2 flex-shrink-0 order-1 sm:order-2 sm:ml-auto">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:inline">Sort:</span>
          <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="h-9 w-[140px] sm:w-[180px] rounded-lg border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="name_asc">Name: A to Z</SelectItem>
              <SelectItem value="name_desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>

          {/* Vertical Divider for Mobile */}
          <div className="h-6 w-px bg-slate-200 mx-1 sm:hidden" />
        </div>
      </div>
    </div>
  );
}
