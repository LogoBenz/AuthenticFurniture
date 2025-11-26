# Design Document

## Overview

This design transforms the Authentic Furniture e-commerce platform into a production-ready application with server-side rendering, intelligent caching, and optimized performance. The solution addresses the core issue where client-side Supabase queries fail and fall back to hardcoded JSON data by moving all data fetching to the server using the admin client.

Key architectural changes:
1. **Server-Side Data Fetching**: All Supabase queries use the admin client server-side
2. **ISR with Smart Caching**: 3-minute revalidation with automatic cache invalidation
3. **URL-Driven Pagination/Filtering**: Server-side re-fetching on parameter changes
4. **Webhook-Based Revalidation**: Automatic page updates when admins edit products
5. **Image Optimization**: Next.js Image with CDN delivery and responsive loading
6. **Database Optimization**: Proper indexes and selective column queries

## Architecture

### High-Level Data Flow

```mermaid
graph TD
    A[User Request] --> B{Page Type}
    B -->|Products List| C[app/products/page.tsx]
    B -->|Product Detail| D[app/products/[slug]/page.tsx]
    
    C --> E[getProducts Server Function]
    D --> F[getProductBySlug Server Function]
    
    E --> G[lib/products.ts with cache]
    F --> G
    
    G --> H[Supabase Admin Client]
    H --> I[(Supabase Database)]
    
    I --> J[Return Data]
    J --> K[Render Server Component]
    K --> L[Pass Props to Client Components]
    
    M[Admin Updates Product] --> N[Admin API Route]
    N --> O[Supabase Update]
    O --> P[Call Revalidation Webhook]
    P --> Q[/api/revalidate-products]
    Q --> R[revalidatePath]
    R --> S[Invalidate Cache]
    S --> T[Next Request Regenerates Page]
```

### Component Architecture

```
app/
├── products/
│   ├── page.tsx (SERVER - fetches paginated products)
│   ├── loading.tsx (loading skeleton)
│   └── [slug]/
│       ├── page.tsx (SERVER - fetches single product)
│       └── loading.tsx
├── api/
│   └── revalidate-products/
│       └── route.ts (webhook endpoint)
└── admin/
    └── products/
        └── page.tsx (triggers revalidation on CRUD)

components/
├── products/
│   ├── ProductGrid.tsx (CLIENT - displays products)
│   ├── ProductCard.tsx (CLIENT - uses Next Image)
│   ├── ProductFilters.tsx (CLIENT - updates URL params)
│   └── Pagination.tsx (CLIENT - URL-based navigation)
└── ui/
    └── ProductSkeleton.tsx (loading states)

lib/
├── supabase-admin.ts (admin client with service role key)
├── supabase.ts (client for browser - anon key)
├── products.ts (cached server functions)
└── cache-config.ts (cache utilities)
```

## Components and Interfaces

### 1. Server-Side Product Fetching (lib/products.ts)

**Purpose**: Centralized data fetching with caching

**Key Functions**:

```typescript
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { createClient } from './supabase-admin'
import 'server-only'

interface ProductFilters {
  space?: string
  subcategory?: string
  price_min?: number
  price_max?: number
  page?: number
  limit?: number
}

interface PaginatedProducts {
  products: Product[]
  totalCount: number
  page: number
  totalPages: number
}

// Cached function for product listing with filters
export const getProducts = cache(async (filters: ProductFilters = {}): Promise<PaginatedProducts> => {
  const supabase = createClient()
  const page = filters.page || 1
  const limit = filters.limit || 12
  const offset = (page - 1) * limit

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
      space:spaces(id, name, slug),
      subcategory:subcategories(id, name, slug)
    `, { count: 'exact' })

  // Apply filters
  if (filters.space) {
    query = query.eq('space', filters.space)
  }
  if (filters.subcategory) {
    query = query.eq('subcategory', filters.subcategory)
  }
  if (filters.price_min) {
    query = query.gte('price', filters.price_min)
  }
  if (filters.price_max) {
    query = query.lte('price', filters.price_max)
  }

  // Pagination
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Supabase error fetching products:', error)
    throw new Error(`Failed to fetch products: ${error.message}`)
  }

  return {
    products: data || [],
    totalCount: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  }
})

