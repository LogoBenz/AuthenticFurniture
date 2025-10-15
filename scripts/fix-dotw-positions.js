const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixPositions() {
  console.log('🔧 Fixing DOTW positions...\n');

  // Get all DOTW products
  const { data: products } = await supabase
    .from('products')
    .select('id, name, deal_priority')
    .eq('is_featured_deal', true)
    .order('deal_priority', { ascending: true });

  if (!products || products.length === 0) {
    console.log('No DOTW products found');
    return;
  }

  console.log('Current positions:');
  products.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name} - Position ${p.deal_priority}`);
  });

  console.log('\n📝 Reassigning to positions 1-7...');

  // Reassign to positions 1-7
  for (let i = 0; i < products.length && i < 7; i++) {
    const newPosition = i + 1;
    await supabase
      .from('products')
      .update({ deal_priority: newPosition })
      .eq('id', products[i].id);
    
    console.log(`✅ ${products[i].name} → Position ${newPosition}`);
  }

  console.log('\n✨ Done! Positions 1-2 will be big cards, 3-7 will be normal cards.');
}

fixPositions();
