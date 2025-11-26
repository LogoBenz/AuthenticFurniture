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
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-800 text-blue-800"
                    : "border-transparent text-gray-600 hover:text-gray-900"
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
                      <span className={`text-sm font-medium ${
                        product.stock_count > 10 
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Delivery Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Delivery Options
                </h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-900">Same-Day Delivery</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {deliveryInfo.sameDay}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Additional ₦2,000 fee applies
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">Standard Delivery</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {deliveryInfo.standard}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Free on orders over ₦10,000
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-gray-900">Nationwide Delivery</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {deliveryInfo.nationwide}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Delivery fee varies by location
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Shipping Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-gray-700 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Free Shipping</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        On orders over ₦10,000 to Lagos and Abuja
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-gray-700 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Secure Packaging</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        All items are carefully packaged to prevent damage during transit
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-gray-700 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Tracking</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        You'll receive tracking information once your order ships
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-gray-700 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Installation</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Professional installation available for large items (additional fee)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Zones */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Delivery Zones & Fees</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Zone 1 (Free)</h4>
                  <p className="text-sm text-green-700">
                    Lagos, Abuja - Free delivery on orders over ₦10,000
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Zone 2 (₦3,000)</h4>
                  <p className="text-sm text-blue-700">
                    Port Harcourt, Kano, Ibadan - 3-4 business days
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Zone 3 (₦5,000)</h4>
                  <p className="text-sm text-purple-700">
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
