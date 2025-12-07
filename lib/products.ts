// @ts-ignore
// Force rebuild
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { createAdminClient } from '@/lib/supabase-admin';
import { Product } from "@/types";

// Convert Supabase row to Product type
// Convert Supabase row to Product type
function mapSupabaseRowToProduct(row: any): Product {
  // Handle images - could be stored as JSON array, comma-separated string, or single URL
  let images: string[] = [];

  if (row.images) {
    // If images is already an array
    if (Array.isArray(row.images)) {
      images = row.images;
    }
    // If images is a JSON string
    else if (typeof row.images === 'string') {
      try {
        const parsed = JSON.parse(row.images);
        images = Array.isArray(parsed) ? parsed : [row.images];
      } catch {
        // If JSON parsing fails, treat as comma-separated string
        images = row.images.split(',').map((url: string) => url.trim()).filter(Boolean);
      }
    }
  }

  // Fallback to single image_url if no images array
  if (images.length === 0 && row.image_url) {
    images = [row.image_url];
  }

  // Ensure we have at least one image
  if (images.length === 0) {
    images = ['/placeholder-product.jpg']; // Fallback placeholder
  }

  // Handle videos - similar to images
  let videos: string[] = [];

  if (row.videos) {
    // If videos is already an array
    if (Array.isArray(row.videos)) {
      videos = row.videos;
    }
    // If videos is a JSON string
    else if (typeof row.videos === 'string') {
      try {
        const parsed = JSON.parse(row.videos);
        videos = Array.isArray(parsed) ? parsed : [row.videos];
      } catch {
        // If JSON parsing fails, treat as comma-separated string
        videos = row.videos.split(',').map((url: string) => url.trim()).filter(Boolean);
      }
    }
  }

  const product = {
    id: String(row.id || ''),
    name: String(row.name || ''),
    slug: String(row.slug || ''),
    category: String(row.category || ''),
    price: row.price ? parseFloat(row.price) : 0,
    description: String(row.description || ''),
    features: Array.isArray(row.features) ? row.features : [],
    images: images,
    imageUrl: images[0], // Backward compatibility - use first image
    videos: videos,
    inStock: Boolean(row.in_stock),
    isFeatured: Boolean(row.is_featured),
    // New fields for promo and best seller functionality
    original_price: row.original_price ? parseFloat(row.original_price) : (row.price ? parseFloat(row.price) : 0),
    discount_percent: row.discount_percent ? parseFloat(row.discount_percent) : 0,
    is_promo: Boolean(row.is_promo),
    is_best_seller: Boolean(row.is_best_seller),
    // New inventory fields
    modelNo: String(row.model_no || ''),
    warehouseLocation: String(row.warehouse_location || ''),
    dimensions: String(row.dimensions || ''),
    // Space and subcategory data from joins
    space_id: row.space_id || undefined,
    subcategory_id: row.subcategory_id || undefined,
    // Multi-select support
    space_ids: row.product_spaces?.map((ps: any) => ps.space_id) || [],
    subcategory_ids: row.product_subcategories?.map((ps: any) => ps.subcategory_id) || [],
    spaces: row.product_spaces?.map((ps: any) => ps.space) || [],
    subcategories: row.product_subcategories?.map((ps: any) => ps.subcategory) || [],

    product_type: row.product_type || undefined,
    space: row.space || undefined,
    subcategory: row.subcategory || undefined,
    // Enhanced product view page fields
    discount_enabled: Boolean(row.discount_enabled),
    bulk_pricing_enabled: Boolean(row.bulk_pricing_enabled),
    bulk_pricing_tiers: row.bulk_pricing_tiers ? (Array.isArray(row.bulk_pricing_tiers) ? row.bulk_pricing_tiers : JSON.parse(row.bulk_pricing_tiers)) : undefined,
    ships_from: String(row.ships_from || ''),
    popular_with: row.popular_with ? (Array.isArray(row.popular_with) ? row.popular_with : JSON.parse(row.popular_with)) : undefined,
    badges: row.badges ? (Array.isArray(row.badges) ? row.badges : JSON.parse(row.badges)) : undefined,
    materials: String(row.materials || ''),
    weight_capacity: String(row.weight_capacity || ''),
    warranty: String(row.warranty || ''),
    delivery_timeframe: String(row.delivery_timeframe || ''),
    stock_count: row.stock_count ? parseInt(row.stock_count) : undefined,
    limited_time_deal: row.limited_time_deal ? (typeof row.limited_time_deal === 'string' ? JSON.parse(row.limited_time_deal) : row.limited_time_deal) : undefined,
    // Deals of the Week
    is_featured_deal: Boolean(row.is_featured_deal),
    deal_priority: row.deal_priority ? Number(row.deal_priority) : undefined,
  };

  return product;
}



