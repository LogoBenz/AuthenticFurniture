-- Create stock_adjustments table for audit trail
CREATE TABLE IF NOT EXISTS stock_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  adjustment_type VARCHAR(10) NOT NULL CHECK (adjustment_type IN ('add', 'remove', 'set')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  previous_quantity INTEGER NOT NULL CHECK (previous_quantity >= 0),
  new_quantity INTEGER NOT NULL CHECK (new_quantity >= 0),
  reason VARCHAR(100) NOT NULL,
  notes TEXT,
  adjusted_by VARCHAR(100) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stock_adjustments_warehouse_id ON stock_adjustments(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_stock_adjustments_product_id ON stock_adjustments(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_adjustments_created_at ON stock_adjustments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stock_adjustments_type ON stock_adjustments(adjustment_type);

-- Enable RLS
ALTER TABLE stock_adjustments ENABLE ROW LEVEL SECURITY;

-- Create policies for stock_adjustments
CREATE POLICY "stock_adjustments_select_authenticated" ON stock_adjustments FOR SELECT TO authenticated USING (true);
CREATE POLICY "stock_adjustments_insert_authenticated" ON stock_adjustments FOR INSERT TO authenticated WITH CHECK (true);

-- Create function to validate stock adjustments
CREATE OR REPLACE FUNCTION validate_stock_adjustment()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure new_quantity is calculated correctly
  IF NEW.adjustment_type = 'add' THEN
    NEW.new_quantity := NEW.previous_quantity + NEW.quantity;
  ELSIF NEW.adjustment_type = 'remove' THEN
    NEW.new_quantity := NEW.previous_quantity - NEW.quantity;
    IF NEW.new_quantity < 0 THEN
      RAISE EXCEPTION 'Cannot remove more stock than available';
    END IF;
  ELSIF NEW.adjustment_type = 'set' THEN
    NEW.new_quantity := NEW.quantity;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate adjustments
CREATE TRIGGER validate_stock_adjustment_trigger
  BEFORE INSERT ON stock_adjustments
  FOR EACH ROW
  EXECUTE FUNCTION validate_stock_adjustment();

-- Create function to get stock adjustment summary
CREATE OR REPLACE FUNCTION get_stock_adjustment_summary(
  warehouse_id_param UUID DEFAULT NULL,
  product_id_param BIGINT DEFAULT NULL,
  days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
  total_adjustments BIGINT,
  total_added BIGINT,
  total_removed BIGINT,
  net_change BIGINT,
  most_common_reason VARCHAR(100)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_adjustments,
    COALESCE(SUM(CASE WHEN sa.adjustment_type = 'add' THEN sa.quantity ELSE 0 END), 0) as total_added,
    COALESCE(SUM(CASE WHEN sa.adjustment_type = 'remove' THEN sa.quantity ELSE 0 END), 0) as total_removed,
    COALESCE(SUM(CASE WHEN sa.adjustment_type = 'add' THEN sa.quantity ELSE -sa.quantity END), 0) as net_change,
    (SELECT sa2.reason 
     FROM stock_adjustments sa2 
     WHERE (warehouse_id_param IS NULL OR sa2.warehouse_id = warehouse_id_param)
       AND (product_id_param IS NULL OR sa2.product_id = product_id_param)
       AND sa2.created_at >= NOW() - INTERVAL '1 day' * days_back
     GROUP BY sa2.reason 
     ORDER BY COUNT(*) DESC 
     LIMIT 1) as most_common_reason
  FROM stock_adjustments sa
  WHERE (warehouse_id_param IS NULL OR sa.warehouse_id = warehouse_id_param)
    AND (product_id_param IS NULL OR sa.product_id = product_id_param)
    AND sa.created_at >= NOW() - INTERVAL '1 day' * days_back;
END;
$$ LANGUAGE plpgsql;
