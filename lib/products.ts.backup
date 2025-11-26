import { supabase } from '@/lib/supabase';
import { Product } from "@/types";
import productsData from "@/data/products-fallback.json";

// Fallback data when Supabase is not configured
const fallbackProducts: Product[] = productsData.products as Product[];

// Convert Supabase row to Product type
function mapSupabaseRowToProduct(row: any): Product {
  console.log('🔄 Mapping database row:', row);
  
  // Handle images - could be stored as JSON array, comma-separated string, or single URL
  let images: string[] = [];
  
  if (row.images) {
    console.log('📝 Found images field:', row.images, 'Type:', typeof row.images);
    // If images is already an array
    if (Array.isArray(row.images)) {
      images = row.images;
      console.log('✅ Images is already an array:', images);
    }
    // If images is a JSON string
    else if (typeof row.images === 'string') {
      try {
        const parsed = JSON.parse(row.images);
        images = Array.isArray(parsed) ? parsed : [row.images];
        console.log('✅ Parsed JSON images:', images);
      } catch {
        // If JSON parsing fails, treat as comma-separated string
        images = row.images.split(',').map((url: string) => url.trim()).filter(Boolean);
        console.log('✅ Treated as comma-separated string:', images);
      }
    }
  }
  
  // Fallback to single image_url if no images array
  if (images.length === 0 && row.image_url) {
    images = [row.image_url];
    console.log('🔄 Fallback to image_url:', images);
  }
  
  // Ensure we have at least one image
  if (images.length === 0) {
    images = ['/placeholder-product.jpg']; // Fallback placeholder
    console.log('🔄 Using placeholder image');
  }

  // Handle videos - similar to images
  let videos: string[] = [];
  
  if (row.videos) {
    console.log('📝 Found videos field:', row.videos, 'Type:', typeof row.videos);
    // If videos is already an array
    if (Array.isArray(row.videos)) {
      videos = row.videos;
      console.log('✅ Videos is already an array:', videos);
    }
    // If videos is a JSON string
    else if (typeof row.videos === 'string') {
      try {
        const parsed = JSON.parse(row.videos);
        videos = Array.isArray(parsed) ? parsed : [row.videos];
        console.log('✅ Parsed JSON videos:', videos);
      } catch {
        // If JSON parsing fails, treat as comma-separated string
        videos = row.videos.split(',').map((url: string) => url.trim()).filter(Boolean);
        console.log('✅ Treated as comma-separated string:', videos);
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
  
  console.log('✅ Mapped product:', product);
  return product;
}

// Check if Supabase is properly configured - FIXED VERSION
function isSupabaseConfigured(): boolean {
  // Always return true since we're using direct config
  console.log('🔍 Supabase config check: Using direct configuration');
  return true;
}

// Enhanced error handling - detect CORS and configuration issues
function shouldUseFallback(error: any): boolean {
  if (!error) return false;
  
  const errorMessage = error?.message || '';
  const errorCode = error?.code || '';
  const errorName = error?.name || '';
  
  // Network/CORS/Config errors should use fallback silently
  return (
    errorMessage.includes('CORS') || 
    errorMessage.includes('Failed to fetch') ||
    errorMessage.includes('NetworkError') ||
    errorMessage.includes('not configured') ||
    errorMessage.includes('Invalid URL') ||
    errorMessage.includes('CORS_ERROR') ||
    errorMessage.includes('Request timeout') ||
    errorMessage.includes('fetch') ||
    errorName === 'TypeError' ||
    errorName === 'NetworkError' ||
    errorCode === 'PGRST301' ||
    errorCode === 'NETWORK_ERROR'
  );
}

// Debug function to check database state
export async function debugDatabaseState(): Promise<void> {
  console.log('🔍 Debugging database state...');
  
  if (!isSupabaseConfigured()) {
    console.log('⚠️ Supabase not configured');
    return;
  }

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
  console.log('🔍 getAllProducts: Checking Supabase config...');

  if (!isSupabaseConfigured()) {
    console.log('⚠️ getAllProducts: Supabase not configured, using fallback data');
    return fallbackProducts;
  }

  try {
    console.log('🔍 getAllProducts: Querying Supabase with space/subcategory joins...');
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        space:spaces(*),
        subcategory:subcategories(*)
      `)
      .order('created_at', { ascending: false });

    console.log('📊 getAllProducts: Supabase query result:', { data, error });

    if (error && shouldUseFallback(error)) {
      console.warn('Using fallback data due to Supabase connection issue:', error.message);
      return fallbackProducts;
    }

    if (error) {
      throw error;
    }

    const products = data && Array.isArray(data) ? data.map(mapSupabaseRowToProduct) : fallbackProducts;
    console.log('✅ getAllProducts: Returning', products.length, 'products');
    return products;
  } catch (error) {
    console.error('❌ getAllProducts: Error:', error);
    if (shouldUseFallback(error)) {
      console.warn('Using fallback data due to network error:', error);
      return fallbackProducts;
    }
    return fallbackProducts;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  console.log('🔍 Looking for product with slug:', slug);
  
  if (!isSupabaseConfigured()) {
    console.log('⚠️ Supabase not configured, using fallback data');
    const found = fallbackProducts.find(p => p.slug === slug) || null;
    console.log('📦 Fallback result:', found ? 'Found' : 'Not found');
    return found;
  }

  try {
    console.log('🔍 Querying Supabase for slug:', slug);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    console.log('📊 Supabase query result:', { data, error });

    if (error && shouldUseFallback(error)) {
      console.warn('Using fallback data due to Supabase connection issue:', error.message);
      const found = fallbackProducts.find(p => p.slug === slug) || null;
      console.log('📦 Fallback result:', found ? 'Found' : 'Not found');
      return found;
    }

    if (error) {
      console.error('❌ Supabase error:', error);
      
      // If it's a "not found" error, try to find by ID as fallback
      if (error.code === 'PGRST116' || error.message?.includes('No rows found')) {
        console.log('🔄 No product found with slug, trying to find by ID...');
        
        // Check if slug might be an ID
        const { data: idData, error: idError } = await supabase
          .from('products')
          .select('*')
          .eq('id', slug)
          .single();
          
        if (idData && !idError) {
          console.log('✅ Found product by ID:', idData.name);
          return mapSupabaseRowToProduct(idData);
        }
      }
      
      throw error;
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
    console.warn('Using fallback data due to network error:', error);
    const found = fallbackProducts.find(p => p.slug === slug) || null;
    console.log('📦 Fallback result:', found ? 'Found' : 'Not found');
    return found;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return fallbackProducts.filter(p => p.isFeatured);
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    if (error && shouldUseFallback(error)) {
      console.warn('Using fallback data due to Supabase connection issue:', error.message);
      return fallbackProducts.filter(p => p.isFeatured);
    }

    if (error) {
      throw error;
    }

    return data && Array.isArray(data) ? data.map(mapSupabaseRowToProduct) : fallbackProducts.filter(p => p.isFeatured);
  } catch (error) {
    console.warn('Using fallback data due to network error:', error);
    return fallbackProducts.filter(p => p.isFeatured);
  }
}

export async function getPromoProducts(): Promise<any[]> {
  console.log('🔍 Fetching promo products...');
  
  if (!isSupabaseConfigured()) {
    console.log('⚠️ Supabase not configured, using fallback data');
    return fallbackProducts
      .filter(() => Math.random() > 0.5)
      .map(p => ({ ...p, original_price: p.price, discount_percent: 10, is_promo: true }));
  }

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
      // Return fallback data instead of empty array
      return fallbackProducts
        .filter(() => Math.random() > 0.5)
        .slice(0, 6)
        .map(p => ({ ...p, original_price: p.price, discount_percent: 10, is_promo: true }));
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
    return [];
  }
}

export async function getBestSellers(): Promise<any[]> {
  console.log('🔍 Fetching best sellers...');

  if (!isSupabaseConfigured()) {
    console.log('⚠️ Supabase not configured, using fallback data');
    return fallbackProducts.slice(0, 8).map((p, i) => ({
      ...p,
      original_price: p.price,
      discount_percent: i % 2 === 0 ? 0 : 15,
      is_best_seller: true,
    }));
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_best_seller', true)
      .order('created_at', { ascending: false });

    console.log('📊 Best sellers query result:', { data, error });

    if (error) {
      console.error('❌ Error fetching best sellers:', error);
      return [];
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
    return [];
  }
}

export async function getFeaturedDeals(): Promise<Product[]> {
  console.log('🔍 Fetching featured deals...');

  if (!isSupabaseConfigured()) {
    console.log('⚠️ Supabase not configured, using fallback promo products');
    // Return first 6 promo products as fallback with stock data
    return fallbackProducts
      .filter(() => Math.random() > 0.3) // Randomly select some products
      .slice(0, 6)
      .map((p, index) => ({
        ...p,
        original_price: p.price,
        discount_percent: Math.floor(Math.random() * 30) + 5, // 5-35% discount
        // Add stock data for the stock counter
        stock_count: Math.floor(Math.random() * 100) + 20, // 20-120 stock
        sold_count: Math.floor(Math.random() * 80) + 10,  // 10-90 sold
        // Add badges for big cards
        badges: index < 2 ? ['Selling Fast'] : undefined,
      }));
  }

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
  if (!isSupabaseConfigured()) {
    const categories = new Set<string>();
    fallbackProducts.forEach((product) => {
      categories.add(product.category);
    });
    return Array.from(categories);
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .order('category');

    if (error && shouldUseFallback(error)) {
      console.warn('Using fallback data due to Supabase connection issue:', error.message);
      const categories = new Set<string>();
      fallbackProducts.forEach((product) => {
        categories.add(product.category);
      });
      return Array.from(categories);
    }

    if (error) {
      throw error;
    }

    if (!data || !Array.isArray(data)) {
      const categories = new Set<string>();
      fallbackProducts.forEach((product) => {
        categories.add(product.category);
      });
      return Array.from(categories);
    }

    const categories = [...new Set(data.map(item => item.category))];
    return categories;
  } catch (error) {
    console.warn('Using fallback data due to network error:', error);
    const categories = new Set<string>();
    fallbackProducts.forEach((product) => {
      categories.add(product.category);
    });
    return Array.from(categories);
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return fallbackProducts.filter(p => p.category === category);
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error && shouldUseFallback(error)) {
      console.warn('Using fallback data due to Supabase connection issue:', error.message);
      return fallbackProducts.filter(p => p.category === category);
    }

    if (error) {
      throw error;
    }

    return data && Array.isArray(data) ? data.map(mapSupabaseRowToProduct) : fallbackProducts.filter(p => p.category === category);
  } catch (error) {
    console.warn('Using fallback data due to network error:', error);
    return fallbackProducts.filter(p => p.category === category);
  }
}

export async function getProductsBySubcategory(subcategorySlug: string): Promise<Product[]> {
  console.log('🔍 Fetching products for subcategory:', subcategorySlug);

  if (!isSupabaseConfigured()) {
    console.log('⚠️ Supabase not configured, using fallback data');
    return fallbackProducts.filter(p => p.subcategory?.slug === subcategorySlug);
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        space:spaces(*),
        subcategory:subcategories(*)
      `)
      .eq('subcategory.slug', subcategorySlug)
      .order('created_at', { ascending: false });

    if (error && shouldUseFallback(error)) {
      console.warn('Using fallback data due to Supabase connection issue:', error.message);
      return fallbackProducts.filter(p => p.subcategory?.slug === subcategorySlug);
    }

    if (error) {
      throw error;
    }

    const products = data && Array.isArray(data) ? data.map(mapSupabaseRowToProduct) : [];
    console.log('✅ Found', products.length, 'products for subcategory:', subcategorySlug);
    return products;
  } catch (error) {
    console.error('❌ Error in getProductsBySubcategory:', error);
    return fallbackProducts.filter(p => p.subcategory?.slug === subcategorySlug);
  }
}

export async function getProductsByType(subcategorySlug: string, productType: string): Promise<Product[]> {
  console.log('🔍 Fetching products for subcategory:', subcategorySlug, 'type:', productType);

  if (!isSupabaseConfigured()) {
    console.log('⚠️ Supabase not configured, using fallback data');
    return fallbackProducts.filter(
      p => p.subcategory?.slug === subcategorySlug && p.product_type === productType
    );
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        space:spaces(*),
        subcategory:subcategories(*)
      `)
      .eq('subcategory.slug', subcategorySlug)
      .eq('product_type', productType)
      .order('created_at', { ascending: false });

    if (error && shouldUseFallback(error)) {
      console.warn('Using fallback data due to Supabase connection issue:', error.message);
      return fallbackProducts.filter(
        p => p.subcategory?.slug === subcategorySlug && p.product_type === productType
      );
    }

    if (error) {
      throw error;
    }

    const products = data && Array.isArray(data) ? data.map(mapSupabaseRowToProduct) : [];
    console.log('✅ Found', products.length, 'products for type:', productType);
    return products;
  } catch (error) {
    console.error('❌ Error in getProductsByType:', error);
    return fallbackProducts.filter(
      p => p.subcategory?.slug === subcategorySlug && p.product_type === productType
    );
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(price);
}

/**
 * Search products by query string
 * Searches across name, category, description, and features
 * @param query - Search query string
 * @returns Promise<Product[]> - Array of matching products (limited to 10)
 */
export async function searchProducts(query: string): Promise<Product[]> {
  console.log('🔍 Searching products with query:', query);

  if (!query || query.trim() === '') {
    console.log('⚠️ Empty search query, returning empty array');
    return [];
  }

  const searchTerm = query.trim().toLowerCase();

  if (!isSupabaseConfigured()) {
    console.log('⚠️ Supabase not configured, using fallback data');
    // Client-side filtering on fallback data
    return fallbackProducts
      .filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.features.some(feature => feature.toLowerCase().includes(searchTerm))
      )
      .slice(0, 10);
  }

  try {
    // Try Supabase query with .or() clause for multiple field matching
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        space:spaces(*),
        subcategory:subcategories(*)
      `)
      .or(`name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .limit(10);

    if (error && shouldUseFallback(error)) {
      console.warn('Using fallback data due to Supabase connection issue:', error.message);
      // Fallback to client-side filtering
      return fallbackProducts
        .filter(product =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.features.some(feature => feature.toLowerCase().includes(searchTerm))
        )
        .slice(0, 10);
    }

    if (error) {
      throw error;
    }

    const products = data && Array.isArray(data) ? data.map(mapSupabaseRowToProduct) : [];
    console.log('✅ Found', products.length, 'products matching query:', query);
    return products;
  } catch (error) {
    console.error('❌ Error in searchProducts:', error);
    // Fallback to client-side filtering
    console.warn('Using fallback data due to network error:', error);
    return fallbackProducts
      .filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.features.some(feature => feature.toLowerCase().includes(searchTerm))
      )
      .slice(0, 10);
  }
}

// Admin functions for managing products (only work with Supabase)
export async function createProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Cannot create products.');
  }

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
    };

    console.log('🔄 Creating product with data:', productData);

    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase create error:', error);
      
      // Check for CORS/network errors
      if (shouldUseFallback(error)) {
        throw new Error('Connection error: Please check your Supabase project configuration and ensure CORS is properly set up.');
      }
      
      throw new Error(`Database create failed: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from create operation.');
    }

    console.log('✅ Product created successfully:', data);
    const mapped = mapSupabaseRowToProduct(data);
    return mapped;
  } catch (error) {
    console.error('❌ Create product error:', error);
    
    // Check if it's a network error and provide better error message
    if (shouldUseFallback(error)) {
      throw new Error('Connection error: Please check your Supabase project configuration and ensure CORS is properly set up.');
    }
    
    throw error;
  }
}

export async function updateProduct(id: string | number, updates: Partial<Product>): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Cannot update products.');
  }

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
      // Only set if it's a valid UUID or null
      if (updates.space_id === null || updates.space_id === '' || 
          (typeof updates.space_id === 'string' && updates.space_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i))) {
        updateData.space_id = updates.space_id || null;
      }
    }
    if (updates.subcategory_id !== undefined) {
      // Only set if it's a valid UUID or null
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
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase update error:', error);
      console.error('❌ Update data that failed:', updateData);
      
      // Check for CORS/network errors
      if (shouldUseFallback(error)) {
        throw new Error('Connection error: Please check your Supabase project configuration and ensure CORS is properly set up.');
      }
      
      throw new Error(`Database update failed: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from update operation.');
    }

    console.log('✅ Product updated successfully:', data);
    return mapSupabaseRowToProduct(data);
  } catch (error) {
    console.error('❌ Update product error:', error);
    
    // Check if it's a network error and provide better error message
    if (shouldUseFallback(error)) {
      throw new Error('Connection error: Please check your Supabase project configuration and ensure CORS is properly set up.');
    }
    
    throw error;
  }
}

export async function deleteProduct(id: string | number): Promise<boolean> {
  console.log('🗑️ deleteProduct called with ID:', id, 'Type:', typeof id);
  
  if (!isSupabaseConfigured()) {
    const error = new Error('Supabase not configured. Cannot delete products.');
    console.error('❌', error.message);
    throw error;
  }

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
      
      // Check for CORS/network errors
      if (shouldUseFallback(error)) {
        throw new Error('Connection error: Please check your Supabase project configuration and ensure CORS is properly set up.');
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
    
    // Check if it's a network error and provide better error message
    if (shouldUseFallback(error)) {
      throw new Error('Connection error: Please check your Supabase project configuration and ensure CORS is properly set up.');
    }
    
    throw error;
  }
}

// Import upload functions from uploadMedia module
export { uploadProductImage, uploadProductVideo } from './uploadMedia';

// Enhanced getAllProducts with filtering support
export async function getFilteredProducts(searchParams?: URLSearchParams): Promise<Product[]> {
  console.log('🔍 getFilteredProducts: Checking Supabase config...');

  if (!isSupabaseConfigured()) {
    console.log('⚠️ getFilteredProducts: Supabase not configured, using fallback data');
    return fallbackProducts;
  }

  try {
    console.log('🔍 getFilteredProducts: Querying Supabase with space/subcategory joins...');
    let query = supabase
      .from('products')
      .select(`
        *,
        space:spaces(*),
        subcategory:subcategories(*)
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

    if (error && shouldUseFallback(error)) {
      console.warn('Using fallback data due to Supabase connection issue:', error.message);
      return fallbackProducts;
    }

    if (error) {
      console.warn('❌ getFilteredProducts: Supabase error:', error);
      // Don't throw error, just return fallback data
      return fallbackProducts;
    }

    const products = data && Array.isArray(data) ? data.map(mapSupabaseRowToProduct) : fallbackProducts;
    console.log('✅ getFilteredProducts: Returning', products.length, 'products');
    return products;
  } catch (error) {
    console.warn('❌ getFilteredProducts: Caught error:', error);
    // Don't throw error, just return fallback data
    return fallbackProducts;
  }
}
