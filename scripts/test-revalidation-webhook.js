/**
 * Test the revalidation webhook
 * Run with: node scripts/test-revalidation-webhook.js
 */

require('dotenv').config({ path: '.env.local' });

async function testWebhook() {
  const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error('❌ SUPABASE_WEBHOOK_SECRET not found in .env.local');
    return;
  }

  console.log('🧪 Testing revalidation webhook...\n');

  const testPayload = {
    type: 'UPDATE',
    record: {
      id: '123',
      slug: 'test-product',
      name: 'Test Product',
      is_featured: true
    },
    old_record: {
      slug: 'test-product'
    }
  };

  try {
    const response = await fetch('http://localhost:3000/api/revalidate-products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${webhookSecret}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testPayload)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Webhook test successful!');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.error('❌ Webhook test failed');
      console.error('Status:', response.status);
      console.error('Response:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Error testing webhook:', error.message);
    console.log('\n💡 Make sure your dev server is running: npm run dev');
  }
}

testWebhook();
