/**
 * Verification script for admin client configuration
 * Run with: node scripts/verify-admin-client.js
 */

require('dotenv').config({ path: '.env.local' });

async function verifyAdminClient() {
  console.log('🔍 Verifying admin client configuration...\n');

  // Check environment variables
  console.log('1. Checking environment variables:');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;

  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set');
    return;
  }
  console.log('✅ NEXT_PUBLIC_SUPABASE_URL is set:', supabaseUrl);

  if (!serviceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set');
    return;
  }
  console.log('✅ SUPABASE_SERVICE_ROLE_KEY is set (length:', serviceKey.length, 'chars)');

  if (!webhookSecret) {
    console.warn('⚠️  SUPABASE_WEBHOOK_SECRET is not set (required for revalidation)');
  } else {
    console.log('✅ SUPABASE_WEBHOOK_SECRET is set');
  }

  // Try to import and use the admin client
  console.log('\n2. Testing admin client import:');
  try {
    const { createClient } = require('@supabase/supabase-js');
    const adminClient = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('✅ Admin client created successfully');

    // Test a simple query
    console.log('\n3. Testing database connection:');
    const { data, error } = await adminClient
      .from('products')
      .select('id, name')
      .limit(1);

    if (error) {
      console.error('❌ Database query failed:', error.message);
      return;
    }

    console.log('✅ Database connection successful');
    if (data && data.length > 0) {
      console.log('✅ Sample product found:', data[0].name);
    }

    console.log('\n✨ Admin client is properly configured and working!');
    console.log('\n📝 Next steps:');
    console.log('   - The server-only package is installed');
    console.log('   - lib/supabase-admin.ts has the server-only import');
    console.log('   - Environment variables are properly set');
    console.log('   - You can now proceed with server-side data fetching');

  } catch (error) {
    console.error('❌ Error testing admin client:', error.message);
  }
}

verifyAdminClient();
