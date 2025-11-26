# Requirements Document

## Introduction

This feature transforms the Authentic Furniture e-commerce platform from a client-side rendered application with fallback data to a fully production-ready, server-side rendered application with proper caching, pagination, and image optimization. The current architecture fetches data client-side, causing Supabase queries to fail in the browser and fall back to hardcoded JSON data. This refactor will move all data fetching to the server, implement ISR (Incremental Static Regeneration), add proper caching strategies, optimize image delivery, and ensure admin changes immediately reflect on the live site.

## Requirements

### Requirement 1: Server-Side Data Fetching

**User Story:** As a developer, I want all product data to be fetched server-side using the Supabase admin client, so that users always see real database products instead of fallback data.

#### Acceptance Criteria

1. WHEN the products page loads THEN the system SHALL fetch all product data server-side using SUPABASE_SERVICE_ROLE_KEY
2. WHEN a product detail page loads THEN the system SHALL fetch product data server-side before rendering
3. WHEN any page fetches data THEN the system SHALL NOT use "use client" directive in data-fetching components
4. WHEN Supabase queries execute THEN the system SHALL use the admin client (lib/supabase-admin.ts) for all backend fetching
5. WHEN data is fetched THEN the system SHALL pass pre-fetched data as props to client components
6. WHEN a Supabase error occurs THEN the system SHALL log the error for debugging instead of silently falling back
7. WHEN the application runs THEN the system SHALL NOT expose SUPABASE_SERVICE_ROLE_KEY to the client

### Requirement 2: Caching and Incremental Static Regeneration

**User Story:** As a user, I want product pages to load quickly with up-to-date information, so that I have a fast browsing experience without stale data.

#### Acceptance Criteria

1. WHEN product pages are generated THEN the system SHALL set revalidate = 180 (3 minutes) for ISR
2. WHEN product fetch functions are called THEN the system SHALL wrap them in cache() or unstable_cache()
3. WHEN cached data is used THEN the system SHALL set a 3-minute TTL for up-to-date listings
4. WHEN multiple components request the same data THEN the system SHALL reuse cached results
5. WHEN the cache expires THEN the system SHALL regenerate the page in the background
6. WHEN a product is updated in the admin panel THEN the system SHALL revalidate affected pages within 1-2 minutes

### Requirement 3: Pagination and Filtering

**User Story:** As a user browsing products, I want to navigate through pages and filter by category, space, and price, so that I can find products efficiently.

#### Acceptance Criteria

1. WHEN the products page loads THEN the system SHALL read searchParams.page and default to page 1
2. WHEN pagination controls are clicked THEN the system SHALL update the URL with the new page number
3. WHEN the URL changes THEN the system SHALL trigger a server-side re-fetch with new parameters
4. WHEN filtering by subcategory THEN the system SHALL apply the filter in the Supabase query
5. WHEN filtering by space THEN the system SHALL apply the filter in the Supabase query
6. WHEN filtering by price range THEN the system SHALL apply price_min and price_max filters
7. WHEN fetching paginated data THEN the system SHALL use .range(offset, limit) in Supabase queries
8. WHEN displaying pagination THEN the system SHALL show totalCount for accurate page numbers
9. WHEN filters are applied THEN the system SHALL preserve pagination state in the URL

### Requirement 4: Database Optimization

**User Story:** As a developer, I want optimized database queries with proper indexes, so that product pages load quickly even with large datasets.

#### Acceptance Criteria

1. WHEN the database is configured THEN the system SHALL have an index on products.subcategory
2. WHEN the database is configured THEN the system SHALL have an index on products.space
3. WHEN the database is configured THEN the system SHALL have an index on products.price
4. WHEN the database is configured THEN the system SHALL have an index on products.slug
5. WHEN querying products THEN the system SHALL select only required columns (id, name, price, images, slug, etc.)
6. WHEN anonymous users access products THEN the system SHALL allow public read access via RLS policies
7. WHEN users attempt write operations THEN the system SHALL restrict to authenticated admins only

### Requirement 5: Automatic Incremental Revalidation

**User Story:** As an admin, I want product pages to automatically update when I edit products, so that changes appear on the site within minutes without manual intervention.

#### Acceptance Criteria

1. WHEN a product is inserted in the database THEN the system SHALL trigger revalidation of /products
2. WHEN a product is updated in the database THEN the system SHALL trigger revalidation of /products and /products/[slug]
3. WHEN a product is deleted in the database THEN the system SHALL trigger revalidation of /products
4. WHEN revalidation is triggered from admin CRUD operations THEN the system SHALL call the revalidation webhook automatically
5. WHEN the revalidation webhook is called THEN the system SHALL validate the webhook secret
6. WHEN revalidation is triggered THEN the system SHALL use Next.js revalidatePath() API
7. WHEN the webhook endpoint is configured THEN the system SHALL be accessible at /api/revalidate-products
8. WHEN Supabase triggers fire THEN the system SHALL send POST requests to the webhook endpoint

