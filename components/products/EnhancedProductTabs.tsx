"use client";

import { useState } from "react";
import { Product } from "@/types";
import {
  Package,
  FileText,
  Truck,
  Star,
  MapPin,
  Shield,
  Clock,
  Check
} from "lucide-react";

interface EnhancedProductTabsProps {
  product: Product;
}

export function EnhancedProductTabs({ product }: EnhancedProductTabsProps) {
  const [activeTab, setActiveTab] = useState("specifications");

  const tabs = [
    { id: "specifications", label: "Specifications", shortLabel: "Specs", icon: FileText },
    { id: "delivery", label: "Delivery Info", shortLabel: "Delivery", icon: Truck },
    { id: "reviews", label: "Reviews", shortLabel: "Reviews", icon: Star },
  ];

  const handleTabChange = (tabId: string) => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && (document as any).startViewTransition) {
      (document as any).startViewTransition(() => {
        setActiveTab(tabId);
      });
    } else {
      setActiveTab(tabId);
    }
  };

  const getDeliveryEstimate = () => {
    if (product.ships_from === 'Lagos') {
      return {
        sameDay: "Same-day delivery available for Lagos orders placed before 2 PM",
        standard: "2-3 business days for Lagos",
        nationwide: "3-5 business days nationwide"
      };
    }
    return {
      sameDay: "Not available",
      standard: "2-3 business days",
      nationwide: "3-5 business days nationwide"
    };
  };

  const deliveryInfo = getDeliveryEstimate();

  return (
    <div className="mt-12">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="grid grid-cols-3 gap-2 sm:gap-4" role="tablist" aria-label="Product Information">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isSelected}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center justify-center space-x-1.5 sm:space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${isSelected
                  ? "border-blue-800 text-blue-800 bg-blue-50/50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50"
                  }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">
                  {isSelected ? tab.label : tab.shortLabel}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {activeTab === "specifications" && (
          <div
            className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
            role="tabpanel"
            id="panel-specifications"
            aria-labelledby="tab-specifications"
          >
            {/* Description */}
            {product.description && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-4 h-4 text-gray-700 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Product Details
                </h3>
                <div className="space-y-3">
                  {product.modelNo && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Model Number:</span>
                      <span className="text-sm font-medium text-gray-900">{product.modelNo}</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Dimensions:</span>
                      <span className="text-sm font-medium text-gray-900">{product.dimensions}</span>
                    </div>
                  )}
                  {product.materials && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Materials:</span>
                      <span className="text-sm font-medium text-gray-900">{product.materials}</span>
                    </div>
                  )}
                  {product.weight_capacity && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Weight Capacity:</span>
                      <span className="text-sm font-medium text-gray-900">{product.weight_capacity}</span>
                    </div>
                  )}
                  {product.warranty && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Warranty:</span>
                      <span className="text-sm font-medium text-gray-900">{product.warranty}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping & Availability */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Availability & Shipping
                </h3>
                <div className="space-y-3">
                  {product.ships_from && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ships From:</span>
                      <span className="text-sm font-medium text-gray-900">{product.ships_from}</span>
                    </div>
                  )}
                  {product.delivery_timeframe && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Delivery Time:</span>
                      <span className="text-sm font-medium text-gray-900">{product.delivery_timeframe}</span>
                    </div>
                  )}
                  {product.stock_count !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Stock Status:</span>
                      <span className={`text-sm font-medium ${product.stock_count > 10
                        ? 'text-green-600'
                        : product.stock_count > 0
                          ? 'text-orange-600'
                          : 'text-red-600'
                        }`}>
                        {product.stock_count > 10
                          ? 'In Stock'
                          : product.stock_count > 0
                            ? 'Low Stock'
                            : 'Out of Stock'
                        }
                      </span>
                    </div>
                  )}
                  {product.popular_with && product.popular_with.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Popular With:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {product.popular_with.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "delivery" && (
          <div
            className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
            role="tabpanel"
            id="panel-delivery"
            aria-labelledby="tab-delivery"
          >
            <div className="space-y-8">
              {/* Delivery Options - Redesigned */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Delivery Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">

                    <h4 className="font-semibold text-gray-900 mb-1">Same-Day Delivery</h4>
                    <p className="text-sm text-gray-600 mb-2">{deliveryInfo.sameDay}</p>
                    <span className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded-md font-medium">
                      +₦2,000
                    </span>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">

                    <h4 className="font-semibold text-gray-900 mb-1">Standard Delivery</h4>
                    <p className="text-sm text-gray-600 mb-2">{deliveryInfo.standard}</p>
                    <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-medium">
                      Free over ₦10,000
                    </span>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">

                    <h4 className="font-semibold text-gray-900 mb-1">Nationwide</h4>
                    <p className="text-sm text-gray-600 mb-2">{deliveryInfo.nationwide}</p>
                    <span className="inline-block bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-md font-medium">
                      Calculated at checkout
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Information - Redesigned */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Shipping Guarantee
                </h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Free Shipping</p>
                        <p className="text-sm text-gray-600 mt-0.5">
                          On orders over ₦10,000 to Lagos and Abuja
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Secure Packaging</p>
                        <p className="text-sm text-gray-600 mt-0.5">
                          Protective packaging to prevent damage
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Real-time Tracking</p>
                        <p className="text-sm text-gray-600 mt-0.5">
                          SMS & Email updates on your order status
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Expert Installation</p>
                        <p className="text-sm text-gray-600 mt-0.5">
                          Available for large furniture items
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div
            className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
            role="tabpanel"
            id="panel-reviews"
            aria-labelledby="tab-reviews"
          >
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Customer Reviews
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Be the first to review this product
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                Write a Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
