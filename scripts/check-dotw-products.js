const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDOTW() {
  console.log('🔍 Checking Deals of the Week products...\n');

  const { data, error } = await supabase
    .from('products')
    .select('id, name, is_featured_deal, deal_priority')
    .eq('is_featured_deal', true)
    .order('deal_priority', { ascending: true });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('📊 Products with DOTW enabled (sorted by priority):');
  data.forEach((product, index) => {
    console.log(`${index + 1}. [Position ${product.deal_priority}] ${product.name}`);
  });
}

checkDOTW();
