-- Assign product types to Office Chairs based on their names
-- This helps categorize chairs into: Ergonomic, Mesh, Swivel, Guest, and Task Chairs

-- 1. Ergonomic Chairs (ergonomic, comfort, lumbar support)
UPDATE products 
SET product_type = 'Ergonomic Chairs' 
WHERE subcategory_id = (SELECT id FROM subcategories WHERE slug = 'office-chairs') 
AND (
  name ILIKE '%ergonomic%' 
  OR name ILIKE '%lumbar%'
  OR name ILIKE '%posture%'
  OR name ILIKE '%comfort%'
)
AND product_type IS NULL;

-- 2. Mesh Chairs (mesh back, breathable)
UPDATE products 
SET product_type = 'Mesh Chairs' 
WHERE subcategory_id = (SELECT id FROM subcategories WHERE slug = 'office-chairs') 
AND (
  name ILIKE '%mesh%'
  OR name ILIKE '%breathable%'
  OR name ILIKE '%ventilated%'
)
AND product_type IS NULL;

-- 3. Swivel Chairs (swivel, rotating, executive)
UPDATE products 
SET product_type = 'Swivel Chairs' 
WHERE subcategory_id = (SELECT id FROM subcategories WHERE slug = 'office-chairs') 
AND (
  name ILIKE '%swivel%'
  OR name ILIKE '%rotating%'
  OR name ILIKE '%executive%'
  OR name ILIKE '%manager%'
  OR name ILIKE '%boss%'
)
AND product_type IS NULL;

-- 4. Guest Chairs (visitor, guest, reception, waiting)
UPDATE products 
SET product_type = 'Guest Chairs' 
WHERE subcategory_id = (SELECT id FROM subcategories WHERE slug = 'office-chairs') 
AND (
  name ILIKE '%guest%'
  OR name ILIKE '%visitor%'
  OR name ILIKE '%reception%'
  OR name ILIKE '%waiting%'
  OR name ILIKE '%lobby%'
)
AND product_type IS NULL;

-- 5. Task Chairs (task, operator, staff, basic)
UPDATE products 
SET product_type = 'Task Chairs' 
WHERE subcategory_id = (SELECT id FROM subcategories WHERE slug = 'office-chairs') 
AND (
  name ILIKE '%task%'
  OR name ILIKE '%operator%'
  OR name ILIKE '%staff%'
  OR name ILIKE '%basic%'
  OR name ILIKE '%standard%'
  OR name ILIKE '%simple%'
)
AND product_type IS NULL;

-- 6. Default remaining office chairs to Task Chairs (most common type)
UPDATE products 
SET product_type = 'Task Chairs' 
WHERE subcategory_id = (SELECT id FROM subcategories WHERE slug = 'office-chairs') 
AND product_type IS NULL;

-- Verify the assignments
SELECT 
  product_type,
  COUNT(*) as count,
  STRING_AGG(name, ', ' ORDER BY name) as sample_products
FROM products
WHERE subcategory_id = (SELECT id FROM subcategories WHERE slug = 'office-chairs')
GROUP BY product_type
ORDER BY count DESC;
