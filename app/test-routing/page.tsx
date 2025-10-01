"use client";

import { useState, useEffect } from "react";
import { getAllProducts } from "@/lib/products";
import { getAllSpaces, getSpacesForNavigation } from "@/lib/categories";
import { Product, Space } from "@/types";

export default function TestRoutingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, spacesData] = await Promise.all([
          getAllProducts(),
          getSpacesForNavigation()
        ]);

        setProducts(productsData);
        setSpaces(spacesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">Testing Routing & Filtering</h1>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mr-3"></div>
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Testing Routing & Filtering</h1>

        {/* Spaces Test */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Spaces System Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spaces.map((space) => (
              <div key={space.id} className="border rounded-lg p-4">
                <h3 className="font-medium">{space.name}</h3>
                <p className="text-sm text-gray-600">Slug: {space.slug}</p>
                <p className="text-sm text-gray-600">Subcategories: {space.subcategories?.length || 0}</p>
                <div className="mt-2">
                  {space.subcategories?.map((sub) => (
                    <div key={sub.id} className="text-xs text-gray-500">
                      - {sub.name} ({sub.slug})
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products Test */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Products with Space/Subcategory Test</h2>
          <div className="space-y-4">
            {products.slice(0, 10).map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-600">Category: {product.category}</p>
                <p className="text-sm text-gray-600">
                  Space: {product.space?.name || 'None'} ({product.space?.slug || 'N/A'})
                </p>
                <p className="text-sm text-gray-600">
                  Subcategory: {product.subcategory?.name || 'None'} ({product.subcategory?.slug || 'N/A'})
                </p>
                <p className="text-sm text-gray-600">Images: {product.images.length}</p>
                <p className="text-sm text-gray-600">Videos: {product.videos?.length || 0}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Links Test */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Navigation Links Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spaces.map((space) => (
              <div key={space.id} className="space-y-2">
                <h3 className="font-medium">{space.name}</h3>
                <a
                  href={`/products?space=${space.slug}`}
                  className="block text-blue-600 hover:underline"
                >
                  View {space.name} Products
                </a>
                {space.subcategories?.map((sub) => (
                  <a
                    key={sub.id}
                    href={`/products?space=${space.slug}&subcategory=${sub.slug}`}
                    className="block text-sm text-blue-500 hover:underline ml-4"
                  >
                    View {sub.name}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{spaces.length}</div>
              <div className="text-sm text-gray-600">Spaces</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{products.length}</div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {products.filter(p => p.space).length}
              </div>
              <div className="text-sm text-gray-600">With Space</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {products.filter(p => p.subcategory).length}
              </div>
              <div className="text-sm text-gray-600">With Subcategory</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
