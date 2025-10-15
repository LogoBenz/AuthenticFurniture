import { supabase } from '@/lib/supabase-simple';
import { getAllSpaces } from '@/lib/categories';

// Check if Supabase is properly configured
function isSupabaseConfigured(): boolean {
  // Always return true since we're using direct config
  return true;
}

// Map categories to spaces and subcategories
const categoryMapping: Record<string, { spaceSlug: string; subcategorySlug: string }> = {
  'office-chairs': { spaceSlug: 'office', subcategorySlug: 'office-chairs' },
  'sofas': { spaceSlug: 'home', subcategorySlug: 'sofa-sets' },
  'cabinets': { spaceSlug: 'home', subcategorySlug: 'cabinets' },
  'wardrobes': { spaceSlug: 'home', subcategorySlug: 'cabinets' },
  'tables': { spaceSlug: 'home', subcategorySlug: 'dining-sets' },
  'armchairs': { spaceSlug: 'home', subcategorySlug: 'sofa-sets' },
  'desks': { spaceSlug: 'office', subcategorySlug: 'desks-tables' },
  'beds': { spaceSlug: 'home', subcategorySlug: 'beds' },
  'dining-sets': { spaceSlug: 'home', subcategorySlug: 'dining-sets' },
  'storage': { spaceSlug: 'home', subcategorySlug: 'cabinets' },
  'chairs': { spaceSlug: 'home', subcategorySlug: 'sofa-sets' },
  'furniture': { spaceSlug: 'home', subcategorySlug: 'sofa-sets' },
};

export async function migrateProductsToSpaces(): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.error('❌ Supabase not configured. Cannot migrate products.');
    return;
  }

  try {
    console.log('🔄 Starting product migration to spaces/subcategories...');

    // Get all spaces with subcategories
    const spaces = await getAllSpaces();
    console.log(`📊 Found ${spaces.length} spaces`);

    // Get all products that don't have space_id assigned
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .is('space_id', null);

    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }

    console.log(`📦 Found ${products.length} products to migrate`);

    if (products.length === 0) {
      console.log('✅ All products already have space/subcategory assignments');
      return;
    }

    // Create a map of space slug to space ID and subcategory slug to subcategory ID
    const spaceMap = new Map();
    const subcategoryMap = new Map();

    spaces.forEach(space => {
      spaceMap.set(space.slug, space.id);
      space.subcategories?.forEach(subcategory => {
        subcategoryMap.set(`${space.slug}:${subcategory.slug}`, subcategory.id);
      });
    });

    console.log('🗺️ Space mapping:', Object.fromEntries(spaceMap));
    console.log('🗺️ Subcategory mapping:', Object.fromEntries(subcategoryMap));

    // Update products in batches
    const batchSize = 50;
    let updatedCount = 0;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      console.log(`🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)}`);

      const updates = batch.map((product: any) => {
        const mapping = categoryMapping[product.category.toLowerCase()] || categoryMapping['furniture'];

        const spaceId = spaceMap.get(mapping.spaceSlug);
        const subcategoryId = subcategoryMap.get(`${mapping.spaceSlug}:${mapping.subcategorySlug}`);

        if (!spaceId) {
          console.warn(`⚠️ No space found for slug: ${mapping.spaceSlug}`);
          return null;
        }

        return {
          id: product.id,
          space_id: spaceId,
          subcategory_id: subcategoryId || null,
        };
      }).filter(Boolean);

      if (updates.length > 0) {
        const { error: updateError } = await supabase
          .from('products')
          .upsert(updates, { onConflict: 'id' });

        if (updateError) {
          console.error('❌ Error updating batch:', updateError);
          continue;
        }

        updatedCount += updates.length;
        console.log(`✅ Updated ${updates.length} products in this batch`);
      }
    }

    console.log(`🎉 Migration completed! Updated ${updatedCount} products with space/subcategory assignments`);

    // Verify the migration
    const { data: migratedProducts, error: verifyError } = await supabase
      .from('products')
      .select('id, name, category, space_id, subcategory_id')
      .not('space_id', 'is', null)
      .limit(5);

    if (!verifyError && migratedProducts) {
      console.log('✅ Sample migrated products:');
      migratedProducts.forEach((product: any) => {
        console.log(`  - ${product.name}: ${product.category} → space_id: ${product.space_id}, subcategory_id: ${product.subcategory_id}`);
      });
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateProductsToSpaces()
    .then(() => {
      console.log('🏁 Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}
