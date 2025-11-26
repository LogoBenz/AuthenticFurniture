// Check wishlist products for image issues
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nufciijehcapowhhggcl.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZmNpaWplaGNhcG93aGhnZ2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMjEzNjksImV4cCI6MjA2NjY5NzM2OX0.IBOZuiEERx0QivGDKKiFzWAD_wWPWJUdw5opR4K7HZo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkWishlistImages() {
  console.log('🔍 Checking wishlist products for image issues...\n');
  
  // Get all products
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, images, image_url')
    .limit(10);
  
  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }
  
  console.log(`📊 Checking ${products.length} products:\n`);
  
  products.forEach(product => {
    console.log(`Product: ${product.name} (ID: ${product.id})`);
    console.log(`  images field: ${JSON.stringify(product.images)}`);
    console.log(`  image_url field: ${product.image_url || 'null'}`);
    
    // Check validity
    const hasValidImage = (
      (product.image_url && typeof product.image_url === 'string' && product.image_url.trim()) ||
      (Array.isArray(product.images) && product.images.length > 0 && typeof product.images[0] === 'string' && product.images[0].trim()) ||
      (typeof product.images === 'string' && product.images.trim())
    );
    
    if (hasValidImage) {
      console.log(`  ✅ Has valid image`);
    } else {
      console.log(`  ❌ NO VALID IMAGE - This will cause errors!`);
    }
    console.log('');
  });
}

checkWishlistImages();
