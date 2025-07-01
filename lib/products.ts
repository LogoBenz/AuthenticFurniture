import { supabase } from '@/lib/supabase';
import { Product } from "@/types";
import productsData from "@/data/products-fallback.json";

// Fallback data when Supabase is not configured
const fallbackProducts: Product[] = productsData.products;

// Convert Supabase row to Product type
function mapSupabaseRowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    price: parseFloat(row.price),
    description: row.description,
    features: row.features || [],
    imageUrl: row.image_url,
    inStock: row.in_stock,
    isFeatured: row.is_featured,
  };
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

    const { data, error } = await supabase
      .from('products')
      .insert({
        name: product.name,
        slug: product.slug,
        category: product.category,
        price: product.price,
        description: product.description,
        features: product.features,
        image_url: product.imageUrl,
        in_stock: product.inStock,
        is_featured: product.isFeatured,
      })
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

export async function updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Cannot update products.');
  }

  // Validate ID
  if (!id || typeof id !== 'number' || id <= 0) {
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
    if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
    if (updates.inStock !== undefined) updateData.in_stock = updates.inStock;
    if (updates.isFeatured !== undefined) updateData.is_featured = updates.isFeatured;

    console.log('🔄 Updating product:', { id, updateData });

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase update error:', error);
      
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

export async function deleteProduct(id: number): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Cannot delete products.');
  }

  // Validate ID
  if (!id || typeof id !== 'number' || id <= 0) {
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