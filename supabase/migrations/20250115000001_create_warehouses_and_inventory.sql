-- Create warehouses table
CREATE TABLE IF NOT EXISTS warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  address TEXT,
  contact_phone VARCHAR(20),
  contact_email VARCHAR(100),
  map_link TEXT,
  capacity INTEGER,
  notes TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create warehouse_products junction table for inventory
CREATE TABLE IF NOT EXISTS warehouse_products (
  warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  reserved_quantity INTEGER DEFAULT 0 CHECK (reserved_quantity >= 0),
  reorder_level INTEGER DEFAULT 0 CHECK (reorder_level >= 0),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (warehouse_id, product_id)
);

-- Enable RLS
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_products ENABLE ROW LEVEL SECURITY;

-- Create policies for warehouses
CREATE POLICY "warehouses_select_public" ON warehouses FOR SELECT TO public USING (is_available = true);
CREATE POLICY "warehouses_manage_admin" ON warehouses FOR ALL TO authenticated USING (true);

-- Create policies for warehouse_products
CREATE POLICY "warehouse_products_select_public" ON warehouse_products FOR SELECT TO public USING (true);
CREATE POLICY "warehouse_products_manage_admin" ON warehouse_products FOR ALL TO authenticated USING (true);

-- Create function to update warehouse_products updated_at
CREATE OR REPLACE FUNCTION update_warehouse_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for warehouse_products
CREATE TRIGGER update_warehouse_products_updated_at
  BEFORE UPDATE ON warehouse_products
  FOR EACH ROW
  EXECUTE FUNCTION update_warehouse_products_updated_at();

-- Insert default warehouses
INSERT INTO warehouses (name, state, address, contact_phone, contact_email, is_available) VALUES
('Main Warehouse', 'Lagos', 'No. 22b, Sunny Bus Stop, Olojo Drive, Alaba International Market, Ojo, Lagos, Nigeria', '090377725829', 'authenticfurnituresltd@gmail.com', true),
('Lagos Showroom', 'Lagos', 'No. 22b, Sunny Bus Stop, Olojo Drive, Alaba International Market, Ojo, Lagos, Nigeria', '090377725829', 'authenticfurnituresltd@gmail.com', true),
('Abuja Branch', 'Abuja', 'Plot 123, Central Business District, Abuja, Nigeria', '090377725829', 'authenticfurnituresltd@gmail.com', true)
ON CONFLICT DO NOTHING;

-- Create function to get total inventory for a product
CREATE OR REPLACE FUNCTION get_product_total_inventory(product_id_param BIGINT)
RETURNS TABLE (
  total_stock INTEGER,
  total_reserved INTEGER,
  available_stock INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(wp.stock_quantity), 0)::INTEGER as total_stock,
    COALESCE(SUM(wp.reserved_quantity), 0)::INTEGER as total_reserved,
    COALESCE(SUM(wp.stock_quantity - wp.reserved_quantity), 0)::INTEGER as available_stock
  FROM warehouse_products wp
  WHERE wp.product_id = product_id_param;
END;
$$ LANGUAGE plpgsql;

-- Create function to update product stock when warehouse stock changes
CREATE OR REPLACE FUNCTION update_product_stock_status()
RETURNS TRIGGER AS $$
DECLARE
  total_available INTEGER;
BEGIN
  -- Get total available stock for this product
  SELECT COALESCE(SUM(stock_quantity - reserved_quantity), 0) INTO total_available
  FROM warehouse_products
  WHERE product_id = NEW.product_id;
  
  -- Update product in_stock status
  UPDATE products 
  SET in_stock = (total_available > 0),
      updated_at = NOW()
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update product stock status
CREATE TRIGGER update_product_stock_trigger
  AFTER INSERT OR UPDATE OR DELETE ON warehouse_products
  FOR EACH ROW
  EXECUTE FUNCTION update_product_stock_status();

-- Initialize inventory for existing products
INSERT INTO warehouse_products (warehouse_id, product_id, stock_quantity, reorder_level)
SELECT 
  w.id,
  p.id,
  CASE 
    WHEN p.is_featured THEN 50
    ELSE 25
  END,
  10
FROM warehouses w
CROSS JOIN products p
WHERE w.name = 'Main Warehouse'
ON CONFLICT (warehouse_id, product_id) DO NOTHING;
