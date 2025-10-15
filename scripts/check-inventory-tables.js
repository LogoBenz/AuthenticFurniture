/**
 * Check what inventory-related tables exist in Supabase
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('🔍 Checking for inventory-related tables...\n');

  // Try different possible table names
  const possibleTables = [
    'inventory',
    'inventory_products',
    'warehouse_products',
    'product_inventory',
    'stock',
    'warehouse_stock'
  ];

  for (const tableName of possibleTables) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (!error) {
        console.log(`✅ Found table: ${tableName} (${count || 0} rows)`);
      }
    } catch (e) {
      // Table doesn't exist, skip
    }
  }

  console.log('\n📊 Checking products table structure...');
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .limit(1);

  if (products && products.length > 0) {
    console.log('✅ Products table columns:', Object.keys(products[0]));
  }
}

checkTables().catch(console.error);