// Cached function for single product
export const getProductBySlug = unstable_cache(
  async (slug: string): Promise<Product | null> => {
    const supabase = createClient()

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
      console.error(`Error fetching product ${slug}:`, error)
      return null
    }

    return data
  },
  ['product-by-slug'],
  {
    revalidate: 180, // 3 minutes
    tags: ['products']
  }
)

// Search function (for SearchModal)
export const searchProducts = cache(async (query: string): Promise<Product[]> => {
  const supabase = createClient()
  const searchTerm = query.toLowerCase().trim()

  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      images,
      category,
      in_stock
    `)
    .or(`name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .eq('in_stock', true)
    .limit(10)

  if (error) {
    console.error('Search error:', error)
    return []
  }

  return data || []
})
```

### 2. Products Listing Page (app/products/page.tsx)

**Purpose**: Server component that fetches and displays paginated products

```typescript
import { Suspense } from 'react'
import { getProducts } from '@/lib/products'
import ProductGrid from '@/components/products/ProductGrid'
import ProductFilters from '@/components/products/ProductFilters'
import Pagination from '@/components/products/Pagination'
import ProductSkeleton from '@/components/ui/ProductSkeleton'

// Enable ISR with 3-minute revalidation
export const revalidate = 180

interface PageProps {
  searchParams: {
    page?: string
    space?: string
    subcategory?: string
    price_min?: string
    price_max?: string
  }
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const filters = {
    page: parseInt(searchParams.page || '1'),
    space: searchParams.space,
    subcategory: searchParams.subcategory,
    price_min: searchParams.price_min ? parseFloat(searchParams.price_min) : undefined,
    price_max: searchParams.price_max ? parseFloat(searchParams.price_max) : undefined,
  }

  const { products, totalCount, page, totalPages } = await getProducts(filters)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className="w-64">
          <ProductFilters currentFilters={filters} />
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <div className="mb-4 text-sm text-gray-600">
            Showing {products.length} of {totalCount} products
          </div>

          <Suspense fallback={<ProductSkeleton count={12} />}>
            <ProductGrid products={products} />
          </Suspense>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              baseUrl="/products"
              searchParams={searchParams}
            />
          )}
        </main>
      </div>
    </div>
  )
}

// Generate metadata
export async function generateMetadata({ searchParams }: PageProps) {
  const space = searchParams.space
  const subcategory = searchParams.subcategory
  
  let title = 'Products'
  if (subcategory) title = `${subcategory.replace(/-/g, ' ')} | Products`
  else if (space) title = `${space.replace(/-/g, ' ')} | Products`

  return {
    title,
    description: 'Browse our collection of quality furniture for offices, schools, and homes.'
  }
}
```

### 3. Product Detail Page (app/products/[slug]/page.tsx)

**Purpose**: Server component for individual product pages with dynamic metadata

```typescript
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/products'
import ProductImageGallery from '@/components/products/ProductImageGallery'
import RelatedProducts from '@/components/products/RelatedProducts'

// Enable ISR
export const revalidate = 180

interface PageProps {
  params: { slug: string }
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <ProductImageGallery images={product.images} name={product.name} />
        
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary mb-4">
            ₦{product.price.toLocaleString()}
          </p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          {/* Add to cart, features, etc. */}
        </div>
      </div>

      <RelatedProducts 
        subcategory={product.subcategory?.slug} 
        currentProductId={product.id} 
      />
    </div>
  )
}

