import 'server-only'
// @ts-ignore
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { createAdminClient } from './supabase-admin'
import { Product } from '@/types'

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface ProductFilters {
  space?: string
  subcategory?: string
  price_min?: number
  price_max?: number
  page?: number
  limit?: number
  search?: string
  is_featured?: boolean
  is_promo?: boolean
  is_best_seller?: boolean
  is_featured_deal?: boolean
  product_type?: string
}

export interface PaginatedProducts {
  products: Product[]
  totalCount: number
  page: number
  totalPages: number
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Maps a Supabase database row to a Product type
 */
function mapSupabaseRowToProduct(row: any): Product {
  // Handle images
  let images: string[] = []

  if (row.images) {
    if (Array.isArray(row.images)) {
      images = row.images
    } else if (typeof row.images === 'string') {
      try {
        const parsed = JSON.parse(row.images)
        images = Array.isArray(parsed) ? parsed : [row.images]
      } catch {
        images = row.images.split(',').map((url: string) => url.trim()).filter(Boolean)
      }
    }
  }

  if (images.length === 0 && row.image_url) {
    images = [row.image_url]
  }

  if (images.length === 0) {
    images = ['/placeholder-product.jpg']
  }

  // Handle videos
  let videos: string[] = []
  if (row.videos) {
    if (Array.isArray(row.videos)) {
      videos = row.videos
    } else if (typeof row.videos === 'string') {
      try {
        const parsed = JSON.parse(row.videos)
        videos = Array.isArray(parsed) ? parsed : [row.videos]
      } catch {
        videos = row.videos.split(',').map((url: string) => url.trim()).filter(Boolean)
      }
    }
  }

  return {
    id: String(row.id || ''),
    name: String(row.name || ''),
    slug: String(row.slug || ''),
    category: String(row.category || ''),
    price: row.price ? parseFloat(row.price) : 0,
    description: String(row.description || ''),
    features: Array.isArray(row.features) ? row.features : [],
    images: images,
    imageUrl: images[0],
    videos: videos,
    inStock: Boolean(row.in_stock),
    isFeatured: Boolean(row.is_featured),
    original_price: row.original_price ? parseFloat(row.original_price) : (row.price ? parseFloat(row.price) : 0),
    discount_percent: row.discount_percent ? parseFloat(row.discount_percent) : 0,
    is_promo: Boolean(row.is_promo),
    is_best_seller: Boolean(row.is_best_seller),
    modelNo: String(row.model_no || ''),
    warehouseLocation: String(row.warehouse_location || ''),
    dimensions: String(row.dimensions || ''),
    space_id: row.space_id || undefined,
    subcategory_id: row.subcategory_id || undefined,
    product_type: row.product_type || undefined,
    space: row.space || undefined,
    subcategory: row.subcategory || undefined,
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
    is_featured_deal: Boolean(row.is_featured_deal),
    deal_priority: row.deal_priority ? Number(row.deal_priority) : undefined,
  }
}

// ============================================================================
// MAIN PRODUCT FETCHING FUNCTIONS (SERVER-SIDE WITH CACHING)
// ============================================================================

/**
 * Get paginated products with filters
 * SERVER-ONLY - Cached with React cache() for request deduplication
 */
export const getProducts = cache(async (filters: ProductFilters = {}): Promise<PaginatedProducts> => {
  const supabase = createAdminClient()
  const page = filters.page || 1
  const limit = filters.limit || 12
  const offset = (page - 1) * limit

  try {
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        images,
        image_url,
        in_stock,
        category,
        original_price,
        discount_percent,
        is_promo,
        is_best_seller,
        is_featured,
        space_id,
        subcategory_id,
        product_type,
        space:spaces(id, name, slug),
        subcategory:subcategories(id, name, slug)
      `, { count: 'exact' })

    // Apply filters
    if (filters.space) {
      const { data: spaceData } = await supabase
        .from('spaces')
        .select('id')
        .eq('slug', filters.space)
        .single()

      if (spaceData) {
        query = query.eq('space_id', spaceData.id)
      }
    }

    if (filters.subcategory) {
      const { data: subcategoryData } = await supabase
        .from('subcategories')
        .select('id')
        .eq('slug', filters.subcategory)
        .single()

      if (subcategoryData) {
        query = query.eq('subcategory_id', subcategoryData.id)
      }
    }

    if (filters.price_min !== undefined) {
      query = query.gte('price', filters.price_min)
    }

    if (filters.price_max !== undefined) {
      query = query.lte('price', filters.price_max)
    }

    if (filters.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured)
    }

    if (filters.is_promo !== undefined) {
      query = query.eq('is_promo', filters.is_promo)
    }

    if (filters.is_best_seller !== undefined) {
      query = query.eq('is_best_seller', filters.is_best_seller)
    }

    if (filters.is_featured_deal !== undefined) {
      query = query.eq('is_featured_deal', filters.is_featured_deal)
    }

    if (filters.product_type) {
      query = query.eq('product_type', filters.product_type)
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      query = query.or(`name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    }

    query = query.eq('in_stock', true)

    query = query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase error fetching products:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        filters
      })
      throw new Error(`Failed to fetch products: ${error.message}`)
    }

    const products = (data || []).map(mapSupabaseRowToProduct)

    return {
      products,
      totalCount: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Fatal error in getProducts:', error)
    throw error
  }
})

