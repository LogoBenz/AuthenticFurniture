# Performance Testing Guide

This guide covers performance testing and optimization for the Production SSR Refactor.

## Overview

Performance testing ensures that the application meets the target load time of **< 2 seconds** for all pages and handles concurrent requests efficiently.

## Testing Scripts

### 1. Performance Test Suite (`scripts/performance-test.js`)

Comprehensive end-to-end performance testing covering:

- **Products page load time** - Target < 2s
- **Pagination performance** - Multiple pages tested
- **Filter combinations** - Space, subcategory, price filters
- **Product detail pages** - Individual product load times
- **Cache hit rates** - ISR caching effectiveness
- **Image optimization** - Next.js Image component usage
- **Response headers** - Cache-Control and Next.js cache headers
- **Concurrent requests** - Load handling under concurrent access

#### Usage

```bash
# Make sure your dev server is running
npm run dev

# In another terminal, run the performance tests
node scripts/performance-test.js
```

#### Configuration

Set the base URL via environment variable:

```bash
# Test against local development
NEXT_PUBLIC_SITE_URL=http://localhost:3000 node scripts/performance-test.js

# Test against production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com node scripts/performance-test.js
```

#### Output

The script generates:
- Console output with color-coded results
- JSON file with detailed results: `performance-test-results-[timestamp].json`

### 2. Query Performance Monitor (`scripts/monitor-query-performance.js`)

Database-level performance testing for Supabase queries:

- **Product queries** - Various query patterns
- **Index effectiveness** - Tests indexed columns
- **Pagination performance** - Deep pagination testing
- **Database statistics** - Product counts and data distribution

#### Usage

```bash
node scripts/monitor-query-performance.js
```

#### Requirements

Requires `.env.local` with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Performance Targets

### Page Load Times
- **Products listing page**: < 2 seconds
- **Product detail page**: < 2 seconds
- **Filtered results**: < 2 seconds
- **Paginated pages**: < 2 seconds

### Query Performance
- **Simple queries**: < 200ms
- **Queries with relations**: < 500ms
- **Search queries**: < 300ms
- **Count queries**: < 100ms

### Cache Performance
- **Cache hit rate**: > 50% after warm-up
- **Cache revalidation**: Within 3 minutes (180s)

### Image Optimization
- **Next.js Image component**: 100% usage
- **Lazy loading**: Enabled for all images
- **Responsive images**: srcset for all images
- **Modern formats**: WebP/AVIF support

## Testing Checklist

### Before Testing

- [ ] Development server is running (`npm run dev`)
- [ ] Database has sufficient test data (at least 50+ products)
- [ ] Environment variables are configured
- [ ] Database indexes are created (Task 2)
- [ ] RLS policies are configured (Task 3)

### Manual Testing

#### 1. Products Page Load Time

1. Open browser DevTools (F12)
2. Go to Network tab
3. Navigate to `/products`
4. Check "Load" time in Network tab
5. Verify: < 2 seconds

#### 2. Pagination Performance

1. Navigate through multiple pages: `/products?page=1`, `/products?page=2`, etc.
2. Measure load time for each page
3. Verify: Consistent performance across pages

#### 3. Filter Combinations

Test these filter combinations:
- Space filter: `/products?space=office`
- Subcategory filter: `/products?subcategory=office-chairs`
- Price range: `/products?price_min=10000&price_max=50000`
- Combined: `/products?space=office&subcategory=office-chairs&price_min=10000`

Verify: All load in < 2 seconds

#### 4. Image Loading

1. Open `/products` page
2. Check Network tab for image requests
3. Verify:
   - Images use `/_next/image` endpoint
   - Images have `loading="lazy"` attribute
   - Images are served in WebP format (if supported)
   - Images have appropriate sizes

#### 5. Cache Hit Rates

1. Visit `/products` page (first load - cache miss)
2. Refresh page multiple times
3. Check response headers for `X-NextJS-Cache: HIT`
4. Verify: Cache hits after first load

#### 6. Concurrent Requests

1. Open multiple browser tabs
2. Navigate to different product pages simultaneously
3. Verify: All pages load without errors or significant slowdown

### Automated Testing

Run the automated test suites:

```bash
# Full performance test suite
node scripts/performance-test.js

# Query performance monitoring
node scripts/monitor-query-performance.js
```

## Optimization Strategies

### If Products Page is Slow (> 2s)

1. **Check database indexes**
   ```bash
   node scripts/run-index-migration.js
   ```