// ============================================================================
// NEW SERVER-SIDE CACHED FUNCTIONS FOR PRODUCTION SSR
// ============================================================================

/**
 * Product filter interface for pagination and filtering
 */
export interface ProductFilters {
  space?: string;
  subcategory?: string;
  collection?: string; // New collection filter
  search?: string; // Search query
  price_min?: number;
  price_max?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

/**
 * Paginated products response interface
 */
export interface PaginatedProducts {
  products: Product[];
  totalCount: number;
  page: number;
  totalPages: number;
}

/**
 * Server-side cached function for fetching products with pagination and filters
 * Uses React cache() for request deduplication
 * 
 * @param filters - ProductFilters object with optional space, subcategory, price range, and pagination
 * @returns Promise<PaginatedProducts> - Paginated product data with total count
 */
export const getProducts = cache(async (filters: ProductFilters = {}): Promise<PaginatedProducts> => {
  const supabase = createAdminClient(); // Use admin client for server-side
  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const offset = (page - 1) * limit;

  try {
    // Build query with selective column selection for performance
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        images,
        in_stock,
        category,
        space_id,
        subcategory_id,
        is_best_seller,
        is_featured,
        is_promo,
        product_spaces(space_id, space:spaces(id, name, slug)),
        product_subcategories(subcategory_id, subcategory:subcategories(id, name, slug))
      `, { count: 'exact' });

    // Apply filters
    if (filters.space) {
      console.log('🔍 Applying space filter:', filters.space);
      query = query.eq('space_id', filters.space);
    }

    if (filters.subcategory) {
      console.log('🔍 Applying subcategory filter:', filters.subcategory);
      query = query.eq('subcategory_id', filters.subcategory);
    }

    if (filters.collection) {
      if (filters.collection === 'best-sellers') {
        query = query.eq('is_best_seller', true);
      } else if (filters.collection === 'featured') {
        query = query.eq('is_featured', true);
      } else if (filters.collection === 'promo') {
        query = query.eq('is_promo', true);
      }
    }

    // Apply search filter
    if (filters.search) {
      // Construct a search query that looks at name, description, and keywords
      // Using ilike for case-insensitive partial matching
      const searchTerm = `%${filters.search}%`;
      query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm},category.ilike.${searchTerm}`);
    }

    if (filters.price_min !== undefined) {
      query = query.gte('price', filters.price_min);
    }

    if (filters.price_max !== undefined) {
      query = query.lte('price', filters.price_max);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Apply sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'name_asc':
          query = query.order('name', { ascending: true });
          break;
        case 'name_desc':
          query = query.order('name', { ascending: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }
    } else {
      // Default sort
      query = query.order('created_at', { ascending: false });
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error fetching products:', error);
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    const products = (data || []).map(mapSupabaseRowToProduct);
    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      products,
      totalCount,
      page,
      totalPages
    };
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw error;
  }
});

// Debug function to check database state
export async function debugDatabaseState(): Promise<void> {
  console.log('🔍 Debugging database state...');

  try {
    // Check total products with slugs
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select('id, name, slug, is_promo, is_best_seller, original_price, discount_percent');

    console.log('📊 All products with slugs:', { data: allProducts, error: allError });

    if (allProducts) {
      console.log('📝 Product slugs:', allProducts.map((p: any) => ({ id: p.id, name: p.name, slug: p.slug })));
    }

    // Check promo products
    const { data: promoProducts, error: promoError } = await supabase
      .from('products')
      .select('id, name, slug, is_promo')
      .eq('is_promo', true);

    console.log('🔥 Promo products:', { data: promoProducts, error: promoError });

    // Check best sellers
    const { data: bestSellers, error: bestError } = await supabase
      .from('products')
      .select('id, name, slug, is_best_seller')
      .eq('is_best_seller', true);

    console.log('⭐ Best sellers:', { data: bestSellers, error: bestError });

  } catch (error) {
    console.error('❌ Debug error:', error);
  }
}

