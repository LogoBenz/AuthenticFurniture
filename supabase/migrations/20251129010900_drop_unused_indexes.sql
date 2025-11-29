-- Drop only truly unnecessary unused indexes
-- These are redundant or genuinely unlikely to be needed
-- Keeping indexes that are likely needed for core app functionality

-- KEEPING: Most product indexes (needed for filtering, sorting, search)
-- KEEPING: Foreign key indexes (needed for joins)
-- KEEPING: Customer/order relationship indexes (needed for user dashboards)

-- Blog-related indexes (only if blog is not heavily used)
-- Uncomment these only if you're sure the blog feature is deprecated/minimal
-- DROP INDEX IF EXISTS public.idx_blog_likes_post_id;
-- DROP INDEX IF EXISTS public.idx_blog_posts_category;
-- DROP INDEX IF EXISTS public.idx_blog_posts_created_at;
-- DROP INDEX IF EXISTS public.idx_blog_posts_featured;
-- DROP INDEX IF EXISTS public.idx_blog_posts_published;

-- Delivery/Driver indexes (only if delivery feature is not implemented yet)
-- DROP INDEX IF EXISTS public.idx_deliveries_customer_id;
-- DROP INDEX IF EXISTS public.idx_deliveries_driver_id;
-- DROP INDEX IF EXISTS public.idx_deliveries_zone_id;
-- DROP INDEX IF EXISTS public.idx_drivers_current_zone_id;

-- Warehouse indexes (only if multi-warehouse feature is not active)
-- DROP INDEX IF EXISTS public.idx_warehouse_products_product_id;
-- DROP INDEX IF EXISTS public.idx_warehouses_available;
-- DROP INDEX IF EXISTS public.idx_warehouses_state;
-- DROP INDEX IF EXISTS public.idx_stock_adjustments_created_at;
-- DROP INDEX IF EXISTS public.idx_stock_adjustments_product_id;
-- DROP INDEX IF EXISTS public.idx_stock_adjustments_type;
-- DROP INDEX IF EXISTS public.idx_stock_adjustments_warehouse_id;

-- These might be genuinely safe to drop (review carefully):
-- Duplicate/redundant indexes on display_order and sort_order
DROP INDEX IF EXISTS public.idx_color_options_display_order;
DROP INDEX IF EXISTS public.idx_spaces_sort_order;
DROP INDEX IF EXISTS public.idx_subcategories_sort_order;

-- Categories popularity index (if not used in queries)
DROP INDEX IF EXISTS public.categories_is_popular_idx;

/**
 * RECOMMENDATION: Monitor query performance for 1-2 weeks before dropping more indexes.
 * 
 * To identify truly unused indexes after getting production traffic:
 * 
 * SELECT
 *   schemaname,
 *   tablename,
 *   indexname,
 *   idx_scan,
 *   pg_size_pretty(pg_relation_size(indexrelid)) as index_size
 * FROM pg_stat_user_indexes
 * WHERE schemaname = 'public'
 *   AND idx_scan = 0
 * ORDER BY pg_relation_size(indexrelid) DESC;
 * 
 * Focus on dropping:
 * 1. Large indexes (save the most storage)
 * 2. Indexes with idx_scan = 0 after significant production traffic
 * 3. Indexes on deprecated features
 */
