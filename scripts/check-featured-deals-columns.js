const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkColumns() {
  console.log('🔍 Checking if featured deals columns exist...\n');

  // Try to query with the new columns
  const { data, error } = await supabase
    .from('products')
    .select('id, name, is_featured_deal, deal_priority')
    .limit(1);

  if (error) {
    console.error('❌ Error - columns might not exist:', error.message);
    console.log('\n💡 Run this in Supabase SQL Editor:');
    console.log(`
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_featured_deal BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deal_priority INTEGER DEFAULT 5;
    `);
    return;
  }

  console.log('✅ Columns exist!');
  console.log('Sample data:', data);
  
  // Check how many products have featured deals enabled
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_featured_deal', true);

  console.log(`\n📊 Products with "Deals of the Week" enabled: ${count || 0}`);
}

checkColumns();
