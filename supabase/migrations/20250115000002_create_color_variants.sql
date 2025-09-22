-- Create color options table
CREATE TABLE IF NOT EXISTS color_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  hex_code VARCHAR(7) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  color_id UUID REFERENCES color_options(id) ON DELETE CASCADE,
  color_name VARCHAR(50) NOT NULL,
  color_hex VARCHAR(7) NOT NULL,
  images JSONB DEFAULT '[]', -- Array of image URLs for this color
  price DECIMAL(10,2), -- Optional different price for this variant
  sku VARCHAR(100) UNIQUE,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, color_id)
);

-- Enable RLS
ALTER TABLE color_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Create policies for color_options
CREATE POLICY "color_options_select_public" ON color_options FOR SELECT TO public USING (true);
CREATE POLICY "color_options_manage_admin" ON color_options FOR ALL TO authenticated USING (true);

-- Create policies for product_variants
CREATE POLICY "product_variants_select_public" ON product_variants FOR SELECT TO public USING (is_available = true);
CREATE POLICY "product_variants_manage_admin" ON product_variants FOR ALL TO authenticated USING (true);

-- Create function to update product_variants updated_at
CREATE OR REPLACE FUNCTION update_product_variants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for product_variants
CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW
  EXECUTE FUNCTION update_product_variants_updated_at();

-- Insert default color options
INSERT INTO color_options (name, hex_code, display_order) VALUES
('Black', '#000000', 1),
('White', '#FFFFFF', 2),
('Brown', '#8B4513', 3),
('Gray', '#808080', 4),
('Navy', '#000080', 5),
('Beige', '#F5F5DC', 6),
('Green', '#008000', 7),
('Red', '#FF0000', 8),
('Blue', '#0000FF', 9),
('Yellow', '#FFFF00', 10),
('Purple', '#800080', 11),
('Orange', '#FFA500', 12)
ON CONFLICT (name) DO NOTHING;

-- Create function to get product variants with color info
CREATE OR REPLACE FUNCTION get_product_variants(product_id_param BIGINT)
RETURNS TABLE (
  id UUID,
  product_id BIGINT,
  color_id UUID,
  color_name VARCHAR(50),
  color_hex VARCHAR(7),
  images JSONB,
  price DECIMAL(10,2),
  sku VARCHAR(100),
  is_available BOOLEAN,
  display_order INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pv.id,
    pv.product_id,
    pv.color_id,
    pv.color_name,
    pv.color_hex,
    pv.images,
    pv.price,
    pv.sku,
    pv.is_available,
    pv.display_order
  FROM product_variants pv
  WHERE pv.product_id = product_id_param
  ORDER BY pv.display_order, pv.color_name;
END;
$$ LANGUAGE plpgsql;

-- Create function to get available colors for a product
CREATE OR REPLACE FUNCTION get_product_available_colors(product_id_param BIGINT)
RETURNS TABLE (
  color_id UUID,
  color_name VARCHAR(50),
  color_hex VARCHAR(7),
  variant_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    co.id,
    co.name,
    co.hex_code,
    COUNT(pv.id)::INTEGER as variant_count
  FROM color_options co
  LEFT JOIN product_variants pv ON co.id = pv.color_id AND pv.product_id = product_id_param AND pv.is_available = true
  GROUP BY co.id, co.name, co.hex_code
  HAVING COUNT(pv.id) > 0
  ORDER BY co.display_order, co.name;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_color_id ON product_variants(color_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_available ON product_variants(is_available);
CREATE INDEX IF NOT EXISTS idx_color_options_display_order ON color_options(display_order);
