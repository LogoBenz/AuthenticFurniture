"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { Product } from "@/types";

function mapSupabaseRowToProduct(row: any): Product {
    // Simplified mapping for compare view - we can reuse the logic from lib/products.ts if we export it, 
    // but for now I'll duplicate the essential parts to avoid circular deps or complex refactors.
    // Ideally, this mapping logic should be shared.

    let images: string[] = [];
    if (row.images) {
        if (Array.isArray(row.images)) {
            images = row.images;
        } else if (typeof row.images === 'string') {
            try {
                const parsed = JSON.parse(row.images);
                images = Array.isArray(parsed) ? parsed : [row.images];
            } catch {
                images = row.images.split(',').map((url: string) => url.trim()).filter(Boolean);
            }
        }
    }
    if (images.length === 0 && row.image_url) {
        images = [row.image_url];
    }
    if (images.length === 0) {
        images = ['/placeholder-product.jpg'];
    }

    return {
        id: String(row.id),
        name: String(row.name),
        slug: String(row.slug),
        category: String(row.category),
        price: Number(row.price),
        description: String(row.description),
        features: Array.isArray(row.features) ? row.features : [],
        images: images,
        imageUrl: images[0],
        videos: [],
        inStock: Boolean(row.in_stock),
        isFeatured: Boolean(row.is_featured),
        original_price: Number(row.original_price || row.price),
        discount_percent: Number(row.discount_percent || 0),
        is_promo: Boolean(row.is_promo),
        is_best_seller: Boolean(row.is_best_seller),
        modelNo: String(row.model_no || ''),
        dimensions: String(row.dimensions || ''),
        materials: String(row.materials || ''),
        weight_capacity: String(row.weight_capacity || ''),
        warranty: String(row.warranty || ''),
        delivery_timeframe: String(row.delivery_timeframe || ''),
    };
}

export async function getCompareProductsAction(ids: string[]): Promise<Product[]> {
    if (!ids || ids.length === 0) return [];

    const supabase = createAdminClient();

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .in('id', ids);

        if (error) {
            console.error('Error fetching compare products:', error);
            return [];
        }

        return (data || []).map(mapSupabaseRowToProduct);
    } catch (error) {
        console.error('Error in getCompareProductsAction:', error);
        return [];
    }
}
