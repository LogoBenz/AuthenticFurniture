/**
 * Test Product Deletion
 * Run this to test if product deletion is working in the database
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDeletion() {
  console.log('🔍 Testing Product Deletion...\n');

  // Step 1: Get all products
  console.log('📊 Step 1: Fetching all products...');
  const { data: allProducts, error: fetchError } = await supabase
    .from('products')
    .select('id, name, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (fetchError) {
    console.error('❌ Error fetching products:', fetchError);
    return;
  }

  console.log(`✅ Found ${allProducts.length} products (showing last 5):`);
  allProducts.forEach((p, i) => {
    console.log(`   ${i + 1}. ID: ${p.id} | Name: ${p.name}`);
  });

  if (allProducts.length === 0) {
    console.log('\n⚠️ No products found to test deletion');
    return;
  }

  // Step 2: Check if the first product has inventory
  const testProductId = allProducts[0].id;
  console.log(`\n📦 Step 2: Checking inventory for product ID: ${testProductId}...`);
  
  const { data: inventory, error: invError } = await supabase
    .from('warehouse_products')
    .select('*')
    .eq('product_id', testProductId);

  if (invError) {
    console.log('⚠️ Could not check inventory (table might not exist):', invError.message);
  } else {
    console.log(`✅ Found ${inventory?.length || 0} inventory records for this product`);
  }

  // Step 3: Try to delete (but don't actually delete - just test permissions)
  console.log(`\n🧪 Step 3: Testing delete permissions...`);
  
  // First, let's just try to select with the delete filter to see if we have access
  const { data: canAccess, error: accessError } = await supabase
    .from('products')
    .select('id')
    .eq('id', testProductId)
    .single();

  if (accessError) {
    console.error('❌ Cannot access product:', accessError);
    return;
  }

  console.log('✅ Can access product for deletion');

  // Step 4: Check RLS policies
  console.log('\n🔒 Step 4: Checking if RLS might be blocking deletes...');
  console.log('   Note: If deletion fails in the app, it might be due to:');
  console.log('   - Row Level Security (RLS) policies');
  console.log('   - Missing permissions on the anon key');
  console.log('   - Foreign key constraints');

  console.log('\n💡 To actually test deletion, uncomment the code below and run again:');
  console.log('   (This will delete the oldest product!)');
  console.log('\n/*');
  console.log('  const { error: deleteError } = await supabase');
  console.log('    .from("products")');
  console.log('    .delete()');
  console.log(`    .eq("id", "${testProductId}");`);
  console.log('  ');
  console.log('  if (deleteError) {');
  console.log('    console.error("❌ Delete failed:", deleteError);');
  console.log('  } else {');
  console.log('    console.log("✅ Product deleted successfully!");');
  console.log('  }');
  console.log('*/');
}

testDeletion().catch(console.error);