export async function getAllProducts(): Promise<Product[]> {
  console.log('🔍 getAllProducts: Querying Supabase with space/subcategory joins...');

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_spaces(space_id, space:spaces(*)),
        product_subcategories(subcategory_id, subcategory:subcategories(*))
      `)
      .order('created_at', { ascending: false });

    console.log('📊 getAllProducts: Supabase query result:', { data, error });

    if (error) {
      console.error('❌ Supabase error fetching products:', error);
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    const products = data && Array.isArray(data) ? data.map(mapSupabaseRowToProduct) : [];
    console.log('✅ getAllProducts: Returning', products.length, 'products');
    return products;
  } catch (error) {
    console.error('❌ getAllProducts: Error:', error);
    throw error;
  }
}

export async function deleteProduct(id: string | number): Promise<boolean> {
  console.log('🗑️ deleteProduct called with ID:', id, 'Type:', typeof id);

  // Validate ID
  if (
    id === null || id === undefined ||
    (typeof id === 'string' && id.trim() === '') ||
    (typeof id === 'number' && !Number.isFinite(id))
  ) {
    const error = new Error('Invalid product ID provided.');
    console.error('❌', error.message);
    throw error;
  }

  try {
    console.log('🔄 Step 1: Deleting inventory records for product:', id);

    // Step 1: Delete related inventory records first (cascade delete)
    const { data: deletedInventory, error: inventoryError } = await supabase
      .from('warehouse_products')
      .delete()
      .eq('product_id', id)
      .select();

    if (inventoryError) {
      console.warn('⚠️ Warning: Could not delete inventory records:', inventoryError);
      console.warn('   Error code:', inventoryError.code);
      console.warn('   Error details:', inventoryError.details);
      console.warn('   Error hint:', inventoryError.hint);
      // Continue with product deletion even if inventory deletion fails
      // (table might not exist or no inventory records)
    } else {
      console.log('✅ Deleted', deletedInventory?.length || 0, 'inventory records');
    }

    // Step 2: Delete the product
    console.log('🔄 Step 2: Deleting product from products table:', id);
    const { data: deletedProduct, error, status, statusText } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .select();

    console.log('📊 Delete response:', {
      data: deletedProduct,
      error,
      status,
      statusText,
      deletedCount: deletedProduct?.length || 0
    });

    if (error) {
      console.error('❌ Supabase delete error:', error);
      console.error('   Error code:', error.code);
      console.error('   Error message:', error.message);
      console.error('   Error details:', error.details);
      console.error('   Error hint:', error.hint);

      // Check for specific error codes
      if (error.code === '42501') {
        throw new Error('Permission denied: Row Level Security (RLS) is blocking the delete. Check your Supabase policies.');
      }

      if (error.code === '23503') {
        throw new Error('Cannot delete: Product is referenced by other records (foreign key constraint).');
      }

      throw new Error(`Database delete failed: ${error.message} (Code: ${error.code})`);
    }

    if (!deletedProduct || deletedProduct.length === 0) {
      console.warn('⚠️ No product was deleted. Product might not exist or RLS is blocking the operation.');
      throw new Error('Product not found or permission denied. The product may have already been deleted or you lack permission to delete it.');
    }

    console.log('✅ Product deleted successfully:', deletedProduct[0]);
    return true;
  } catch (error) {
    console.error('❌ Delete product error:', error);
    throw error;
  }
}

/**
 * Server-side cached function for fetching a single product by slug
 * Uses unstable_cache for longer-term caching with tags for revalidation
 * 
 * @param slug - Product slug
 * @returns Promise<Product | null> - Product data or null if not found
 */
export const getProductBySlug = unstable_cache(
  async (slug: string): Promise<Product | null> => {
    console.log('🔍 getProductBySlug: Looking for product with slug:', slug);

    const supabase = createAdminClient(); // Use admin client for server-side

    try {
      console.log('🔍 Querying Supabase for slug:', slug);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_spaces(space_id, space:spaces(*)),
          product_subcategories(subcategory_id, subcategory:subcategories(*))
        `)
        .eq('slug', slug)
        .single();

      console.log('📊 Supabase query result:', { data, error });

      if (error) {
        console.error('❌ Supabase error:', error);

        // If it's a "not found" error, try to find by ID as fallback
        if (error.code === 'PGRST116' || error.message?.includes('No rows found')) {
          console.log('🔄 No product found with slug, trying to find by ID...');

          // Check if slug might be an ID
          const { data: idData, error: idError } = await supabase
            .from('products')
            .select(`
              *,
              *,
              space:spaces(*),
              subcategory:subcategories(*),
              product_spaces(space_id, space:spaces(*)),
              product_subcategories(subcategory_id, subcategory:subcategories(*))
            `)
            .eq('id', slug)
            .single();

          if (idData && !idError) {
            console.log('✅ Found product by ID:', idData.name);
            return mapSupabaseRowToProduct(idData);
          }
        }

        // Return null for not found, throw for other errors
        if (error.code === 'PGRST116' || error.message?.includes('No rows found')) {
          console.log('❌ No product found with slug:', slug);
          return null;
        }

        throw new Error(`Failed to fetch product: ${error.message}`);
      }

      if (data) {
        console.log('✅ Product found:', data.name);
        return mapSupabaseRowToProduct(data);
      } else {
        console.log('❌ No product found with slug:', slug);
        return null;
      }
    } catch (error) {
      console.error('❌ Error in getProductBySlug:', error);
      throw error;
    }
  },
  ['product-by-slug'],
  {
    revalidate: 180, // 3 minutes
    tags: ['products']
  }
);

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching featured products:', error);
      throw new Error(`Failed to fetch featured products: ${error.message}`);
    }

    return data && Array.isArray(data) ? data.map(mapSupabaseRowToProduct) : [];
  } catch (error) {
    console.error('❌ Error in getFeaturedProducts:', error);
    throw error;
  }
}

