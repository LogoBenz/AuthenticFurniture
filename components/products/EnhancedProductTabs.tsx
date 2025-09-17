"use client";

import { useState } from "react";
import { Product } from "@/types";
import { 
  Package, 
  FileText, 
  Truck, 
  Star,
  MapPin,
  Users,
  Shield,
  Clock
} from "lucide-react";

interface EnhancedProductTabsProps {
  product: Product;
}

export function EnhancedProductTabs({ product }: EnhancedProductTabsProps) {
  const [activeTab, setActiveTab] = useState("specifications");

  const tabs = [
    { id: "specifications", label: "Specifications", icon: FileText },
    { id: "delivery", label: "Delivery & Shipping", icon: Truck },
    { id: "reviews", label: "Reviews", icon: Star },
  ];

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
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {activeTab === "specifications" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Product Details
                </h3>
                <div className="space-y-3">
                  {product.modelNo && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Model Number:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{product.modelNo}</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Dimensions:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{product.dimensions}</span>
                    </div>
                  )}
                  {product.materials && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Materials:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{product.materials}</span>
                    </div>
                  )}
                  {product.weight_capacity && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Weight Capacity:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{product.weight_capacity}</span>
                    </div>
                  )}
                  {product.warranty && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Warranty:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{product.warranty}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping & Availability */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Availability & Shipping
                </h3>
                <div className="space-y-3">
                  {product.ships_from && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Ships From:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{product.ships_from}</span>
                    </div>
                  )}
                  {product.delivery_timeframe && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Delivery Time:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{product.delivery_timeframe}</span>
                    </div>
                  )}
                  {product.stock_count !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Stock Status:</span>
                      <span className={`font-medium ${
                        product.stock_count > 10 
                          ? 'text-green-600 dark:text-green-400' 
                          : product.stock_count > 0 
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-red-600 dark:text-red-400'
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
                      <span className="text-slate-600 dark:text-slate-400">Popular With:</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {product.popular_with.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Description</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "delivery" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Delivery Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Delivery Options
                </h3>
                <div className="space-y-4">
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-slate-900 dark:text-white">Same-Day Delivery</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {deliveryInfo.sameDay}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      Additional ₦2,000 fee applies
                    </p>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-slate-900 dark:text-white">Standard Delivery</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {deliveryInfo.standard}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      Free on orders over ₦10,000
                    </p>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-slate-900 dark:text-white">Nationwide Delivery</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {deliveryInfo.nationwide}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      Delivery fee varies by location
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Shipping Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Free Shipping</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        On orders over ₦10,000 to Lagos and Abuja
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Secure Packaging</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        All items are carefully packaged to prevent damage during transit
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Tracking</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        You'll receive tracking information once your order ships
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Installation</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Professional installation available for large items (additional fee)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Zones */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Delivery Zones & Fees</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Zone 1 (Free)</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Lagos, Abuja - Free delivery on orders over ₦10,000
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Zone 2 (₦3,000)</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Port Harcourt, Kano, Ibadan - 3-4 business days
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Zone 3 (₦5,000)</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Other states - 4-5 business days
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Customer Reviews
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Be the first to review this product
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                Write a Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
