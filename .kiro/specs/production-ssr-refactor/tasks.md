# Implementation Plan

- [x] 1. Set up server-only package and admin client configuration

  - Install `server-only` package: `npm install server-only`
  - Add `import 'server-only'` to `lib/supabase-admin.ts`
  - Verify `SUPABASE_SERVICE_ROLE_KEY` is in `.env.local`
  - Ensure admin client uses service role key, not anon key
  - _Requirements: 1.4, 1.7, 7.3_

- [ ] 2. Create database indexes for query optimization

  - Create migration file `supabase/migrations/add_product_indexes.sql`
  - Add indexes for: subcategory, space, price, slug, in_stock, created_at
  - Add composite indexes for common filter combinations (space+subcategory, space+price)

  - Run migration against Supabase database
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 3. Configure RLS policies for public read access

  - Create migration file `supabase/migrations/configure_rls_policies.sql`
  - Enable RLS on products, spaces, and subcategories tables

  - Add public SELECT policies for anonymous users

  - Add admin-only INSERT/UPDATE/DELETE policies
  - Test policies with anonymous and authenticated requests
  - _Requirements: 4.6, 4.7_

- [x] 4. Refactor lib/products.ts with server-side cached functions

- [x] 4.1 Create getProducts function with caching and pagination

  - Import `cache` from 'react' and `createClient` from './supabase-admin'
  - Add `import 'server-only'` at top of file
  - Create `getProducts(filters: ProductFilters)` function wrapped in `cache()`

  - Implement pagination with `.range(offset, limit)`
  - Apply filters for space, subcategory, price_min, price_max
  - Select only required columns (id, name, slug, price, images, in_stock, category, space, subcategory)
  - Return `{ products, totalCount, page, totalPages }`
  - Add comprehensive error logging (no silent fallbacks)
  - _Requirements: 1.1, 1.4, 1.5, 1.6, 2.2, 3.1, 3.4, 3.5, 3.6, 3.7, 3.8, 4.5_

- [x] 4.2 Create getProductBySlug function with unstable_cache

  - Import `unstable_cache` from 'next/cache'
  - Create `getProductBySlug(slug: string)` wrapped in `unstable_cache()`
  - Set cache key as `['product-by-slug']` and tags as `['products']`
  - Set revalidate to 180 seconds
  - Select all product fields with space and subcategory relations
  - Return single product or null if not found
  - _Requirements: 1.2, 1.4, 1.5, 2.1, 2.2, 2.3_

- [x] 4.3 Update searchProducts function for server-side execution

  - Wrap existing `searchProducts` function in `cache()`

  - Use admin client instead of browser client
  - Keep `.or()` clause for multi-field search
  - Limit to 10 results
  - Remove fallback data logic - return empty array on error
  - _Requirements: 1.1, 1.4, 1.6_

- [x] 4.4 Remove all fallback data references

  - Remove `import` statements for `fallbackProducts`
  - Delete `data/products-fallback.json` file
  - Remove all conditional logic that checks `isSupabaseConfigured()`
  - Remove all fallback return statements
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 5. Refactor app/products/page.tsx to server component

- [x] 5.1 Convert to server component and add ISR

  - Remove `"use client"` directive from top of file
  - Add `export const revalidate = 180` for 3-minute ISR
  - Change component to async function
  - Add `searchParams` prop with proper TypeScript interface
  - _Requirements: 1.1, 1.3, 2.1_

- [x] 5.2 Implement server-side data fetching with filters

  - Parse searchParams for page, space, subcategory, price_min, price_max
  - Call `await getProducts(filters)` to fetch data server-side
  - Destructure `{ products, totalCount, page, totalPages }`
  - Pass products as props to client components
  - _Requirements: 1.1, 1.5, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 5.3 Add generateMetadata function for SEO

  - Export async `generateMetadata({ searchParams })` function
  - Generate dynamic title based on space or subcategory filters
  - Add description for SEO
  - _Requirements: 8.1, 8.2, 8.5_

- [x] 5.4 Update component JSX to use server-fetched data

  - Remove any client-side useEffect data fetching
  - Pass `products` prop to `<ProductGrid>`
  - Pass pagination props to `<Pagination>` component
  - Wrap ProductGrid in `<Suspense>` with ProductSkeleton fallback
  - Display totalCount in results summary
  - _Requirements: 1.5, 3.8, 10.1_

- [x] 6. Refactor app/products/[slug]/page.tsx to server component

- [x] 6.1 Convert to server component with ISR

  - Remove `"use client"` directive
  - Add `export const revalidate = 180`
  - Change component to async function
  - Add `params` prop with slug parameter
  - _Requirements: 1.2, 1.3, 2.1_