export async function getPromoProducts(): Promise<any[]> {
  console.log('🔍 Fetching promo products...');

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_promo', true)
      .order('created_at', { ascending: false });

    console.log('📊 Promo products query result:', { data, error });

    if (error) {
      console.error('❌ Error fetching promo products:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw new Error(`Failed to fetch promo products: ${error.message}`);
    }

    const mappedProducts = (data || []).map(mapSupabaseRowToProduct).map((p: any) => ({
      ...p,
      original_price: Number((p as any).original_price ?? p.price),
      discount_percent: Number((p as any).discount_percent ?? 0)
    }));

    console.log('✅ Mapped promo products:', mappedProducts);
    return mappedProducts;
  } catch (error) {
    console.error('❌ Exception in getPromoProducts:', error);
    throw error;
  }
}

export async function getBestSellers(): Promise<any[]> {
  console.log('🔍 Fetching best sellers...');

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_best_seller', true)
      .order('created_at', { ascending: false });

    console.log('📊 Best sellers query result:', { data, error });

    if (error) {
      console.error('❌ Error fetching best sellers:', error);
      throw new Error(`Failed to fetch best sellers: ${error.message}`);
    }

    const mappedProducts = (data || []).map(mapSupabaseRowToProduct).map((p: any) => ({
      ...p,
      original_price: Number((p as any).original_price ?? p.price),
      discount_percent: Number((p as any).discount_percent ?? 0)
    }));

    console.log('✅ Mapped best sellers:', mappedProducts);
    return mappedProducts;
  } catch (error) {
    console.error('❌ Exception in getBestSellers:', error);
    throw error;
  }
}

