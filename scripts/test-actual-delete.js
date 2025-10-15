/**
 * Test ACTUAL Product Deletion
 * This will attempt to delete a test product
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

async function testActualDeletion() {
  console.log('🔍 Testing ACTUAL Product Deletion...\n');

  // Get the most recent product
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, name, created_at')
    .order('created_at', { ascending: false })
    .limit(1);

  if (fetchError || !products || products.length === 0) {
    console.error('❌ Could not fetch products:', fetchError);
    return;
  }

  const testProduct = products[0];
  console.log(`📦 Will attempt to delete: "${testProduct.name}" (ID: ${testProduct.id})\n`);

  // Step 1: Try to delete inventory first
  console.log('🔄 Step 1: Deleting inventory records...');
  const { data: deletedInv, error: invError } = await supabase
    .from('warehouse_products')
    .delete()
    .eq('product_id', testProduct.id)
    .select();

  if (invError) {
    console.error('❌ Inventory delete error:', invError);
    console.error('   Code:', invError.code);
    console.error('   Message:', invError.message);
    console.error('   Details:', invError.details);
    console.error('   Hint:', invError.hint);
  } else {
    console.log(`✅ Deleted ${deletedInv?.length || 0} inventory records`);
  }

  // Step 2: Try to delete the product
  console.log('\n🔄 Step 2: Deleting product...');
  const { data: deletedProduct, error: deleteError, status, statusText } = await supabase
    .from('products')
    .delete()
    .eq('id', testProduct.id)
    .select();

  console.log('\n📊 Delete Response:');
  console.log('   Status:', status, statusText);
  console.log('   Data:', deletedProduct);
  console.log('   Error:', deleteError);

  if (deleteError) {
    console.error('\n❌ DELETE FAILED!');
    console.error('   Code:', deleteError.code);
    console.error('   Message:', deleteError.message);
    console.error('   Details:', deleteError.details);
    console.error('   Hint:', deleteError.hint);
    
    if (deleteError.code === '42501') {
      console.error('\n🔒 RLS POLICY BLOCKING DELETE!');
      console.error('   Solution: Run this SQL in Supabase:');
      console.error('   CREATE POLICY "Allow public delete" ON products FOR DELETE USING (true);');
    }
  } else if (!deletedProduct || deletedProduct.length === 0) {
    console.error('\n⚠️ No rows deleted! RLS might be silently blocking the delete.');
    console.error('   Check your Supabase RLS policies.');
  } else {
    console.log('\n✅ Product deleted successfully!');
    console.log('   Deleted:', deletedProduct[0].name);
  }

  // Step 3: Verify deletion
  console.log('\n🔄 Step 3: Verifying deletion...');
  const { data: checkProduct, error: checkError } = await supabase
    .from('products')
    .select('id, name')
    .eq('id', testProduct.id)
    .maybeSingle();

  if (checkError) {
    console.error('❌ Error checking:', checkError);
  } else if (checkProduct) {
    console.error('❌ PRODUCT STILL EXISTS! Deletion did not work.');
  } else {
    console.log('✅ Product confirmed deleted from database');
  }
}

testActualDeletion().catch(console.error);
