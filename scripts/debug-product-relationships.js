const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function debugProductRelationships() {
  console.log('🔍 Debugging product relationships...\n');

  // Get all products with their space and subcategory data
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      price,
      space_id,
      subcategory_id,
      space:spaces(id, name, slug),
      subcategory:subcategories(id, name, slug)
    `)
    .order('name');

  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }

  console.log(`📊 Total products: ${products.length}\n`);

  // Group by relationship status
  const withBoth = products.filter(p => p.space && p.subcategory);
  const withSpaceOnly = products.filter(p => p.space && !p.subcategory);
  const withSubcategoryOnly = products.filter(p => !p.space && p.subcategory);
  const withNeither = products.filter(p => !p.space && !p.subcategory);

  console.log('📈 Relationship Status:');
  console.log(`✅ With Space & Subcategory: ${withBoth.length}`);
  console.log(`⚠️  With Space Only: ${withSpaceOnly.length}`);
  console.log(`⚠️  With Subcategory Only: ${withSubcategoryOnly.length}`);
  console.log(`❌ With Neither: ${withNeither.length}\n`);

  // Show products above 10,000 Naira
  const expensive = products.filter(p => p.price > 10000);
  console.log(`💰 Products above ₦10,000: ${expensive.length}`);
  if (expensive.length > 0) {
    console.log('Examples:');
    expensive.slice(0, 5).forEach(p => {
      console.log(`  - ${p.name}: ₦${p.price.toLocaleString()}`);
      console.log(`    Space: ${p.space?.name || 'NONE'} (${p.space?.slug || 'N/A'})`);
      console.log(`    Subcategory: ${p.subcategory?.name || 'NONE'} (${p.subcategory?.slug || 'N/A'})\n`);
    });
  }

  // Show sample products with relationships
  console.log('\n📋 Sample Products with Full Relationships:');
  withBoth.slice(0, 5).forEach(p => {
    console.log(`  - ${p.name}: ₦${p.price.toLocaleString()}`);
    console.log(`    Space: ${p.space.name} (${p.space.slug})`);
    console.log(`    Subcategory: ${p.subcategory.name} (${p.subcategory.slug})\n`);
  });

  // Show products missing relationships
  if (withNeither.length > 0) {
    console.log('\n⚠️  Products Missing Both Relationships:');
    withNeither.slice(0, 10).forEach(p => {
      console.log(`  - ${p.name}: ₦${p.price.toLocaleString()}`);
    });
  }

  // Get all spaces and subcategories
  const { data: spaces } = await supabase
    .from('spaces')
    .select('id, name, slug')
    .order('name');

  const { data: subcategories } = await supabase
    .from('subcategories')
    .select('id, name, slug, space_id')
    .order('name');

  console.log(`\n🏢 Total Spaces: ${spaces?.length || 0}`);
  console.log(`📁 Total Subcategories: ${subcategories?.length || 0}\n`);

  if (spaces) {
    console.log('Available Spaces:');
    spaces.forEach(s => console.log(`  - ${s.name} (${s.slug})`));
  }

  if (subcategories) {
    console.log('\nAvailable Subcategories:');
    subcategories.forEach(s => console.log(`  - ${s.name} (${s.slug})`));
  }
}

debugProductRelationships()
  .then(() => {
    console.log('\n✅ Debug complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