export async function getFeaturedDeals(): Promise<Product[]> {
  console.log('🔍 Fetching featured deals...');

  try {
    // Get products marked as featured deals, ordered by position (lower = first)
    const { data: featuredData, error: featuredError } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured_deal', true)
      .order('deal_priority', { ascending: true }) // Position 1 first, then 2, 3, etc.
      .order('created_at', { ascending: false })
      .limit(7); // Get top 7: positions 1-2 = big cards, 3-7 = normal cards

    console.log('📊 Featured deals query result:', { data: featuredData, error: featuredError });

    if (featuredError) {
      console.error('❌ Error fetching featured deals:', featuredError);
      // Fall back to promo products
      return await getPromoProductsWithStockData();
    }

    let products: Product[] = [];

    if (featuredData && featuredData.length > 0) {
      // Map featured deals and add stock data
      products = featuredData.map((row: any, index: number) => {
        const product = mapSupabaseRowToProduct(row);
        // Add stock data if not present
        return {
          ...product,
          stock_count: (product as any).stock_count || Math.floor(Math.random() * 100) + 20,
          sold_count: (product as any).sold_count || Math.floor(Math.random() * 80) + 10,
          // Add "Selling Fast" badge to first 2 products (big cards)
          badges: index < 2 ? ['Selling Fast'] : (product as any).badges,
        };
      });
    }

    // If we don't have enough deals (need 7 total), fill with promo products
    if (products.length < 7) {
      console.log('📝 Not enough featured deals, filling with promo products...');
      const { data: additionalData } = await supabase
        .from('products')
        .select('*')
        .eq('is_promo', true)
        .order('created_at', { ascending: false })
        .limit(7 - products.length);

      if (additionalData) {
        const additionalProducts = additionalData
          .filter((row: any) => !products.find(existing => existing.id === row.id)) // Avoid duplicates
          .map((row: any, index: number) => {
            const product = mapSupabaseRowToProduct(row);
            return {
              ...product,
              stock_count: Math.floor(Math.random() * 100) + 20,
              sold_count: Math.floor(Math.random() * 80) + 10,
              badges: (products.length + index) < 2 ? ['Selling Fast'] : undefined,
            };
          });

        products = [...products, ...additionalProducts];
      }
    }

    // Ensure we return exactly 6 products
    const finalProducts = products.slice(0, 6);

    console.log('✅ Returning featured deals:', finalProducts.length, 'products');
    return finalProducts;

  } catch (error) {
    console.error('❌ Exception in getFeaturedDeals:', error);
    // Fall back to promo products
    return await getPromoProductsWithStockData();
  }
}

// Helper function to get promo products with badges
async function getPromoProductsWithBadges(): Promise<Product[]> {
  const promoProducts = await getPromoProducts();

  return promoProducts.map((p: any, index: number) => ({
    ...p,
    // Add "Selling Fast" badge to first 2 products
    badges: index < 2 ? ['Selling Fast'] : undefined,
  }));
}

// Helper function to get promo products with stock data
async function getPromoProductsWithStockData(): Promise<Product[]> {
  const promoProducts = await getPromoProducts();

  return promoProducts.map((p: any, index: number) => ({
    ...p,
    // Add stock data for the stock counter
    stock_count: Math.floor(Math.random() * 100) + 20, // 20-120 stock
    sold_count: Math.floor(Math.random() * 80) + 10,  // 10-90 sold
    // Add "Selling Fast" badge to first 2 products (big cards)
    badges: index < 2 ? ['Selling Fast'] : undefined,
  }));
}

export async function getProductCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .order('category');

    if (error) {
      console.error('❌ Error fetching product categories:', error);
      throw new Error(`Failed to fetch product categories: ${error.message}`);
    }

    if (!data || !Array.isArray(data)) {
      return [];
    }

    const categories = [...new Set(data.map(item => item.category))];
    return categories;
  } catch (error) {
    console.error('❌ Error in getProductCategories:', error);
    throw error;
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching products by category:', error);
      throw new Error(`Failed to fetch products by category: ${error.message}`);
    }

    return data && Array.isArray(data) ? data.map(mapSupabaseRowToProduct) : [];
  } catch (error) {
    console.error('❌ Error in getProductsByCategory:', error);
    throw error;
  }
}

export async function getProductsBySubcategory(subcategorySlug: string): Promise<Product[]> {
  console.log('🔍 Fetching products for subcategory:', subcategorySlug);

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_spaces(
          space:spaces(*)
        ),
        product_subcategories!inner(
          subcategory:subcategories!inner(*)
        )
      `)
      .eq('product_subcategories.subcategory.slug', subcategorySlug)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching products by subcategory:', error);
      throw new Error(`Failed to fetch products by subcategory: ${error.message}`);
    }

    const products = data && Array.isArray(data) ? data.map(mapSupabaseRowToProduct) : [];
    console.log('✅ Found', products.length, 'products for subcategory:', subcategorySlug);
    return products;
  } catch (error) {
    console.error('❌ Error in getProductsBySubcategory:', error);
    throw error;
  }
}

export async function getProductsByType(subcategorySlug: string, productType: string): Promise<Product[]> {
  console.log('🔍 Fetching products for subcategory:', subcategorySlug, 'type:', productType);

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_spaces(
          space:spaces(*)
        ),
        product_subcategories!inner(
          subcategory:subcategories!inner(*)
        )
      `)
      .eq('product_subcategories.subcategory.slug', subcategorySlug)
      .eq('product_type', productType)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching products by type:', error);
      throw new Error(`Failed to fetch products by type: ${error.message}`);
    }

    const products = data && Array.isArray(data) ? data.map(mapSupabaseRowToProduct) : [];
    console.log('✅ Found', products.length, 'products for type:', productType);
    return products;
  } catch (error) {
    console.error('❌ Error in getProductsByType:', error);
    throw error;
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(price);
}

