# Admin Panel - Product Type Management

## Adding Product Type Field to Admin Forms

Here's how to add product type selection to your admin product creation/editing forms:

### Example Admin Form Component

```tsx
"use client";

import { useState } from "react";

// Product type options by subcategory
const PRODUCT_TYPE_OPTIONS: Record<string, string[]> = {
  "office-tables": [
    "Executive Tables",
    "Electric Desks",
    "Reception Tables",
    "Conference Tables",
    "Standard Tables",
  ],
  "office-chairs": [
    "Executive Chairs",
    "Task Chairs",
    "Conference Chairs",
    "Ergonomic Chairs",
    "Visitor Chairs",
  ],
  "gaming-chairs": [
    "Racing Chairs",
    "Ergonomic Gaming Chairs",
    "RGB Gaming Chairs",
    "Pro Gaming Chairs",
  ],
  // Add more subcategories as needed
};

export function ProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    subcategory_id: "",
    product_type: "",
    price: 0,
    // ... other fields
  });

  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  // Get product types for selected subcategory
  const availableTypes = selectedSubcategory 
    ? PRODUCT_TYPE_OPTIONS[selectedSubcategory] || []
    : [];

  const handleSubcategoryChange = (subcategorySlug: string) => {
    setSelectedSubcategory(subcategorySlug);
    setFormData({
      ...formData,
      product_type: "", // Reset product type when subcategory changes
    });
  };

  return (
    <form className="space-y-4">
      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Product Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      {/* Subcategory Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Subcategory
        </label>
        <select
          value={selectedSubcategory}
          onChange={(e) => handleSubcategoryChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        >
          <option value="">Select Subcategory</option>
          <option value="office-tables">Office Tables</option>
          <option value="office-chairs">Office Chairs</option>
          <option value="gaming-chairs">Gaming Chairs</option>
          {/* Add more subcategories */}
        </select>
      </div>

      {/* Product Type Selection - Only shows if subcategory is selected */}
      {availableTypes.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Product Type
          </label>
          <select
            value={formData.product_type}
            onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select Type (Optional)</option>
            {availableTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Product type helps organize products within the subcategory
          </p>
        </div>
      )}

      {/* Price */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Price (₦)
        </label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-red-700 text-white py-2 rounded-lg hover:bg-red-800"
      >
        Save Product
      </button>
    </form>
  );
}
```

## Bulk Update Script

If you need to bulk update existing products with product types:

```typescript
// scripts/assign-product-types.ts
import { supabase } from '@/lib/supabase-simple';

async function assignProductTypes() {
  console.log('🔄 Starting product type assignment...');

  // Get office tables subcategory ID
  const { data: subcategory } = await supabase
    .from('subcategories')
    .select('id')
    .eq('slug', 'office-tables')
    .single();

  if (!subcategory) {
    console.error('❌ Office tables subcategory not found');
    return;
  }

  // Get all products in office tables subcategory
  const { data: products } = await supabase
    .from('products')
    .select('id, name')
    .eq('subcategory_id', subcategory.id);

  if (!products) {
    console.error('❌ No products found');
    return;
  }

  console.log(`📦 Found ${products.length} products to process`);

  // Assign types based on product names
  for (const product of products) {
    let productType = 'Standard Tables'; // Default

    const name = product.name.toLowerCase();

    if (name.includes('executive') || name.includes('ceo')) {
      productType = 'Executive Tables';
    } else if (name.includes('electric') || name.includes('adjustable')) {
      productType = 'Electric Desks';
    } else if (name.includes('reception')) {
      productType = 'Reception Tables';
    } else if (name.includes('conference') || name.includes('meeting')) {
      productType = 'Conference Tables';
    }

    // Update product
    const { error } = await supabase
      .from('products')
      .update({ product_type: productType })
      .eq('id', product.id);

    if (error) {
      console.error(`❌ Error updating ${product.name}:`, error);
    } else {
      console.log(`✅ Updated ${product.name} → ${productType}`);
    }
  }

  console.log('✅ Product type assignment complete!');
}

// Run the script
assignProductTypes();
```

Run with:
```bash
npx tsx scripts/assign-product-types.ts
```

## API Endpoint Example

Create an API endpoint for updating product types:

```typescript
// app/api/admin/products/[id]/type/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-simple';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { product_type } = await request.json();

    const { data, error } = await supabase
      .from('products')
      .update({ product_type })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, product: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product type' },
      { status: 500 }
    );
  }
}
```

## Quick Update via Supabase Dashboard

1. Go to Supabase Dashboard → Table Editor → products
2. Filter by subcategory: `subcategory_id = [office-tables-id]`
3. Click on a product row
4. Edit the `product_type` field
5. Select from: Executive Tables, Electric Desks, Reception Tables, Conference Tables, Standard Tables
6. Save

## Validation Rules

Add these validation rules to ensure data consistency:

```typescript
// lib/validation/product-types.ts
export const VALID_PRODUCT_TYPES: Record<string, string[]> = {
  "office-tables": [
    "Executive Tables",
    "Electric Desks",
    "Reception Tables",
    "Conference Tables",
    "Standard Tables",
  ],
  // Add more as needed
};

export function validateProductType(
  subcategorySlug: string,
  productType: string
): boolean {
  const validTypes = VALID_PRODUCT_TYPES[subcategorySlug];
  if (!validTypes) return true; // No validation for this subcategory
  return validTypes.includes(productType);
}
```

## Tips

1. **Keep it optional**: Product type should be optional to avoid breaking existing products
2. **Use consistent naming**: Always use the exact same strings (case-sensitive)
3. **Add gradually**: Start with one subcategory, then expand
4. **Document types**: Keep a list of all product types for each subcategory
5. **Consider search**: Product types can be used for filtering in search results
