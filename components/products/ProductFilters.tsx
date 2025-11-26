"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

import { Badge } from "@/components/ui/badge";

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
  const [isExpanded, setIsExpanded] = useState(false);

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
      // Set space and clear subcategory when space changes
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
    // Navigate to products page without any filter params
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
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-sm"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-sm text-slate-600 dark:text-slate-400">
        {totalProducts} product{totalProducts !== 1 ? 's' : ''} found
      </div>

      <div className={`space-y-6 ${!isExpanded && 'hidden lg:block'}`}>
        {/* Sort By */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Sort By</Label>
          <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Date Added: Newest</SelectItem>
              <SelectItem value="oldest">Date Added: Oldest</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="name_asc">Name: A to Z</SelectItem>
              <SelectItem value="name_desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Price Range</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              max={1000000}
              min={0}
              step={10000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mt-2">
              <span>₦{priceRange[0].toLocaleString()}</span>
              <span>₦{priceRange[1].toLocaleString()}</span>
            </div>
            <Button
              onClick={handlePriceRangeApply}
              size="sm"
              className="w-full mt-2"
              variant="outline"
            >
              Apply Price Filter
            </Button>
          </div>
        </div>

        {/* Spaces */}
        {spaces.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Space</Label>
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
                    className="text-sm cursor-pointer"
                  >
                    {space.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subcategories */}
        {currentSpace && spaces.find(s => s.slug === currentSpace)?.subcategories && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Category</Label>
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
                      className="text-sm cursor-pointer"
                    >
                      {subcategory.name}
                    </Label>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Availability */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Availability</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={currentAvailability.includes('in_stock')}
                onCheckedChange={(checked) =>
                  handleAvailabilityChange('in_stock', checked as boolean)
                }
              />
              <Label htmlFor="in-stock" className="text-sm cursor-pointer">
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
              <Label htmlFor="out-of-stock" className="text-sm cursor-pointer">
                Out of Stock
              </Label>
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <Label className="text-sm font-medium mb-2 block">Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {currentSort !== 'newest' && (
                <Badge variant="outline" className="text-xs">
                  Sort: {currentSort.replace('_', ' ')}
                </Badge>
              )}
              {(currentMinPrice > 0 || currentMaxPrice < 1000000) && (
                <Badge variant="outline" className="text-xs">
                  ₦{currentMinPrice.toLocaleString()} - ₦{currentMaxPrice.toLocaleString()}
                </Badge>
              )}
              {currentSpace && (
                <Badge variant="outline" className="text-xs">
                  {spaces.find(s => s.slug === currentSpace)?.name}
                </Badge>
              )}
              {currentSubcategory && (
                <Badge variant="outline" className="text-xs">
                  {spaces
                    .find(s => s.slug === currentSpace)
                    ?.subcategories?.find(sub => sub.slug === currentSubcategory)?.name}
                </Badge>
              )}
              {currentAvailability.map(avail => (
                <Badge key={avail} variant="outline" className="text-xs">
                  {avail.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