/**
 * Search products by query string (SERVER-SIDE with caching)
 * Searches across name, category, description
 * @param query - Search query string
 * @returns Promise<Product[]> - Array of matching products (limited to 10)
 */
export const searchProducts = cache(async (query: string): Promise<Product[]> => {
  console.log('🔍 Searching products with query:', query);

  if (!query || query.trim() === '') {
    console.log('⚠️ Empty search query, returning empty array');
    return [];
  }

  const searchTerm = query.trim().toLowerCase();
  const supabase = createAdminClient(); // Use admin client for server-side

  try {
    // Server-side Supabase query with .or() clause for multiple field matching
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        images,
        image_url,
        category,
        in_stock,
        original_price,
        discount_percent,
        space:spaces(id, name, slug),
        subcategory:subcategories(id, name, slug)
      `)
      .or(`name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .limit(10);

    if (error) {
      console.error('❌ Error in searchProducts:', error);
      // Return empty array on error instead of fallback
      return [];
    }

    const products = data && Array.isArray(data) ? data.map(mapSupabaseRowToProduct) : [];
    console.log('✅ Found', products.length, 'products matching query:', query);
    return products;
  } catch (error) {
    console.error('❌ Error in searchProducts:', error);
    // Return empty array on error instead of fallback
    return [];
  }
});

// Admin functions for managing products (only work with Supabase)
export async function createProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
  // Validate required fields
  if (!product.name || !product.category || !product.description || !product.imageUrl) {
    throw new Error('Missing required fields: name, category, description, and imageUrl are required.');
  }

  // Validate price
  if (typeof product.price !== 'number' || product.price < 0) {
    throw new Error('Price must be a valid positive number.');
  }

  try {
    console.log('🔄 Creating product:', product.name);

    const productData = {
      name: product.name,
      slug: product.slug,
      category: product.category,
      price: product.price,
      description: product.description,
      features: product.features,
      images: JSON.stringify(product.images),
      image_url: product.imageUrl,
      videos: product.videos ? JSON.stringify(product.videos) : null,
      in_stock: product.inStock,
      is_featured: product.isFeatured,
      // New fields for promo and best seller functionality
      original_price: product.original_price || product.price,
      discount_percent: product.discount_percent || 0,
      is_promo: product.is_promo || false,
      is_best_seller: product.is_best_seller || false,
      is_new: product.is_new || false,
      // New inventory fields
      model_no: product.modelNo || '',
      warehouse_location: product.warehouseLocation || '',
      dimensions: product.dimensions || '',
      // Space and subcategory fields
      space_id: product.space_id || null,
      subcategory_id: product.subcategory_id || null,
      // Enhanced product view page fields
      discount_enabled: product.discount_enabled || false,
      bulk_pricing_enabled: product.bulk_pricing_enabled || false,
      bulk_pricing_tiers: product.bulk_pricing_tiers ? JSON.stringify(product.bulk_pricing_tiers) : null,
      ships_from: product.ships_from || null,
      popular_with: product.popular_with ? JSON.stringify(product.popular_with) : null,
      badges: product.badges ? JSON.stringify(product.badges) : null,
      materials: product.materials || null,
      weight_capacity: product.weight_capacity || null,
      warranty: product.warranty || null,
      delivery_timeframe: product.delivery_timeframe || null,
      stock_count: product.stock_count || null,
      limited_time_deal: product.limited_time_deal ? JSON.stringify(product.limited_time_deal) : null,
      // Featured deals fields
      is_featured_deal: product.isFeatured || false,
      deal_priority: 1,
      // New product type
      product_type: product.product_type || null,
    };

    console.log('🔄 Creating product with data:', productData);

    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase create error:', error);
      throw new Error(`Database create failed: ${error.message}`);
    }

    // Handle multi-select spaces
    if (product.space_ids && product.space_ids.length > 0) {
      const spaceInserts = product.space_ids.map(spaceId => ({
        product_id: data.id,
        space_id: spaceId
      }));

      const { error: spaceError } = await supabase
        .from('product_spaces')
        .insert(spaceInserts);

      if (spaceError) console.error('Error inserting product spaces:', spaceError);
    }

    // Handle multi-select subcategories
    if (product.subcategory_ids && product.subcategory_ids.length > 0) {
      const subInserts = product.subcategory_ids.map(subId => ({
        product_id: data.id,
        subcategory_id: subId
      }));

      const { error: subError } = await supabase
        .from('product_subcategories')
        .insert(subInserts);

      if (subError) console.error('Error inserting product subcategories:', subError);
    }

    console.log('✅ Product created successfully:', data);
    return mapSupabaseRowToProduct(data);
  } catch (error) {
    console.error('❌ Create product error:', error);
    throw error;
  }
}

