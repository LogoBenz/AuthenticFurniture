-- Fix function search_path mutable warnings
-- Security best practice: Set search_path to public, pg_catalog for all functions

ALTER FUNCTION public.get_product_available_colors(BIGINT) SET search_path = public, pg_catalog;
ALTER FUNCTION public.update_product_stock_status() SET search_path = public, pg_catalog;
ALTER FUNCTION public.update_warehouse_products_updated_at() SET search_path = public, pg_catalog;
ALTER FUNCTION public.get_product_total_inventory(BIGINT) SET search_path = public, pg_catalog;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public, pg_catalog;
ALTER FUNCTION public.generate_slug_from_name() SET search_path = public, pg_catalog;
ALTER FUNCTION public.update_product_variants_updated_at() SET search_path = public, pg_catalog;
ALTER FUNCTION public.get_product_variants(BIGINT) SET search_path = public, pg_catalog;
ALTER FUNCTION public.validate_stock_adjustment() SET search_path = public, pg_catalog;
ALTER FUNCTION public.get_stock_adjustment_summary(UUID, BIGINT, INTEGER) SET search_path = public, pg_catalog;
