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
  };
  
  console.log('✅ Mapped product:', product);
  return product;
}

// Check if Supabase is properly configured - FIXED VERSION
function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const isConfigured = !!(
    supabaseUrl && 
    supabaseKey && 
    supabaseUrl.trim() !== '' && 
    supabaseKey.trim() !== '' &&
    supabaseUrl.startsWith('http') &&
    supabaseUrl.includes('supabase.co')
  );
  
  console.log('🔍 Supabase config check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlStart: supabaseUrl?.substring(0, 20) || 'missing',
    isConfigured
  });
  
  return isConfigured;
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
    console.log('🔍 getAllProducts: Querying Supabase...');
    const { data, error } = await supabase
      .from('products')
      .select('*')
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
      return [];
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

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(price);
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
    // Space and subcategory fields
    if (updates.space_id !== undefined) updateData.space_id = updates.space_id;
    if (updates.subcategory_id !== undefined) updateData.subcategory_id = updates.subcategory_id;
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
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Cannot delete products.');
  }

  // Validate ID
  if (
    id === null || id === undefined ||
    (typeof id === 'string' && id.trim() === '') ||
    (typeof id === 'number' && !Number.isFinite(id))
  ) {
    throw new Error('Invalid product ID provided.');
  }

  try {
    console.log('🔄 Deleting product:', id);

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Supabase delete error:', error);
      
      // Check for CORS/network errors
      if (shouldUseFallback(error)) {
        throw new Error('Connection error: Please check your Supabase project configuration and ensure CORS is properly set up.');
      }
      
      throw new Error(`Database delete failed: ${error.message}`);
    }

    console.log('✅ Product deleted successfully:', id);
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

// Image upload helper function
export async function uploadProductImage(file: File): Promise<string> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Cannot upload images.');
  }

  // Validate file
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload JPEG, PNG, GIF, or WebP images.');
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB.');
  }

  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    console.log('🔄 Uploading image:', fileName);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ Image upload error:', error);
      
      // Check for CORS/network errors
      if (shouldUseFallback(error)) {
        throw new Error('Connection error: Please check your Supabase project configuration and ensure CORS is properly set up.');
      }
      
      throw new Error(`Image upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    console.log('✅ Image uploaded successfully:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('❌ Upload image error:', error);
    
    // Check if it's a network error and provide better error message
    if (shouldUseFallback(error)) {
      throw new Error('Connection error: Please check your Supabase project configuration and ensure CORS is properly set up.');
    }
    
    throw error;
  }
}

// Video upload helper function
export async function uploadProductVideo(file: File): Promise<string> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Cannot upload videos.');
  }

  // Validate file
  const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload MP4, WebM, OGG, or MOV videos.');
  }

  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    throw new Error('File size must be less than 100MB.');
  }

  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    console.log('🔄 Uploading video:', fileName);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-videos')
      .upload(filePath, file, {
        cacheControl: '7200', // Longer cache for videos
        upsert: false
      });

    if (error) {
      console.error('❌ Video upload error:', error);
      
      // Check for CORS/network errors
      if (shouldUseFallback(error)) {
        throw new Error('Connection error: Please check your Supabase project configuration and ensure CORS is properly set up.');
      }
      
      throw new Error(`Video upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-videos')
      .getPublicUrl(filePath);

    console.log('✅ Video uploaded successfully:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('❌ Upload video error:', error);
    
    // Check if it's a network error and provide better error message
    if (shouldUseFallback(error)) {
      throw new Error('Connection error: Please check your Supabase project configuration and ensure CORS is properly set up.');
    }
    
    throw error;
  }
}