export async function updateProduct(id: string | number, updates: Partial<Product>): Promise<Product | null> {
  // Validate ID
  if (
    id === null || id === undefined ||
    (typeof id === 'string' && id.trim() === '') ||
    (typeof id === 'number' && !Number.isFinite(id))
  ) {
    throw new Error('Invalid product ID provided.');
  }

  // Validate price if provided
  if (updates.price !== undefined) {
    const price = Number(updates.price);
    if (isNaN(price) || price < 0) {
      throw new Error('Price must be a valid positive number.');
    }
    updates.price = price;
  }

  try {
    const updateData: any = {};

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.slug !== undefined) updateData.slug = updates.slug;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.features !== undefined) updateData.features = updates.features;
    if (updates.images !== undefined) updateData.images = JSON.stringify(updates.images);
    if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
    if (updates.videos !== undefined) updateData.videos = JSON.stringify(updates.videos);
    if (updates.inStock !== undefined) updateData.in_stock = updates.inStock;
    if (updates.isFeatured !== undefined) updateData.is_featured = updates.isFeatured;
    // New fields for promo and best seller functionality
    if (updates.original_price !== undefined) updateData.original_price = updates.original_price;
    if (updates.discount_percent !== undefined) updateData.discount_percent = updates.discount_percent;
    if (updates.is_promo !== undefined) updateData.is_promo = updates.is_promo;
    if (updates.is_best_seller !== undefined) updateData.is_best_seller = updates.is_best_seller;
    // New inventory fields
    if (updates.modelNo !== undefined) updateData.model_no = updates.modelNo;
    if (updates.warehouseLocation !== undefined) updateData.warehouse_location = updates.warehouseLocation;
    if (updates.dimensions !== undefined) updateData.dimensions = updates.dimensions;

    // Space and subcategory fields - handle UUID validation
    if (updates.space_id !== undefined) {
      if (updates.space_id === null || updates.space_id === '' ||
        (typeof updates.space_id === 'string' && updates.space_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i))) {
        updateData.space_id = updates.space_id || null;
      }
    }
    if (updates.subcategory_id !== undefined) {
      if (updates.subcategory_id === null || updates.subcategory_id === '' ||
        (typeof updates.subcategory_id === 'string' && updates.subcategory_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i))) {
        updateData.subcategory_id = updates.subcategory_id || null;
      }
    }

    if (updates.product_type !== undefined) updateData.product_type = updates.product_type || null;

    // Enhanced product view page fields
    if (updates.discount_enabled !== undefined) updateData.discount_enabled = updates.discount_enabled;
    if (updates.bulk_pricing_enabled !== undefined) updateData.bulk_pricing_enabled = updates.bulk_pricing_enabled;
    if (updates.bulk_pricing_tiers !== undefined) updateData.bulk_pricing_tiers = updates.bulk_pricing_tiers ? JSON.stringify(updates.bulk_pricing_tiers) : null;
    if (updates.ships_from !== undefined) updateData.ships_from = updates.ships_from;
    if (updates.popular_with !== undefined) updateData.popular_with = updates.popular_with ? JSON.stringify(updates.popular_with) : null;
    if (updates.badges !== undefined) updateData.badges = updates.badges ? JSON.stringify(updates.badges) : null;
    if (updates.materials !== undefined) updateData.materials = updates.materials;
    if (updates.weight_capacity !== undefined) updateData.weight_capacity = updates.weight_capacity;
    if (updates.warranty !== undefined) updateData.warranty = updates.warranty;
    if (updates.delivery_timeframe !== undefined) updateData.delivery_timeframe = updates.delivery_timeframe;
    if (updates.stock_count !== undefined) updateData.stock_count = updates.stock_count;
    if (updates.limited_time_deal !== undefined) updateData.limited_time_deal = updates.limited_time_deal ? JSON.stringify(updates.limited_time_deal) : null;
    // Featured deals fields
    if ((updates as any).is_featured_deal !== undefined) updateData.is_featured_deal = (updates as any).is_featured_deal;
    if ((updates as any).deal_priority !== undefined) updateData.deal_priority = (updates as any).deal_priority;

    console.log('🔄 Updating product:', { id, updateData });

    // First, let's check if the product exists
    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('id, name')
      .eq('id', id)
      .single();

    if (checkError) {
      console.error('❌ Product check error:', checkError);
      throw new Error(`Product with ID ${id} not found: ${checkError.message}`);
    }

    console.log('✅ Found existing product:', existingProduct);

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('❌ Supabase update error:', error);
      console.error('❌ Update data that failed:', updateData);
      throw new Error(`Database update failed: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned from update operation. The product might not exist or you may lack permissions.');
    }

    // Handle multi-select spaces
    if (updates.space_ids) {
      // First delete existing
      await supabase.from('product_spaces').delete().eq('product_id', id);

      // Then insert new
      if (updates.space_ids.length > 0) {
        const spaceInserts = updates.space_ids.map(spaceId => ({
          product_id: id,
          space_id: spaceId
        }));

        const { error: spaceError } = await supabase
          .from('product_spaces')
          .insert(spaceInserts);

        if (spaceError) console.error('Error updating product spaces:', spaceError);
      }
    }

    // Handle multi-select subcategories
    if (updates.subcategory_ids) {
      // First delete existing
      await supabase.from('product_subcategories').delete().eq('product_id', id);

      // Then insert new
      if (updates.subcategory_ids.length > 0) {
        const subInserts = updates.subcategory_ids.map(subId => ({
          product_id: id,
          subcategory_id: subId
        }));

        const { error: subError } = await supabase
          .from('product_subcategories')
          .insert(subInserts);

        if (subError) console.error('Error updating product subcategories:', subError);
      }
    }

    console.log('✅ Product updated successfully:', data[0]);
    return mapSupabaseRowToProduct(data[0]);
  } catch (error) {
    console.error('❌ Update product error:', error);
    throw error;
  }
}






// Import upload functions from uploadMedia module
export { uploadProductImage, uploadProductVideo } from './uploadMedia';

// Enhanced getAllProducts with filtering support
export async function getFilteredProducts(searchParams?: URLSearchParams): Promise<Product[]> {
  console.log('🔍 getFilteredProducts: Querying Supabase with space/subcategory joins...');

  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        product_spaces(
          space:spaces(*)
        ),
        product_subcategories(
          subcategory:subcategories(*)
        )
      `)
      .eq('is_active', true);

    // Apply filters from search params
    if (searchParams) {
      // Sort by
      const sortBy = searchParams.get('sort');
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'name_asc':
          query = query.order('name', { ascending: true });
          break;
        case 'name_desc':
          query = query.order('name', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Price range
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      if (minPrice) {
        query = query.gte('price', parseFloat(minPrice));
      }
      if (maxPrice) {
        query = query.lte('price', parseFloat(maxPrice));
      }

      // Space filter
      const space = searchParams.get('space');
      if (space) {
        query = query.eq('space_id', space);
      }

      // Subcategory filter
      const subcategory = searchParams.get('subcategory');
      if (subcategory) {
        query = query.eq('subcategory_id', subcategory);
      }

      // Availability filter
      const availability = searchParams.get('availability');
      if (availability) {
        const availArray = availability.split(',');
        if (availArray.includes('in_stock')) {
          query = query.eq('in_stock', true);
        }
        if (availArray.includes('out_of_stock')) {
          query = query.eq('in_stock', false);
        }
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    console.log('📊 getFilteredProducts: Supabase query result:', { data, error });

    if (error) {
      console.error('❌ getFilteredProducts: Supabase error:', error);
      throw new Error(`Failed to fetch filtered products: ${error.message}`);
    }

    const products = data && Array.isArray(data) ? data.map(mapSupabaseRowToProduct) : [];
    console.log('✅ getFilteredProducts: Returning', products.length, 'products');
    return products;
  } catch (error) {
    console.error('❌ getFilteredProducts: Caught error:', error);
    throw error;
  }
}
