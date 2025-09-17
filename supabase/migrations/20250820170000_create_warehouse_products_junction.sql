-- Create warehouse_products junction table for multi-warehouse stock management
-- This table links products to warehouses with stock quantities

-- First, let's check the products table structure to ensure compatibility
-- Run this query first to check products.id type:
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'products' AND table_schema = 'public'
-- ORDER BY ordinal_position;

-- Create the junction table (assuming products.id is UUID based on previous feedback)
CREATE TABLE IF NOT EXISTS public.warehouse_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER DEFAULT 0,
  reorder_level INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique combination of warehouse and product
  UNIQUE(warehouse_id, product_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_warehouse_products_warehouse_id ON public.warehouse_products(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_products_product_id ON public.warehouse_products(product_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_products_stock ON public.warehouse_products(stock_quantity);

-- Enable RLS
ALTER TABLE public.warehouse_products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow authenticated users to view warehouse products" ON public.warehouse_products
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert warehouse products" ON public.warehouse_products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update warehouse products" ON public.warehouse_products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete warehouse products" ON public.warehouse_products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_warehouse_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_warehouse_products_updated_at
  BEFORE UPDATE ON public.warehouse_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_warehouse_products_updated_at();

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
