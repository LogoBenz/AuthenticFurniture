"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types";
import { formatPrice } from "@/lib/db";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface TopProductsProps {
    products: Product[];
}

export function TopProducts({ products }: TopProductsProps) {
    // Simulate top products by taking featured ones or just first 5
    const topProducts = products
        .filter(p => p.isFeatured)
        .slice(0, 5);

    // If no featured products, just take first 5
    const displayProducts = topProducts.length > 0 ? topProducts : products.slice(0, 5);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {displayProducts.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No products found</p>
                    ) : (
                        displayProducts.map((product) => (
                            <div key={product.id} className="flex items-center space-x-4">
                                <div className="relative h-12 w-12 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700">
                                    {product.imageUrl ? (
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs">
                                            No Img
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none line-clamp-1">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">{product.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">{formatPrice(product.price)}</p>
                                    <Badge variant={product.inStock ? "outline" : "destructive"} className="text-[10px] h-5 px-1">
                                        {product.inStock ? "In Stock" : "Out of Stock"}
                                    </Badge>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
