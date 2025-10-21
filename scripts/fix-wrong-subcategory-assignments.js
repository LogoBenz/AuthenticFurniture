const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fixWrongSubcategoryAssignments() {
  console.log('🔧 Fixing wrong subcategory assignments...\n');

  // Get all subcategories
  const { data: subcategories } = await supabase
    .from('subcategories')
    .select('*');

  // Get all spaces
  const { data: spaces } = await supabase
    .from('spaces')
    .select('*');

  const officeSpace = spaces.find(s => s.slug === 'office');
  const homeSpace = spaces.find(s => s.slug === 'home');

  const conferenceTableSub = subcategories.find(s => s.slug === 'conference-table');
  const officeTablesSub = subcategories.find(s => s.slug === 'office-tables');
  const complementorySub = subcategories.find(s => s.slug === 'complementory');

  console.log('📋 Found subcategories:');
  console.log('  - Conference Table:', conferenceTableSub?.id);
  console.log('  - Office Tables:', officeTablesSub?.id);
  console.log('  - Complementory:', complementorySub?.id);
  console.log('\n📋 Found spaces:');
  console.log('  - Office:', officeSpace?.id);
  console.log('  - Home:', homeSpace?.id, '\n');

  // Products that should be moved from "Home/Sofa Sets" to correct categories
  const productsToFix = [
    {
      name: 'Nexus',
      searchTerm: 'Nexus.*Conference',
      correctSpace: officeSpace?.id,
      correctSubcategory: conferenceTableSub?.id,
      reason: 'Conference table should be in Office/Conference Table'
    },
    {
      name: 'Apex Executive Desk',
      searchTerm: 'Apex.*Executive.*Desk',
      correctSpace: officeSpace?.id,
      correctSubcategory: officeTablesSub?.id,
      reason: 'Executive desk should be in Office/Office Tables'
    },
    {
      name: 'Metropole Welcome Counter',
      searchTerm: 'Metropole.*Welcome',
      correctSpace: officeSpace?.id,
      correctSubcategory: complementorySub?.id,
      reason: 'Welcome counter should be in Office/Complementory'
    },
    {
      name: 'Contemporary Workstation',
      searchTerm: 'Contemporary.*Workstation',
      correctSpace: officeSpace?.id,
      correctSubcategory: officeTablesSub?.id,
      reason: 'Workstation should be in Office/Office Tables'
    }
  ];

  // Get all products
  const { data: allProducts } = await supabase
    .from('products')
    .select(`
      id,
      name,
      space_id,
      subcategory_id,
      space:spaces(name, slug),
      subcategory:subcategories(name, slug)
    `);

  console.log('🔍 Searching for products to fix...\n');

  for (const fix of productsToFix) {
    const regex = new RegExp(fix.searchTerm, 'i');
    const product = allProducts.find(p => regex.test(p.name));

    if (product) {
      console.log(`\n📦 Found: ${product.name}`);
      console.log(`   Current: ${product.space?.name || 'NONE'} / ${product.subcategory?.name || 'NONE'}`);
      console.log(`   Should be: Office / ${fix.correctSubcategory === conferenceTableSub?.id ? 'Conference Table' : fix.correctSubcategory === officeTablesSub?.id ? 'Office Tables' : 'Complementory'}`);
      console.log(`   Reason: ${fix.reason}`);

      // Update the product
      const { error } = await supabase
        .from('products')
        .update({
          space_id: fix.correctSpace,
          subcategory_id: fix.correctSubcategory
        })
        .eq('id', product.id);

      if (error) {
        console.log(`   ❌ Error updating: ${error.message}`);
      } else {
        console.log(`   ✅ Updated successfully!`);
      }
    } else {
      console.log(`\n⚠️  Could not find product matching: ${fix.searchTerm}`);
    }
  }

  // Find products without space/subcategory
  console.log('\n\n' + '='.repeat(60));
  console.log('Products Missing Space/Subcategory:');
  console.log('='.repeat(60));

  const productsWithoutRelationships = allProducts.filter(p => !p.space_id || !p.subcategory_id);
  
  if (productsWithoutRelationships.length > 0) {
    console.log(`\nFound ${productsWithoutRelationships.length} products without proper relationships:\n`);
    productsWithoutRelationships.forEach(p => {
      console.log(`  - ${p.name}`);
      console.log(`    Space: ${p.space?.name || '❌ MISSING'}`);
      console.log(`    Subcategory: ${p.subcategory?.name || '❌ MISSING'}\n`);
    });
    console.log('⚠️  These products need to be manually assigned in the admin panel.');
  } else {
    console.log('\n✅ All products have space and subcategory assigned!');
  }
}

fixWrongSubcategoryAssignments()
  .then(() => {
    console.log('\n✅ Fix complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
