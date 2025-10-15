# Office Chairs Section Setup

## Overview
The Office Chairs section displays office chair products categorized by type, similar to the Office Tables section.

## Chair Types
1. **Ergonomic Chairs** - Chairs with lumbar support, posture correction, and comfort features
2. **Mesh Chairs** - Breathable mesh back chairs for ventilation
3. **Swivel Chairs** - Executive/manager chairs with rotating base
4. **Guest Chairs** - Visitor, reception, and waiting area chairs
5. **Task Chairs** - Standard operator/staff chairs for daily use

## SQL Assignment Logic

The SQL script (`supabase/migrations/assign_office_chair_types.sql`) assigns product types based on keywords in product names:

### Ergonomic Chairs
Keywords: ergonomic, lumbar, posture, comfort

### Mesh Chairs
Keywords: mesh, breathable, ventilated

### Swivel Chairs
Keywords: swivel, rotating, executive, manager, boss

### Guest Chairs
Keywords: guest, visitor, reception, waiting, lobby

### Task Chairs
Keywords: task, operator, staff, basic, standard, simple
- Also serves as default for unmatched chairs

## Running the SQL

```sql
-- Run this in your Supabase SQL Editor
\i supabase/migrations/assign_office_chair_types.sql
```

Or copy and paste the contents directly into the SQL Editor.

## Verification

After running the script, verify the assignments:

```sql
SELECT 
  product_type,
  COUNT(*) as count,
  STRING_AGG(name, ', ' ORDER BY name LIMIT 3) as sample_products
FROM products
WHERE subcategory_id = (SELECT id FROM subcategories WHERE slug = 'office-chairs')
GROUP BY product_type
ORDER BY count DESC;
```

## Component Usage

The `OfficeChairsSection` component:
- Filters products by `product_type`
- Displays 3 cards with horizontal scroll
- Uses the office chair image from Popular Categories
- Matches the styling of Office Tables section

## Admin Management

When adding/editing products in the admin panel:
1. Select "Office Chairs" as the subcategory
2. Choose the appropriate product type from the dropdown
3. The product will automatically appear in the correct filter tab

## Example Products by Type

**Ergonomic Chairs:**
- Executive Ergonomic Office Chair
- Lumbar Support Comfort Chair
- Posture Correcting Desk Chair

**Mesh Chairs:**
- Breathable Mesh Back Chair
- Ventilated Office Chair
- Mesh Executive Chair

**Swivel Chairs:**
- Executive Swivel Chair
- Manager Rotating Chair
- Boss Office Chair

**Guest Chairs:**
- Visitor Reception Chair
- Guest Waiting Chair
- Lobby Seating Chair

**Task Chairs:**
- Standard Task Chair
- Operator Office Chair
- Staff Desk Chair
