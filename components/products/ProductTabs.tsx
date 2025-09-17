"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import { getWarehouseById } from "@/lib/warehouses";
import React from "react"; // Added missing import for React

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'stock' | 'specs'>('stock');

  const tabs = [
    { id: 'stock', label: 'Store Stock' },
    { id: 'specs', label: 'Specification' }
  ] as const;

  return (
    <div className="mt-12">
      {/* Tab Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-muted-foreground hover:text-slate-900 dark:hover:text-slate-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {activeTab === 'stock' && (
          <StoreStockTab product={product} />
        )}
        
        {activeTab === 'specs' && (
          <SpecificationTab product={product} />
        )}
      </div>
    </div>
  );
}

function StoreStockTab({ product }: { product: Product }) {
  const [warehouseInfo, setWarehouseInfo] = useState<any>(null);

  // Load warehouse info if warehouseLocation is available
  React.useEffect(() => {
    if ((product as any).warehouseLocation) {
      getWarehouseById((product as any).warehouseLocation)
        .then(setWarehouseInfo)
        .catch(console.error);
    }
  }, [product]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Stock Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stock Status */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Availability</h4>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={product.inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Warehouse Location */}
          {(product as any).warehouseLocation && (
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Warehouse Location</h4>
              <p className="text-sm text-muted-foreground">
                {warehouseInfo ? warehouseInfo.name : 'Loading...'}
              </p>
              {warehouseInfo && (
                <p className="text-xs text-muted-foreground mt-1">
                  {warehouseInfo.state}
                </p>
              )}
            </div>
          )}

          {/* Model Number */}
          {(product as any).modelNo && (
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Model Number</h4>
              <p className="text-sm text-muted-foreground">
                {(product as any).modelNo}
              </p>
            </div>
          )}

          {/* Dimensions */}
          {(product as any).dimensions && (
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Dimensions</h4>
              <p className="text-sm text-muted-foreground">
                {(product as any).dimensions}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SpecificationTab({ product }: { product: Product }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
        
        <div className="space-y-4">
          {/* Description */}
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Features</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Category */}
          <div>
            <h4 className="font-medium mb-2">Category</h4>
            <p className="text-muted-foreground">
              {product.category}
            </p>
          </div>

          {/* Additional Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(product as any).dimensions && (
              <div>
                <h4 className="font-medium mb-2">Dimensions</h4>
                <p className="text-muted-foreground">
                  {(product as any).dimensions}
                </p>
              </div>
            )}

            {(product as any).modelNo && (
              <div>
                <h4 className="font-medium mb-2">Model Number</h4>
                <p className="text-muted-foreground">
                  {(product as any).modelNo}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