/**
 * Get a single product by slug
 * SERVER-ONLY - Cached with unstable_cache for longer-term caching
 */
export const getProductBySlug = unstable_cache(
  async (slug: string): Promise<Product | null> => {
    const supabase = createAdminClient()

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          space:spaces(*),
          subcategory:subcategories(*)
        `)
        .eq('slug', slug)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`Product not found with slug: ${slug}`)
          return null
        }

        console.error(`Error fetching product ${slug}:`, {
          message: error.message,
          details: error.details,
          code: error.code
        })
        throw new Error(`Failed to fetch product: ${error.message}`)
      }

      return data ? mapSupabaseRowToProduct(data) : null
    } catch (error) {
      console.error(`Fatal error in getProductBySlug for ${slug}:`, error)
      throw error
    }
  },
  ['product-by-slug'],
  {
    revalidate: 180,
    tags: ['products']
  }
)

/**
 * Search products by query string
 * SERVER-ONLY - Cached with React cache()
 */
export const searchProducts = cache(async (query: string): Promise<Product[]> => {
  if (!query || query.trim() === '') {
    return []
  }

  const supabase = createAdminClient()
  const searchTerm = query.toLowerCase().trim()

  try {
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
        discount_percent
      `)
      .or(`name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .eq('in_stock', true)
      .limit(10)

    if (error) {
      console.error('Search error:', error)
      return []
    }

    return (data || []).map(mapSupabaseRowToProduct)
  } catch (error) {
    console.error('Fatal error in searchProducts:', error)
    return []
  }
})

// ============================================================================
// SPECIALIZED PRODUCT QUERIES
// ============================================================================

export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
  const result = await getProducts({ is_featured: true, limit: 8 })
  return result.products
})

export const getPromoProducts = cache(async (): Promise<Product[]> => {
  const result = await getProducts({ is_promo: true, limit: 12 })
  return result.products
})

export const getBestSellers = cache(async (): Promise<Product[]> => {
  const result = await getProducts({ is_best_seller: true, limit: 8 })
  return result.products
})

export const getFeaturedDeals = cache(async (): Promise<Product[]> => {
  const supabase = createAdminClient()

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured_deal', true)
      .eq('in_stock', true)
      .order('deal_priority', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(7)

    if (error) {
      console.error('Error fetching featured deals:', error)
      return await getPromoProducts()
    }

    let products: Product[] = (data || []).map((row: any, index: number) => {
      const product = mapSupabaseRowToProduct(row)
      return {
        ...product,
        stock_count: product.stock_count || Math.floor(Math.random() * 100) + 20,
        sold_count: (product as any).sold_count || Math.floor(Math.random() * 80) + 10,
        badges: index < 2 ? ['Selling Fast'] : product.badges,
      }
    })

    if (products.length < 6) {
      const promoProducts = await getPromoProducts()
      const additionalProducts = promoProducts
        .filter(p => !products.find(existing => existing.id === p.id))
        .slice(0, 6 - products.length)
        .map((p, index) => ({
          ...p,
          stock_count: Math.floor(Math.random() * 100) + 20,
          sold_count: Math.floor(Math.random() * 80) + 10,
          badges: (products.length + index) < 2 ? ['Selling Fast'] : undefined,
        }))

      products = [...products, ...additionalProducts]
    }

    return products.slice(0, 6)
  } catch (error) {
    console.error('Fatal error in getFeaturedDeals:', error)
    return await getPromoProducts()
  }
})

export const getProductsBySubcategory = cache(async (subcategorySlug: string): Promise<Product[]> => {
  const result = await getProducts({ subcategory: subcategorySlug, limit: 100 })
  return result.products
})

export const getProductsByType = cache(async (subcategorySlug: string, productType: string): Promise<Product[]> => {
  const result = await getProducts({
    subcategory: subcategorySlug,
    product_type: productType,
    limit: 100
  })
  return result.products
})

export const getProductCategories = cache(async (): Promise<string[]> => {
  const supabase = createAdminClient()

  try {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .order('category')

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    const categories = [...new Set((data || []).map(item => item.category))]
    return categories
  } catch (error) {
    console.error('Fatal error in getProductCategories:', error)
    return []
  }
})
