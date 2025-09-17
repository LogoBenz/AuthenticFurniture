-- Junction table: warehouse_products
CREATE TABLE IF NOT EXISTS public.warehouse_products (
  warehouse_id uuid NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  stock_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (warehouse_id, product_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_wp_warehouse ON public.warehouse_products(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_wp_product ON public.warehouse_products(product_id);

-- Triggers
CREATE OR REPLACE FUNCTION update_wp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_wp_updated_at BEFORE UPDATE ON public.warehouse_products
FOR EACH ROW EXECUTE FUNCTION update_wp_updated_at();

-- RLS
ALTER TABLE public.warehouse_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow select on warehouse_products" ON public.warehouse_products FOR SELECT USING (true);
CREATE POLICY "Allow write for authenticated" ON public.warehouse_products FOR ALL USING (auth.role() = 'authenticated');

-- Notify PostgREST to reload
NOTIFY pgrst, 'reload schema';

