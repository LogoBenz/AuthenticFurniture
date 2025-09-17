"use client";

import { useEffect, useState } from "react";
import { getAllProducts, debugDatabaseState } from "@/lib/products";
import { Product } from "@/types";

export default function DebugProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        await debugDatabaseState();
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return <div className="p-8">Loading products...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Product Debug Page</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">All Products ({products.length})</h2>
        <div className="bg-gray-100 p-4 rounded">
          <pre className="text-sm overflow-auto">
            {JSON.stringify(products.map(p => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              category: p.category
            })), null, 2)}
          </pre>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Product Links</h2>
        <div className="space-y-2">
          {products.map((product) => (
            <div key={product.id} className="flex items-center space-x-4 p-2 border rounded">
              <span className="font-medium">{product.name}</span>
              <span className="text-gray-500">Slug: {product.slug}</span>
              <a 
                href={`/products/${product.slug}`}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Test Link
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Instructions</h2>
        <div className="bg-yellow-50 p-4 rounded">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Check the console for debug logs when you click a product link</li>
            <li>Verify that the slug in the URL matches the slug in the database</li>
            <li>If a product shows 404, check if the slug is properly generated</li>
            <li>Look for any Supabase connection errors in the console</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
