"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface ProductFiltersProps {
  spaces?: Array<{ id: string; name: string; slug: string; subcategories?: Array<{ id: string; name: string; slug: string }> }>;
  totalProducts?: number;
  isAdmin?: boolean;
}

export function ProductFilters({ spaces = [], totalProducts = 0, isAdmin = false }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter states
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(searchParams.get('minPrice') || '0'),
    parseInt(searchParams.get('maxPrice') || '10000')
  ]);
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>(
    searchParams.get('space') ? [searchParams.get('space')!] : []
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    searchParams.get('subcategory') ? [searchParams.get('subcategory')!] : []
  );
  const [availability, setAvailability] = useState<string[]>(
    searchParams.get('availability')?.split(',').filter(Boolean) || []
  );
  const [isExpanded, setIsExpanded] = useState(false);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString());
    if (priceRange[1] < 10000) params.set('maxPrice', priceRange[1].toString());
    if (selectedSpaces.length > 0) params.set('space', selectedSpaces[0]);
    if (selectedSubcategories.length > 0) params.set('subcategory', selectedSubcategories[0]);
    if (availability.length > 0) params.set('availability', availability.join(','));

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [sortBy, priceRange, selectedSpaces, selectedSubcategories, availability, router]);

  const handleSpaceChange = (spaceSlug: string, checked: boolean) => {
    if (checked) {
      setSelectedSpaces([spaceSlug]);
      // Clear subcategory when space changes
      setSelectedSubcategories([]);
    } else {
      setSelectedSpaces([]);
    }
  };

  const handleSubcategoryChange = (subcategorySlug: string, checked: boolean) => {
    if (checked) {
      setSelectedSubcategories([subcategorySlug]);
    } else {
      setSelectedSubcategories([]);
    }
  };

  const handleAvailabilityChange = (value: string, checked: boolean) => {
    if (checked) {
      setAvailability([...availability, value]);
    } else {
      setAvailability(availability.filter(a => a !== value));
    }
  };

  const clearAllFilters = () => {
    setSortBy('newest');
    setPriceRange([0, 10000]);
    setSelectedSpaces([]);
    setSelectedSubcategories([]);
    setAvailability([]);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (sortBy !== 'newest') count++;
    if (priceRange[0] > 0 || priceRange[1] < 10000) count++;
    if (selectedSpaces.length > 0) count++;
    if (selectedSubcategories.length > 0) count++;
    if (availability.length > 0) count++;
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
          <Select value={sortBy} onValueChange={setSortBy}>
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
              max={10000}
              min={0}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mt-2">
              <span>₦{priceRange[0].toLocaleString()}</span>
              <span>₦{priceRange[1].toLocaleString()}</span>
            </div>
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
                    checked={selectedSpaces.includes(space.slug)}
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
        {selectedSpaces.length > 0 && spaces.find(s => s.slug === selectedSpaces[0])?.subcategories && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Category</Label>
            <div className="space-y-2">
              {spaces
                .find(s => s.slug === selectedSpaces[0])
                ?.subcategories?.map((subcategory) => (
                  <div key={subcategory.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subcategory-${subcategory.slug}`}
                      checked={selectedSubcategories.includes(subcategory.slug)}
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
                checked={availability.includes('in_stock')}
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
                checked={availability.includes('out_of_stock')}
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
              {sortBy !== 'newest' && (
                <Badge variant="outline" className="text-xs">
                  Sort: {sortBy.replace('_', ' ')}
                </Badge>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                <Badge variant="outline" className="text-xs">
                  ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}
                </Badge>
              )}
              {selectedSpaces.map(spaceSlug => (
                <Badge key={spaceSlug} variant="outline" className="text-xs">
                  {spaces.find(s => s.slug === spaceSlug)?.name}
                </Badge>
              ))}
              {selectedSubcategories.map(subcategorySlug => (
                <Badge key={subcategorySlug} variant="outline" className="text-xs">
                  {spaces
                    .find(s => s.slug === selectedSpaces[0])
                    ?.subcategories?.find(sub => sub.slug === subcategorySlug)?.name}
                </Badge>
              ))}
              {availability.map(avail => (
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
