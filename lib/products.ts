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
    inStock: Boolean(row.in_stock),
    isFeatured: Boolean(row.is_featured),
    // New fields for promo and best seller functionality
    original_price: row.original_price ? parseFloat(row.original_price) : (row.price ? parseFloat(row.price) : 0),
    discount_percent: row.discount_percent ? parseFloat(row.discount_percent) : 0,
    is_promo: Boolean(row.is_promo),
    is_best_seller: Boolean(row.is_best_seller),
  };
  
  console.log('✅ Mapped product:', product);
  return product;
}

// Check if Supabase is properly configured
function isSupabaseConfigured(): boolean {
  if (typeof window !== 'undefined') {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    return !!(supabaseUrl && 
              supabaseKey && 
              supabaseUrl.trim() !== '' && 
              supabaseKey.trim() !== '' &&
              supabaseUrl.startsWith('http') &&
              supabaseUrl.includes('supabase.co'));
  }
  return false;
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
    // Check total products
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select('id, name, is_promo, is_best_seller, original_price, discount_percent');
    
    console.log('📊 All products:', { data: allProducts, error: allError });
    
    // Check promo products
    const { data: promoProducts, error: promoError } = await supabase
      .from('products')
      .select('id, name, is_promo')
      .eq('is_promo', true);
    
    console.log('🔥 Promo products:', { data: promoProducts, error: promoError });
    
    // Check best sellers
    const { data: bestSellers, error: bestError } = await supabase
      .from('products')
      .select('id, name, is_best_seller')
      .eq('is_best_seller', true);
    
    console.log('⭐ Best sellers:', { data: bestSellers, error: bestError });
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  }
}

export async function getAllProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return fallbackProducts;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error && shouldUseFallback(error)) {
      console.warn('Using fallback data due to Supabase connection issue:', error.message);
      return fallbackProducts;
    }

    if (error) {
      throw error;
    }

    return data && Array.isArray(data) ? data.map(mapSupabaseRowToProduct) : fallbackProducts;
  } catch (error) {
    if (shouldUseFallback(error)) {
      console.warn('Using fallback data due to network error:', error);
      return fallbackProducts;
    }
    return fallbackProducts;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return fallbackProducts.find(p => p.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error && shouldUseFallback(error)) {
      console.warn('Using fallback data due to Supabase connection issue:', error.message);
      return fallbackProducts.find(p => p.slug === slug) || null;
    }

    if (error) {
      throw error;
    }

    return data ? mapSupabaseRowToProduct(data) : null;
  } catch (error) {
    console.warn('Using fallback data due to network error:', error);
    return fallbackProducts.find(p => p.slug === slug) || null;
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
      in_stock: product.inStock,
      is_featured: product.isFeatured,
      // New fields for promo and best seller functionality
      original_price: product.original_price || product.price,
      discount_percent: product.discount_percent || 0,
      is_promo: product.is_promo || false,
      is_best_seller: product.is_best_seller || false,
    };

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
    return mapSupabaseRowToProduct(data);
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
    if (updates.inStock !== undefined) updateData.in_stock = updates.inStock;
    if (updates.isFeatured !== undefined) updateData.is_featured = updates.isFeatured;
    // New fields for promo and best seller functionality
    if (updates.original_price !== undefined) updateData.original_price = updates.original_price;
    if (updates.discount_percent !== undefined) updateData.discount_percent = updates.discount_percent;
    if (updates.is_promo !== undefined) updateData.is_promo = updates.is_promo;
    if (updates.is_best_seller !== undefined) updateData.is_best_seller = updates.is_best_seller;

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