- [x] 6.2 Implement server-side product fetching

  - Call `await getProductBySlug(params.slug)`
  - Handle null case with `notFound()` from 'next/navigation'
  - Pass product data as props to client components
  - _Requirements: 1.2, 1.5_

- [x] 6.3 Add generateMetadata for product SEO

  - Export async `generateMetadata({ params })` function
  - Fetch product data
  - Return metadata with title, description, and openGraph image
  - Handle null case with default metadata
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 6.4 Add error handling with error.tsx

  - Create `app/products/[slug]/error.tsx` file
  - Implement error boundary with reset functionality
  - Display user-friendly error message
  - _Requirements: 10.5_

- [x] 7. Update ProductFilters component for URL-based filtering

- [x] 7.1 Refactor to use URL parameters instead of local state

  - Keep `"use client"` directive (this component needs interactivity)
  - Import `useRouter` and `useSearchParams` from 'next/navigation'
  - Read current filters from searchParams
  - Update `updateFilters` function to modify URL params
  - Reset to page 1 when filters change
  - _Requirements: 3.2, 3.9_

- [x] 7.2 Preserve existing filters when updating

  - Use `URLSearchParams` to maintain all current params
  - Only update the changed filter parameter
  - Keep space, subcategory, and price filters in sync
  - _Requirements: 3.9_

- [x] 8. Create URL-based Pagination component

- [x] 8.1 Create components/products/Pagination.tsx

  - Mark as `"use client"` component
  - Accept props: currentPage, totalPages, baseUrl, searchParams
  - Import `useRouter` from 'next/navigation'
  - _Requirements: 3.2_

- [x] 8.2 Implement page navigation with URL updates

  - Create `createPageUrl` function that builds URL with page param
  - Preserve all existing searchParams when changing page
  - Implement Previous/Next buttons with disabled states
  - Render page number buttons (consider showing max 5-7 pages)
  - Use router.push() to navigate to new URL
  - _Requirements: 3.2, 3.3, 3.9_

- [x] 9. Optimize images with Next.js Image component

- [x] 9.1 Configure next.config.js for image optimization

  - Add `images` configuration object
  - Add Supabase domain to `remotePatterns`
  - Configure `deviceSizes` and `imageSizes` arrays
  - Set `formats` to ['image/webp', 'image/avif']
  - _Requirements: 6.1, 6.5_

- [x] 9.2 Update ProductCard to use Next.js Image

  - Replace `<img>` with `<Image>` from 'next/image'
  - Add `fill` prop for responsive container
  - Add `sizes` prop for responsive loading
  - Add `placeholder="blur"` and generate blurDataURL
  - Add `className="object-cover"` for proper aspect ratio

  - _Requirements: 6.1, 6.6, 6.7_

- [x] 9.3 Update ProductImageGallery to use Next.js Image

  - Replace all `<img>` tags with `<Image>` component
  - Add proper width/height or fill props
  - Add sizes attribute for responsive images
  - Add lazy loading for gallery thumbnails
  - _Requirements: 6.1, 6.6_

- [ ]\* 9.4 Create custom image loader for CDN (optional)

  - Create `lib/image-loader.ts` file
  - Implement custom loader function with width and quality params
  - Update next.config.js to use custom loader
  - Test with Cloudflare or BunnyCDN if available
  - _Requirements: 6.3, 6.4, 6.8_

- [x] 10. Create revalidation webhook endpoint

- [x] 10.1 Create app/api/revalidate-products/route.ts

  - Export async POST function
  - Validate webhook secret from Authorization header
  - Parse request body for type, record, and old_record
  - _Requirements: 5.5, 5.7_

- [x] 10.2 Implement revalidation logic

  - Import `revalidatePath` and `revalidateTag` from 'next/cache'
  - Call `revalidatePath('/products')` for all product changes
  - Call `revalidatePath(\`/products/${record.slug}\`)` for specific product
  - Handle slug changes by revalidating old slug too
  - Revalidate home page if featured products changed
  - _Requirements: 5.1, 5.2, 5.3, 5.6, 2.6_

- [x] 10.3 Add error handling and logging

  - Wrap logic in try-catch block
  - Log revalidation events with timestamp
  - Return appropriate status codes (401 for unauthorized, 500 for errors)
  - Return success response with timestamp
  - _Requirements: 5.5_

- [x] 11. Integrate revalidation into admin product actions

- [x] 11.1 Add revalidation call to admin product create

  - In admin product creation success handler
  - Call `/api/revalidate-products` with POST request
  - Include Authorization header with webhook secret
  - Pass product data in request body with type: 'INSERT'
  - _Requirements: 5.1, 5.4_

