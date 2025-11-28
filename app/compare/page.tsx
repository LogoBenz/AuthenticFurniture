"use client";

import { useCompare } from "@/hooks/use-compare";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import { getCompareProductsAction } from "@/app/actions/compare";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X, ShoppingCart, Check } from "lucide-react";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { formatPrice } from "@/lib/products-client";

export default function ComparePage() {
    const { compareList, removeFromCompare } = useCompare();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart, isInCart } = useEnquiryCart();

    useEffect(() => {
        const fetchProducts = async () => {
            if (compareList.length === 0) {
                setProducts([]);
                setLoading(false);
                return;
            }

            try {
                const data = await getCompareProductsAction(compareList);
                setProducts(data);
            } catch (error) {
                console.error("Error fetching compare products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [compareList]);

    if (loading) {
        return <div className="min-h-screen pt-24 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div></div>;
    }

    if (products.length === 0) {
        return (
            <div className="min-h-screen pt-24 px-4 text-center">
                <h1 className="text-3xl font-bold mb-4">Compare Products</h1>
                <p className="text-slate-600 mb-8">You haven't added any products to compare yet.</p>
                <Link href="/products">
                    <Button>Browse Products</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[2000px] mx-auto">
            <h1 className="text-3xl font-bold mb-8">Compare Products</h1>

            <div className="overflow-x-auto pb-4">
                <table className="w-full min-w-[800px] border-collapse">
                    <thead>
                        <tr>
                            <th className="p-4 text-left w-48 bg-slate-50 dark:bg-slate-800 sticky left-0 z-10">Features</th>
                            {products.map(product => (
                                <th key={product.id} className="p-4 min-w-[250px] border-l border-slate-200 dark:border-slate-700 relative">
                                    <button
                                        onClick={() => removeFromCompare(product.id.toString())}
                                        className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <div className="aspect-square relative mb-4 bg-slate-100 rounded-lg overflow-hidden">
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <Link href={`/products/${product.slug}`} className="hover:text-blue-600">
                                        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                                    </Link>
                                    <div className="text-xl font-bold text-blue-600 mb-4">
                                        {formatPrice(product.price)}
                                    </div>
                                    <Button
                                        onClick={() => addToCart(product)}
                                        className={`w-full ${isInCart(product.id) ? 'bg-slate-900' : 'bg-blue-800 hover:bg-blue-900'}`}
                                    >
                                        {isInCart(product.id) ? (
                                            <><Check className="w-4 h-4 mr-2" /> Added</>
                                        ) : (
                                            <><ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart</>
                                        )}
                                    </Button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        <tr>
                            <td className="p-4 font-medium bg-slate-50 dark:bg-slate-800 sticky left-0">Category</td>
                            {products.map(product => (
                                <td key={product.id} className="p-4 border-l border-slate-200 dark:border-slate-700">
                                    {product.category}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 font-medium bg-slate-50 dark:bg-slate-800 sticky left-0">Description</td>
                            {products.map(product => (
                                <td key={product.id} className="p-4 border-l border-slate-200 dark:border-slate-700 text-sm text-slate-600">
                                    <div className="line-clamp-4">{product.description}</div>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 font-medium bg-slate-50 dark:bg-slate-800 sticky left-0">Dimensions</td>
                            {products.map(product => (
                                <td key={product.id} className="p-4 border-l border-slate-200 dark:border-slate-700 text-sm">
                                    {product.dimensions || '-'}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 font-medium bg-slate-50 dark:bg-slate-800 sticky left-0">Materials</td>
                            {products.map(product => (
                                <td key={product.id} className="p-4 border-l border-slate-200 dark:border-slate-700 text-sm">
                                    {product.materials || '-'}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
