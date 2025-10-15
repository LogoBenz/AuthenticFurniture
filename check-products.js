const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nufciijehcapowhhggcl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZmNpaWplaGNhcG93aGhnZ2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMjEzNjksImV4cCI6MjA2NjY5NzM2OX0.IBOZuiEERx0QivGDKKiFzWAD_wWPWJUdw5opR4K7HZo'
);

async function checkProducts() {
  console.log('🔍 Checking product data...\n');

  try {
    // Get sample products with their relationships
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        category,
        space_id,
        subcategory_id,
        space:spaces(id, name, slug),
        subcategory:subcategories(id, name, slug)
      `)
      .limit(10);

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`📦 Sample of ${products.length} products:\n`);

    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   Category: ${p.category}`);
      console.log(`   Space: ${p.space ? `${p.space.name} (${p.space.slug})` : 'NOT SET'}`);
      console.log(`   Subcategory: ${p.subcategory ? `${p.subcategory.name} (${p.subcategory.slug})` : 'NOT SET'}`);
      console.log('');
    });

    // Count products with/without relationships
    const withSpace = products.filter(p => p.space_id).length;
    const withSubcategory = products.filter(p => p.subcategory_id).length;

    console.log('📊 Summary:');
    console.log(`   Products with Space: ${withSpace}/${products.length}`);
    console.log(`   Products with Subcategory: ${withSubcategory}/${products.length}`);
    console.log(`   Products without relationships: ${products.length - withSpace}`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkProducts();
