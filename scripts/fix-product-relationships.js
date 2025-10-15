const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nufciijehcapowhhggcl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZmNpaWplaGNhcG93aGhnZ2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMjEzNjksImV4cCI6MjA2NjY5NzM2OX0.IBOZuiEERx0QivGDKKiFzWAD_wWPWJUdw5opR4K7HZo'
);

async function fixProductRelationships() {
  console.log('🔧 Fixing product relationships...\n');

  try {
    // Get all spaces and subcategories
    const { data: spaces, error: spacesError } = await supabase
      .from('spaces')
      .select('id, name, slug, subcategories(id, name, slug)');

    if (spacesError) {
      console.error('❌ Error fetching spaces:', spacesError);
      return;
    }

    console.log(`📍 Found ${spaces.length} spaces\n`);

    // Create mapping of category names to subcategory IDs
    const categoryMap = {};
    const spaceMap = {};

    spaces.forEach(space => {
      spaceMap[space.slug] = space.id;
      
      if (space.subcategories) {
        space.subcategories.forEach(sub => {
          const key = sub.name.toLowerCase();
          categoryMap[key] = {
            space_id: space.id,
            subcategory_id: sub.id,
            space_name: space.name,
            subcategory_name: sub.name
          };
        });
      }
    });

    console.log('📋 Category mappings:');
    Object.keys(categoryMap).forEach(key => {
      const mapping = categoryMap[key];
      console.log(`   "${key}" → ${mapping.space_name} / ${mapping.subcategory_name}`);
    });
    console.log('');

    // Get all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, category');

    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }

    console.log(`📦 Processing ${products.length} products...\n`);

    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      const categoryLower = product.category.toLowerCase();
      
      // Try to find a matching subcategory
      let mapping = categoryMap[categoryLower];
      
      // Try partial matches if exact match not found
      if (!mapping) {
        for (const [key, value] of Object.entries(categoryMap)) {
          if (categoryLower.includes(key) || key.includes(categoryLower)) {
            mapping = value;
            break;
          }
        }
      }

      if (mapping) {
        const { error: updateError } = await supabase
          .from('products')
          .update({
            space_id: mapping.space_id,
            subcategory_id: mapping.subcategory_id
          })
          .eq('id', product.id);

        if (updateError) {
          console.error(`❌ Error updating ${product.name}:`, updateError);
        } else {
          console.log(`✅ ${product.name} → ${mapping.space_name} / ${mapping.subcategory_name}`);
          updated++;
        }
      } else {
        console.log(`⚠️  Skipped: ${product.name} (category: ${product.category}) - no matching subcategory`);
        skipped++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total: ${products.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixProductRelationships();
