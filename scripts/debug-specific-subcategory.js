const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function debugSpecificSubcategory() {
  console.log('🔍 Debugging specific subcategory filtering...\n');

  // Test the exact subcategories from Popular Categories
  const testSubcategories = [
    'student-chairs',
    'office-tables',
    'complimentary',
    'office-chairs',
    'sofa-sets',
    'auditorium-chair',
    'storage-cabinets',
    'patio-sets'
  ];

  for (const subcategorySlug of testSubcategories) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: ${subcategorySlug}`);
    console.log('='.repeat(60));

    // Get products by subcategory slug (exact match)
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        category,
        space_id,
        subcategory_id,
        space:spaces(id, name, slug),
        subcategory:subcategories(id, name, slug)
      `)
      .order('name');

    if (error) {
      console.error('❌ Error:', error);
      continue;
    }

    // Filter by subcategory slug
    const matchingProducts = products.filter(p => 
      p.subcategory?.slug === subcategorySlug
    );

    // Also check category name fallback
    const subcategoryName = subcategorySlug.replace(/-/g, ' ').toLowerCase();
    const categoryFallback = products.filter(p => {
      const productCategory = p.category.toLowerCase();
      return productCategory.includes(subcategoryName) || 
             subcategoryName.includes(productCategory);
    });

    console.log(`\n📊 Results for "${subcategorySlug}":`);
    console.log(`  Exact subcategory match: ${matchingProducts.length} products`);
    console.log(`  Category fallback match: ${categoryFallback.length} products`);

    if (matchingProducts.length > 0) {
      console.log('\n  ✅ Products with matching subcategory:');
      matchingProducts.slice(0, 5).forEach(p => {
        console.log(`    - ${p.name} (₦${p.price.toLocaleString()})`);
        console.log(`      Space: ${p.space?.name || 'NONE'} (${p.space?.slug || 'N/A'})`);
        console.log(`      Subcategory: ${p.subcategory?.name || 'NONE'} (${p.subcategory?.slug || 'N/A'})`);
      });
      if (matchingProducts.length > 5) {
        console.log(`    ... and ${matchingProducts.length - 5} more`);
      }
    }

    if (categoryFallback.length > 0 && matchingProducts.length === 0) {
      console.log('\n  ⚠️  No subcategory match, but found via category fallback:');
      categoryFallback.slice(0, 3).forEach(p => {
        console.log(`    - ${p.name}`);
        console.log(`      Category: ${p.category}`);
        console.log(`      Space: ${p.space?.name || 'NONE'}`);
        console.log(`      Subcategory: ${p.subcategory?.name || 'NONE'}`);
      });
    }

    if (matchingProducts.length === 0 && categoryFallback.length === 0) {
      console.log('\n  ❌ No products found!');
    }
  }

  // Check what subcategories actually exist
  console.log('\n\n' + '='.repeat(60));
  console.log('Available Subcategories in Database:');
  console.log('='.repeat(60));
  
  const { data: subcategories } = await supabase
    .from('subcategories')
    .select('id, name, slug')
    .order('name');

  if (subcategories) {
    subcategories.forEach(sub => {
      console.log(`  - ${sub.name} (${sub.slug})`);
    });
  }

  // Check for slug mismatches
  console.log('\n\n' + '='.repeat(60));
  console.log('Checking for Slug Mismatches:');
  console.log('='.repeat(60));

  const expectedSlugs = {
    'student-chairs': 'Student Chairs',
    'office-tables': 'Office Tables',
    'complimentary': 'Complementary',
    'office-chairs': 'Office Chairs',
    'sofa-sets': 'Sofa Sets',
    'auditorium-chair': 'Auditorium Chair',
    'storage-cabinets': 'Storage Cabinets',
    'patio-sets': 'Patio Sets'
  };

  for (const [expectedSlug, expectedName] of Object.entries(expectedSlugs)) {
    const found = subcategories?.find(s => s.slug === expectedSlug);
    if (!found) {
      console.log(`  ❌ Missing: ${expectedName} (${expectedSlug})`);
      // Check if it exists with different slug
      const byName = subcategories?.find(s => s.name.toLowerCase() === expectedName.toLowerCase());
      if (byName) {
        console.log(`     Found with different slug: "${byName.slug}"`);
      }
    } else {
      console.log(`  ✅ Found: ${found.name} (${found.slug})`);
    }
  }
}

debugSpecificSubcategory()
  .then(() => {
    console.log('\n✅ Debug complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
