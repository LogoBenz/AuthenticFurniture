-- Add product_type column to products table
-- This allows products to be further categorized within a subcategory
-- Example: Office Tables (subcategory) -> Executive Tables, Electric Desks, etc. (product types)

ALTER TABLE products
ADD COLUMN IF NOT EXISTS product_type VARCHAR(100);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_product_type ON products(product_type);

-- Add index for combined subcategory and product_type queries
CREATE INDEX IF NOT EXISTS idx_products_subcategory_type ON products(subcategory_id, product_type);

-- Add comment to explain the column
COMMENT ON COLUMN products.product_type IS 'Product type within a subcategory (e.g., Executive Tables, Electric Desks, Reception Tables, Conference Tables, Standard Tables)';

-- Example: Update some existing products with product types
-- UPDATE products SET product_type = 'Executive Tables' WHERE subcategory_id = (SELECT id FROM subcategories WHERE slug = 'office-tables') AND name LIKE '%Executive%';
-- UPDATE products SET product_type = 'Electric Desks' WHERE subcategory_id = (SELECT id FROM subcategories WHERE slug = 'office-tables') AND name LIKE '%Electric%';
-- UPDATE products SET product_type = 'Reception Tables' WHERE subcategory_id = (SELECT id FROM subcategories WHERE slug = 'office-tables') AND name LIKE '%Reception%';
-- UPDATE products SET product_type = 'Conference Tables' WHERE subcategory_id = (SELECT id FROM subcategories WHERE slug = 'office-tables') AND name LIKE '%Conference%';
-- UPDATE products SET product_type = 'Standard Tables' WHERE subcategory_id = (SELECT id FROM subcategories WHERE slug = 'office-tables') AND name LIKE '%Standard%';