### Requirement 6: Image Optimization and CDN Delivery (QServers Deployment)

**User Story:** As a user, I want product images to load quickly and responsively on all devices, so that I have a smooth browsing experience.

#### Acceptance Criteria

1. WHEN product images are displayed THEN the system SHALL use the Next.js Image component instead of img tags for lazy-loading, placeholders, and responsive sizing
2. WHEN images are stored THEN the system SHALL use Supabase Storage public buckets for product images
3. WHEN images are requested THEN the system SHALL optionally serve them through a CDN (e.g., Cloudflare, BunnyCDN) to ensure global delivery, caching, and compression
4. WHEN using Image component THEN the system SHALL define a custom loader for Supabase URLs that includes width and quality parameters
5. WHEN images are displayed THEN the system SHALL define deviceSizes and imageSizes in next.config.js to serve appropriate responsive sizes
6. WHEN images load THEN the system SHALL lazy-load all images and use blur placeholders to improve perceived performance
7. WHEN possible THEN the system SHALL serve WebP or AVIF formats via the CDN or Supabase transforms for modern browsers
8. WHEN images are delivered THEN the system SHALL include cache headers or TTLs to reduce repeated requests and improve load times

### Requirement 7: Security and Environment Configuration

**User Story:** As a developer, I want secure environment configuration with proper key management, so that sensitive credentials are never exposed to the client.

#### Acceptance Criteria

1. WHEN the application starts THEN the system SHALL load NEXT_PUBLIC_SUPABASE_URL from environment
2. WHEN the application starts THEN the system SHALL load NEXT_PUBLIC_SUPABASE_ANON_KEY from environment
3. WHEN the application starts THEN the system SHALL load SUPABASE_SERVICE_ROLE_KEY from environment (server-only)
4. WHEN the application starts THEN the system SHALL load SUPABASE_WEBHOOK_SECRET from environment (server-only)
5. WHEN server-only files are created THEN the system SHALL use 'server-only' package to prevent client bundling
6. WHEN environment variables change THEN the system SHALL require server restart
7. WHEN service keys are accessed THEN the system SHALL only be accessible in server components or API routes

### Requirement 8: SEO and Metadata Optimization

**User Story:** As a user sharing product links, I want proper SEO metadata and social previews, so that links display correctly on social media and search engines.

#### Acceptance Criteria

1. WHEN a product detail page loads THEN the system SHALL generate dynamic metadata with product name
2. WHEN a product detail page loads THEN the system SHALL include product description in metadata
3. WHEN a product detail page loads THEN the system SHALL include OpenGraph image from product images
4. WHEN metadata is missing THEN the system SHALL provide sensible defaults
5. WHEN the products listing page loads THEN the system SHALL include appropriate page metadata
6. WHEN pages are crawled THEN the system SHALL provide structured data for search engines

### Requirement 9: Fallback Data Removal

**User Story:** As a developer, I want to completely remove hardcoded fallback data, so that the application only uses real database products.

#### Acceptance Criteria

1. WHEN the refactor is complete THEN the system SHALL remove data/products-fallback.json usage
2. WHEN Supabase is unavailable THEN the system SHALL display appropriate error messages instead of fallback data
3. WHEN components reference fallback data THEN the system SHALL be refactored to use server-fetched data
4. WHEN the application runs THEN the system SHALL not import or use fallbackProducts array

### Requirement 10: Loading States and UX Enhancements

**User Story:** As a user navigating between pages, I want smooth loading transitions, so that I understand the application is working.

#### Acceptance Criteria

1. WHEN pagination is loading THEN the system SHALL display loading skeletons
2. WHEN filters are applied THEN the system SHALL show loading indicators
3. WHEN pages transition THEN the system SHALL provide smooth visual feedback
4. WHEN data is loading THEN the system SHALL maintain layout stability (no content shift)
5. WHEN errors occur THEN the system SHALL display user-friendly error messages

### Requirement 11: Admin Dashboard Enhancements (Optional but Recommended)

**User Story:** As an admin, I want instant feedback when updating products and inventory, so that the dashboard feels responsive.

#### Acceptance Criteria

1. WHEN performing admin CRUD actions THEN the system SHALL optimistically update the UI while server-side revalidation occurs
2. WHEN errors occur in admin actions THEN the system SHALL revert optimistic updates and show error messages
3. WHEN admin performs batch operations (multi-product updates) THEN the system SHALL trigger a single revalidation call for affected products
4. WHEN logging is enabled THEN all admin operations SHALL be tracked for debugging and auditing purposes
