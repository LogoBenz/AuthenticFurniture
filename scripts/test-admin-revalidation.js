/**
 * Test script to verify admin revalidation integration
 * This simulates what happens when admin performs CRUD operations
 * 
 * Run with: node scripts/test-admin-revalidation.js
 */

require('dotenv').config({ path: '.env.local' });

async function testRevalidation(type, record, old_record) {
  const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error('❌ SUPABASE_WEBHOOK_SECRET not found in .env.local');
    return false;
  }

  try {
    const response = await fetch('http://localhost:3000/api/revalidate-products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${webhookSecret}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type, record, old_record })
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✅ ${type} revalidation successful`);
      console.log('   Paths revalidated:', data.paths);
      return true;
    } else {
      console.error(`❌ ${type} revalidation failed:`, data);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error testing ${type}:`, error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing Admin Revalidation Integration\n');
  console.log('Make sure your dev server is running: npm run dev\n');

  // Test 1: Product Creation (INSERT)
  console.log('Test 1: Product Creation (INSERT)');
  await testRevalidation('INSERT', {
    id: 'test-123',
    slug: 'test-office-chair',
    name: 'Test Office Chair',
    is_featured: false,
    is_featured_deal: false
  });
  console.log('');

  // Test 2: Product Update (UPDATE) - No slug change
  console.log('Test 2: Product Update (UPDATE) - No slug change');
  await testRevalidation('UPDATE', {
    id: 'test-123',
    slug: 'test-office-chair',
    name: 'Test Office Chair - Updated',
    is_featured: true,
    is_featured_deal: false
  }, {
    slug: 'test-office-chair',
    is_featured: false
  });
  console.log('');

  // Test 3: Product Update (UPDATE) - With slug change
  console.log('Test 3: Product Update (UPDATE) - With slug change');
  await testRevalidation('UPDATE', {
    id: 'test-123',
    slug: 'premium-office-chair',
    name: 'Premium Office Chair',
    is_featured: true,
    is_featured_deal: true
  }, {
    slug: 'test-office-chair',
    is_featured: true,
    is_featured_deal: false
  });
  console.log('');

  // Test 4: Product Deletion (DELETE)
  console.log('Test 4: Product Deletion (DELETE)');
  await testRevalidation('DELETE', {
    id: 'test-123',
    slug: 'premium-office-chair',
    is_featured: true,
    is_featured_deal: true
  });
  console.log('');

  console.log('✅ All tests completed!');
  console.log('\n📝 Summary:');
  console.log('   - INSERT: Revalidates /products and new product page');
  console.log('   - UPDATE: Revalidates /products, product page, and home (if featured)');
  console.log('   - UPDATE (slug change): Also revalidates old slug URL');
  console.log('   - DELETE: Revalidates /products and home (if featured)');
}

runTests();

