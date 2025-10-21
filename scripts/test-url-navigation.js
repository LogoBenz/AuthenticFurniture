const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testURLNavigation() {
  console.log('🔍 Testing URL navigation flow...\n');

  // Simulate clicking "Office Tables" from Popular Categories
  const testURL = '/products?subcategory=office-tables';
  console.log(`Testing URL: ${testURL}\n`);

  // Step 1: Get all products from database
  const { data: allProducts, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      price,
      category,
      in_stock,
      space_id,
      subcategory_id,
      space:spaces(id, name, slug),
      subcategory:subcategories(id, name, slug)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }

  console.log(`📊 Total products in database: ${allProducts.length}\n`);

  // Step 2: Simulate the filtering logic from products page
  const urlSubcategory = 'office-tables';
  const minPrice = 0;
  const maxPrice = 1000000;

  console.log('🔧 Applying filters:');
  console.log(`  - urlSubcategory: "${urlSubcategory}"`);
  console.log(`  - minPrice: ${minPrice}`);
  console.log(`  - maxPrice: ${maxPrice}\n`);

  let filtered = allProducts;

  // Filter by subcategory (from products page logic)
  if (urlSubcategory) {
    console.log('Step 1: Filtering by subcategory...');
    filtered = filtered.filter(product => {
      const productSubSlug = (product.subcategory?.slug || "").toLowerCase();
      const productCategory = product.category.toLowerCase();
      const subcategoryName = urlSubcategory.replace(/-/g, ' ').toLowerCase();
      
      const match = productSubSlug === urlSubcategory.toLowerCase() || 
             productCategory.includes(subcategoryName) ||
             subcategoryName.includes(productCategory);

      if (match) {
        console.log(`  ✅ Match: ${product.name}`);
        console.log(`     Subcategory slug: "${productSubSlug}"`);
        console.log(`     Category: "${productCategory}"`);
      }
      
      return match;
    });
    console.log(`  Result: ${filtered.length} products after subcategory filter\n`);
  }

  // Filter by price range
  console.log('Step 2: Filtering by price range...');
  const beforePriceFilter = filtered.length;
  filtered = filtered.filter(product => 
    product.price >= minPrice && product.price <= maxPrice
  );
  console.log(`  Result: ${filtered.length} products after price filter`);
  console.log(`  Filtered out: ${beforePriceFilter - filtered.length} products\n`);

  if (filtered.length === 0) {
    console.log('❌ NO PRODUCTS FOUND!\n');
    
    // Debug: Check what prices we have
    const officeTableProducts = allProducts.filter(p => 
      p.subcategory?.slug === 'office-tables'
    );
    
    if (officeTableProducts.length > 0) {
      console.log('🔍 Office Tables products exist in database:');
      officeTableProducts.forEach(p => {
        console.log(`  - ${p.name}: ₦${p.price.toLocaleString()}`);
        console.log(`    Price in range? ${p.price >= minPrice && p.price <= maxPrice ? 'YES' : 'NO'}`);
      });
    }
  } else {
    console.log(`✅ Found ${filtered.length} products:\n`);
    filtered.slice(0, 5).forEach(p => {
      console.log(`  - ${p.name}`);
      console.log(`    Price: ₦${p.price.toLocaleString()}`);
      console.log(`    Subcategory: ${p.subcategory?.name} (${p.subcategory?.slug})`);
      console.log(`    In Stock: ${p.in_stock ? 'Yes' : 'No'}\n`);
    });
  }

  // Test with actual URL params that might be set
  console.log('\n' + '='.repeat(60));
  console.log('Testing with ProductFilters default params:');
  console.log('='.repeat(60));
  
  // ProductFilters sets maxPrice=1000000 by default
  const urlMaxPrice = 1000000;
  const urlMinPrice = 0;
  
  console.log(`URL params: ?subcategory=office-tables&minPrice=${urlMinPrice}&maxPrice=${urlMaxPrice}\n`);
  
  let filtered2 = allProducts.filter(p => p.subcategory?.slug === 'office-tables');
  console.log(`After subcategory filter: ${filtered2.length} products`);
  
  filtered2 = filtered2.filter(p => p.price >= urlMinPrice && p.price <= urlMaxPrice);
  console.log(`After price filter: ${filtered2.length} products`);
  
  if (filtered2.length > 0) {
    console.log('\n✅ Products found with URL params!');
  } else {
    console.log('\n❌ Still no products found!');
  }
}

testURLNavigation()
  .then(() => {
    console.log('\n✅ Test complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