// Generate static params for popular products
export async function generateStaticParams() {
  // Optionally pre-generate top 50 products
  return []
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: 'Product Not Found'
    }
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.[0] ? [
        {
          url: product.images[0],
          width: 1200,
          height: 630,
          alt: product.name
        }
      ] : []
    }
  }
}
```

### 4. Revalidation Webhook (app/api/revalidate-products/route.ts)

**Purpose**: Automatic cache invalidation when products are updated

```typescript
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Validate webhook secret
  const authHeader = request.headers.get('authorization')
  const secret = process.env.SUPABASE_WEBHOOK_SECRET

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { type, record, old_record } = body

    console.log('Revalidation webhook triggered:', { type, record })

    // Revalidate products listing
    revalidatePath('/products')
    revalidateTag('products')

    // Revalidate specific product page if slug is available
    if (record?.slug) {
      revalidatePath(`/products/${record.slug}`)
    }

    // If slug changed, revalidate old slug too
    if (type === 'UPDATE' && old_record?.slug && old_record.slug !== record?.slug) {
      revalidatePath(`/products/${old_record.slug}`)
    }

    // Revalidate home page if featured products changed
    if (record?.is_featured || old_record?.is_featured) {
      revalidatePath('/')
    }

    return NextResponse.json({ 
      revalidated: true, 
      timestamp: new Date().toISOString() 
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json({ 
      error: 'Revalidation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
```

### 5. Admin Product Actions with Revalidation

**Purpose**: Trigger revalidation from admin panel after CRUD operations

```typescript
// In admin product form submission
async function handleProductUpdate(productData: Product) {
  try {
    // Update product in Supabase
    const { error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productData.id)

    if (error) throw error

    // Trigger revalidation
    await fetch('/api/revalidate-products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'UPDATE',
        record: productData
      })
    })

    toast.success('Product updated successfully')
  } catch (error) {
    console.error('Update error:', error)
    toast.error('Failed to update product')
  }
}
```

### 6. Image Optimization Configuration

**next.config.js**:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    loader: 'default', // or 'custom' if using CDN
  },
}

module.exports = nextConfig
```

**Custom Image Loader (if using CDN)**:

```typescript
// lib/image-loader.ts
export default function supabaseLoader({ src, width, quality }: {
  src: string
  width: number
  quality?: number
}) {
  const url = new URL(src)
  url.searchParams.set('width', width.toString())
  url.searchParams.set('quality', (quality || 75).toString())
  return url.toString()
}
```

**ProductCard with Optimized Images**:

```typescript
import Image from 'next/image'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Generate blur placeholder
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-lg font-bold">₦{product.price.toLocaleString()}</p>
      </div>
    </div>
  )
}
```

### 7. URL-Based Pagination Component

**Purpose**: Client component that updates URL parameters for server-side re-fetching

```typescript
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams: Record<string, string>
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  baseUrl,
  searchParams 
}: PaginationProps) {
  const router = useRouter()
  const params = useSearchParams()

  const createPageUrl = (page: number) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', page.toString())
    return `${baseUrl}?${newParams.toString()}`
  }

  const goToPage = (page: number) => {
    router.push(createPageUrl(page))
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
      >
        Previous
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          onClick={() => goToPage(page)}
          variant={page === currentPage ? 'default' : 'outline'}
        >
          {page}
        </Button>
      ))}

      <Button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
      >
        Next
      </Button>
    </div>
  )
}
```

### 8. Product Filters Component

**Purpose**: Client component that updates URL parameters for filtering

```typescript
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function ProductFilters({ currentFilters }: { currentFilters: any }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [priceMin, setPriceMin] = useState(currentFilters.price_min || '')
  const [priceMax, setPriceMax] = useState(currentFilters.price_max || '')

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    // Reset to page 1 when filters change
    params.set('page', '1')
    
    router.push(`/products?${params.toString()}`)
  }

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams)
    
    if (priceMin) params.set('price_min', priceMin)
    else params.delete('price_min')
    
    if (priceMax) params.set('price_max', priceMax)
    else params.delete('price_max')
    
    params.set('page', '1')
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Price Range</h3>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <button
            onClick={applyPriceFilter}
            className="w-full bg-primary text-white rounded px-4 py-2"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
```

## Database Optimization

### Required Indexes

```sql
-- Create indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products (subcategory);
CREATE INDEX IF NOT EXISTS idx_products_space ON products (space);
CREATE INDEX IF NOT EXISTS idx_products_price ON products (price);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products (in_stock);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at DESC);

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_products_space_subcategory ON products (space, subcategory);
CREATE INDEX IF NOT EXISTS idx_products_space_price ON products (space, price);
```

### RLS Policies

```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public products are viewable by everyone"
ON products FOR SELECT
USING (true);

CREATE POLICY "Public spaces are viewable by everyone"
ON spaces FOR SELECT
USING (true);

CREATE POLICY "Public subcategories are viewable by everyone"
ON subcategories FOR SELECT
USING (true);

-- Admin write access
CREATE POLICY "Admins can insert products"
ON products FOR INSERT
TO authenticated
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update products"
ON products FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete products"
ON products FOR DELETE
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');
```

## Error Handling

### Server-Side Error Handling

```typescript
// In lib/products.ts
export const getProducts = cache(async (filters: ProductFilters = {}): Promise<PaginatedProducts> => {
  try {
    const supabase = createClient()
    // ... query logic
    
    if (error) {
      console.error('Supabase error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      // Don't fall back to hardcoded data - throw error
      throw new Error(`Database query failed: ${error.message}`)
    }

    return {
      products: data || [],
      totalCount: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Fatal error in getProducts:', error)
    
    // Re-throw to trigger error boundary
    throw error
  }
})
```

### Error Boundary

```typescript
// app/products/error.tsx
'use client'

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-6">{error.message}</p>
      <button
        onClick={reset}
        className="bg-primary text-white px-6 py-2 rounded"
      >
        Try again
      </button>
    </div>
  )
}
```

## Performance Considerations

1. **Query Optimization**: Select only needed columns, use indexes
2. **Caching Strategy**: 3-minute cache with on-demand revalidation
3. **Image Optimization**: Next.js Image with responsive sizes and blur placeholders
4. **Pagination**: Limit results to 12 per page for fast rendering
5. **Code Splitting**: Lazy load client components
6. **Database Connection Pooling**: Supabase handles this automatically

## Security

1. **Server-Only Package**: Prevent service key exposure
2. **RLS Policies**: Database-level security
3. **Webhook Authentication**: Secret validation for revalidation
4. **Environment Variables**: Proper separation of public/private keys
5. **Admin Authorization**: Middleware protection for admin routes

## Testing Strategy

### Unit Tests
- Test filter logic with various parameter combinations
- Test pagination calculations
- Test cache invalidation logic

### Integration Tests
- Test full page rendering with real data
- Test filter and pagination interactions
- Test revalidation webhook

### Manual Testing Checklist
- [ ] Products page loads with real database data
- [ ] Pagination works correctly
- [ ] Filters update URL and refetch data
- [ ] Product detail pages load correctly
- [ ] Admin updates trigger revalidation
- [ ] Images load optimized and responsive
- [ ] Error states display correctly
- [ ] Performance is acceptable (< 2s page load)

## Deployment Checklist

1. Set environment variables on QServers
2. Run database migrations for indexes
3. Configure Supabase webhook for revalidation
4. Test revalidation endpoint
5. Verify RLS policies are active
6. Test image optimization
7. Monitor error logs
8. Set up CDN if needed (Cloudflare)
9. Test on production domain
10. Monitor performance metrics

## Dependencies

**Existing**:
- Next.js 14+ (App Router)
- Supabase client
- React 18+

**New**:
- `server-only` package (prevent client bundling)

**No other new dependencies required**
