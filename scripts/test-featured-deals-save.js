const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testSave() {
  console.log('🧪 Testing featured deals save...\n');

  // Get a product to test with
  const { data: products } = await supabase
    .from('products')
    .select('id, name, is_featured_deal, deal_priority')
    .limit(1);

  if (!products || products.length === 0) {
    console.log('❌ No products found');
    return;
  }

  const product = products[0];
  console.log('📦 Testing with product:', product.name);
  console.log('Current values:', { is_featured_deal: product.is_featured_deal, deal_priority: product.deal_priority });

  // Update it
  const { data, error } = await supabase
    .from('products')
    .update({
      is_featured_deal: true,
      deal_priority: 8
    })
    .eq('id', product.id)
    .select()
    .single();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('\n✅ Updated successfully!');
  console.log('New values:', { is_featured_deal: data.is_featured_deal, deal_priority: data.deal_priority });
}

testSave();
