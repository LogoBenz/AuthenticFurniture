# Product Types Feature Guide

## Overview
This feature allows you to further categorize products within a subcategory using **product types**. This is useful for creating filtered sections like "Office Tables" with types like "Executive Tables", "Electric Desks", etc.

## Hierarchy
```
Category (Space) → Subcategory → Product Type → Product
Example: Furniture → Office Tables → Executive Tables → Mahogany Executive Desk
```

## Setup Instructions

### 1. Run Database Migration
Execute the SQL migration to add the `product_type` column to your products table:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL in Supabase Dashboard:
# Go to SQL Editor and run the contents of supabase/migrations/add_product_type.sql
```

### 2. Assign Product Types to Products
You can assign product types in two ways:

#### Option A: Via Supabase Dashboard
1. Go to your Supabase Dashboard
2. Navigate to Table Editor → products
3. Find products under "Office Tables" subcategory
4. Edit each product and set the `product_type` field to one of:
   - Executive Tables
   - Electric Desks
   - Reception Tables
   - Conference Tables
   - Standard Tables

#### Option B: Via SQL Update
```sql
-- Update products with product types based on their names
UPDATE products 
SET product_type = 'Executive Tables' 
WHERE subcategory_id = (SELECT id FROM subcategories WHERE slug = 'office-tables') 
AND (name ILIKE '%executive%' OR name ILIKE '%ceo%');

UPDATE products 
SET product_type = 'Electric Desks' 
WHERE subcategory_id = (SELECT id FROM subcategories WHERE slug = 'office-tables') 
AND (name ILIKE '%electric%' OR name ILIKE '%adjustable%');

UPDATE products 
SET product_type = 'Reception Tables' 
WHERE subcategory_id = (SELECT id FROM subcategories WHERE slug = 'office-tables') 
AND name ILIKE '%reception%';

UPDATE products 
SET product_type = 'Conference Tables' 
WHERE subcategory_id = (SELECT id FROM subcategories WHERE slug = 'office-tables') 
AND (name ILIKE '%conference%' OR name ILIKE '%meeting%');

UPDATE products 
SET product_type = 'Standard Tables' 
WHERE subcategory_id = (SELECT id FROM subcategories WHERE slug = 'office-tables') 
AND product_type IS NULL;
```

### 3. Add the Component to Your Page
Add the OfficeTablesSection component to your home page or any other page:

```tsx
import { OfficeTablesSection } from "@/components/home/OfficeTablesSection";
import { getProductsBySubcategory } from "@/lib/products";

export default async function HomePage() {
  // Fetch all office tables products
  const officeTablesProducts = await getProductsBySubcategory("office-tables");

  return (
    <div>
      {/* Other sections */}
      
      <OfficeTablesSection products={officeTablesProducts} />
      
      {/* Other sections */}
    </div>
  );
}
```

## API Functions

### Get Products by Subcategory
```typescript
import { getProductsBySubcategory } from "@/lib/products";

const products = await getProductsBySubcategory("office-tables");
```

### Get Products by Type
```typescript
import { getProductsByType } from "@/lib/products";

const executiveTables = await getProductsByType("office-tables", "Executive Tables");
```

## Component Features

The `OfficeTablesSection` component includes:
- ✅ Filterable tabs for each product type
- ✅ Horizontal scrolling carousel
- ✅ Product cards with images, prices, and badges
- ✅ "Out of Stock" overlay
- ✅ Discount display
- ✅ Add to cart button
- ✅ Responsive design
- ✅ Dark mode support

## Customization

### Adding More Product Types
Edit the `PRODUCT_TYPES` array in `components/home/OfficeTablesSection.tsx`:

```typescript
const PRODUCT_TYPES = [
  "Executive Tables",
  "Electric Desks",
  "Reception Tables",
  "Conference Tables",
  "Standard Tables",
  "Your New Type", // Add here
];
```

### Creating Similar Sections for Other Subcategories
You can duplicate and modify the component for other subcategories:

```typescript
// components/home/GamingChairsSection.tsx
const PRODUCT_TYPES = [
  "Racing Chairs",
  "Ergonomic Chairs",
  "RGB Chairs",
  "Pro Gaming Chairs",
];
```

## Admin Panel Integration

To add product type selection in your admin panel, add a dropdown field:

```tsx
<select name="product_type">
  <option value="">Select Type</option>
  <option value="Executive Tables">Executive Tables</option>
  <option value="Electric Desks">Electric Desks</option>
  <option value="Reception Tables">Reception Tables</option>
  <option value="Conference Tables">Conference Tables</option>
  <option value="Standard Tables">Standard Tables</option>
</select>
```

## Troubleshooting

### Products not showing up?
1. Check that products have the correct `subcategory_id` for "Office Tables"
2. Verify that `product_type` is set correctly
3. Check browser console for any errors

### Types not filtering correctly?
1. Ensure product_type values match exactly (case-sensitive)
2. Check that the component is receiving products prop correctly

## Next Steps

1. Run the migration
2. Assign product types to your products
3. Add the component to your page
4. Test the filtering functionality
5. Customize styling to match your brand