2. **Reduce initial data fetch**
   - Decrease page size (currently 12 items)
   - Select only required columns
   - Remove unnecessary relations

3. **Verify caching is working**
   - Check `revalidate = 180` in page.tsx
   - Verify `cache()` wrapper in lib/products.ts

### If Pagination is Slow

1. **Check offset performance**
   - Large offsets can be slow
   - Consider cursor-based pagination for deep pages

2. **Verify indexes on sorted columns**
   - Add index on `created_at` if sorting by date
   - Add composite indexes for common sorts

### If Filters are Slow

1. **Add composite indexes**
   ```sql
   CREATE INDEX idx_products_space_subcategory ON products (space, subcategory);
   CREATE INDEX idx_products_space_price ON products (space, price);
   ```

2. **Optimize filter queries**
   - Use indexed columns in WHERE clauses
   - Avoid OR conditions when possible

### If Images are Slow

1. **Verify Next.js Image configuration**
   - Check `next.config.js` has proper `remotePatterns`
   - Verify `deviceSizes` and `imageSizes` are configured

2. **Consider CDN**
   - Set up Cloudflare or BunnyCDN
   - Configure custom image loader

3. **Optimize image sizes**
   - Ensure source images aren't too large
   - Use appropriate quality settings (75-80)

### If Cache Hit Rate is Low

1. **Verify ISR configuration**
   - Check `export const revalidate = 180` in pages
   - Verify `unstable_cache` configuration

2. **Check revalidation webhook**
   - Ensure webhook isn't triggering too frequently
   - Verify webhook secret is correct

3. **Monitor cache behavior**
   - Check Next.js cache headers
   - Review revalidation logs

## Performance Monitoring in Production

### Metrics to Track

1. **Page Load Times**
   - Use Real User Monitoring (RUM)
   - Track P50, P95, P99 percentiles

2. **Database Query Times**
   - Monitor Supabase dashboard
   - Set up alerts for slow queries

3. **Cache Hit Rates**
   - Track via Next.js analytics
   - Monitor CDN cache rates

4. **Error Rates**
   - Track 500 errors
   - Monitor timeout errors

### Tools

- **Vercel Analytics** (if deployed on Vercel)
- **Google Lighthouse** - Regular audits
- **WebPageTest** - Detailed performance analysis
- **Supabase Dashboard** - Query performance
- **New Relic / Datadog** - APM monitoring

## Troubleshooting

### High Load Times

1. Check database connection
2. Verify indexes are created
3. Review query complexity
4. Check server resources

### Cache Not Working

1. Verify `revalidate` is set
2. Check cache headers in response
3. Review revalidation webhook logs
4. Ensure no `no-cache` headers

### Images Not Optimized

1. Check Next.js Image component usage
2. Verify `next.config.js` configuration
3. Check browser DevTools for image formats
4. Review image sizes and quality

### Slow Queries

1. Run `EXPLAIN ANALYZE` on slow queries
2. Add missing indexes
3. Optimize query structure
4. Consider denormalization for complex joins

## Results Interpretation

### Good Performance Indicators

- ✅ All pages load in < 2s
- ✅ Cache hit rate > 50%
- ✅ Query times < 500ms
- ✅ Images use Next.js Image component
- ✅ No console errors

### Warning Signs

- ⚠️ Pages load in 2-3s (acceptable but could be better)
- ⚠️ Cache hit rate 30-50% (needs investigation)
- ⚠️ Some queries > 500ms (optimize specific queries)

### Critical Issues

- ❌ Pages load in > 3s (requires immediate optimization)
- ❌ Cache hit rate < 30% (caching not working)
- ❌ Queries > 1s (database optimization needed)
- ❌ Images not using Next.js Image (missing optimization)

## Next Steps After Testing

1. **Document Results**
   - Save test results JSON files
   - Note any performance issues
   - Create optimization tickets

2. **Implement Optimizations**
   - Address critical issues first
   - Implement recommended optimizations
   - Re-test after changes

3. **Set Up Monitoring**
   - Configure production monitoring
   - Set up alerts for performance degradation
   - Schedule regular performance audits

4. **Continuous Improvement**
   - Review performance metrics weekly
   - Optimize based on real user data
   - Keep dependencies updated

## References

- [Next.js Performance Documentation](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Supabase Performance Tips](https://supabase.com/docs/guides/database/performance)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Performance Scoring](https://web.dev/performance-scoring/)