- [x] 11.2 Add revalidation call to admin product update

  - In admin product update success handler
  - Call `/api/revalidate-products` with POST request
  - Pass both new record and old_record for slug change handling
  - Include type: 'UPDATE' in body
  - _Requirements: 5.2, 5.4_

- [x] 11.3 Add revalidation call to admin product delete

  - In admin product deletion success handler
  - Call `/api/revalidate-products` with POST request
  - Pass deleted product data with type: 'DELETE'
  - _Requirements: 5.3, 5.4_

- [ ]\* 11.4 Add optimistic UI updates (optional)

  - Implement optimistic updates in admin UI before server response
  - Revert changes if server request fails
  - Show loading states during operations
  - _Requirements: 11.1, 11.2_

- [x] 12. Update SearchModal to use server-side search

- [x] 12.1 Create server action for search

  - Create `app/actions/search.ts` file
  - Mark with `'use server'` directive
  - Export async function that calls `searchProducts(query)`
  - Return serializable product data
  - _Requirements: 1.1, 1.4_

- [x] 12.2 Update SearchModal to call server action

  - Import search action from `@/app/actions/search`

  - Replace direct `searchProducts` call with server action
  - Keep debouncing logic (300ms)
  - Handle loading and error states
  - _Requirements: 1.5_

- [x] 13. Add loading states and skeletons

- [x] 13.1 Create ProductSkeleton component

  - Create `components/ui/ProductSkeleton.tsx`
  - Accept `count` prop for number of skeletons
  - Render grid of skeleton cards matching ProductCard layout
  - Use shimmer animation for loading effect
  - _Requirements: 10.1, 10.4_

- [x] 13.2 Add loading.tsx for products page

  - Create `app/products/loading.tsx`
  - Render ProductSkeleton with appropriate count
  - Match layout of actual products page
  - _Requirements: 10.1, 10.3_

- [x] 13.3 Add loading.tsx for product detail page

  - Create `app/products/[slug]/loading.tsx`
  - Create skeleton for product detail layout
  - Include image gallery and details skeletons
  - _Requirements: 10.1, 10.3_

- [x] 14. Configure environment variables and security


- [x] 14.1 Verify environment variables in .env.local


  - Ensure `NEXT_PUBLIC_SUPABASE_URL` is set
  - Ensure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
  - Ensure `SUPABASE_SERVICE_ROLE_KEY` is set (server-only)
  - Add `SUPABASE_WEBHOOK_SECRET` with secure random string
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 14.2 Document environment variables for deployment



  - Create or update `.env.example` file
  - List all required environment variables
  - Add comments explaining each variable
  - Note which variables are server-only
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ]\* 15. Configure Supabase webhook (optional - can be done post-deployment)

  - Log into Supabase dashboard
  - Navigate to Database → Webhooks
  - Create webhook for products table
  - Set URL to `https://yourdomain.com/api/revalidate-products`
  - Add Authorization header with webhook secret
  - Enable for INSERT, UPDATE, DELETE events
  - Test webhook with sample product update
  - _Requirements: 5.7, 5.8_

- [x] 16. Performance testing and optimization







  - Test products page load time (target < 2s)
  - Test pagination performance with large datasets
  - Test filter combinations for query speed
  - Verify image loading is optimized
  - Check cache hit rates
  - Monitor Supabase query performance
  - _Requirements: 2.4, 2.5_

- [x] 17. Final testing and validation






- [x] 17.1 Test products listing page

  - Verify real database products load (no fallback data)
  - Test pagination navigation
  - Test space filter
  - Test subcategory filter
  - Test price range filter
  - Test filter combinations
  - Verify URL updates correctly
  - Test on mobile and desktop
  - _Requirements: 1.1, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.9_


- [x] 17.2 Test product detail pages


  - Navigate to multiple product pages
  - Verify correct product data loads
  - Test 404 handling for invalid slugs
  - Verify images load optimized
  - Test related products section
  - Check metadata in page source
  - _Requirements: 1.2, 8.1, 8.2, 8.3_


- [x] 17.3 Test admin revalidation workflow


  - Create a new product in admin panel
  - Verify it appears on products page within 3 minutes
  - Update a product and check changes reflect
  - Delete a product and verify removal
  - Test revalidation webhook endpoint directly
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 2.6_


- [x] 17.4 Test search functionality


  - Open search modal
  - Type various search queries
  - Verify real-time results appear
  - Test with no results
  - Verify navigation to product pages works
  - _Requirements: 1.1, 1.5_


- [x] 17.5 Test error handling


  - Simulate Supabase connection error
  - Verify error boundary displays
  - Test invalid product slug (404)
  - Test unauthorized webhook access
  - _Requirements: 1.6, 10.5_
