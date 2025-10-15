/**
 * Verify your admin role is set correctly
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyAdminRole() {
  console.log('🔍 Checking admin roles...\n');

  // Get all users and their roles
  const { data: users, error } = await supabase
    .from('auth.users')
    .select('id, email, raw_user_meta_data, raw_app_meta_data');

  if (error) {
    console.log('⚠️ Cannot query auth.users directly, trying alternative method...\n');
    
    // Alternative: Check via RPC or direct SQL
    console.log('📝 Run this SQL in Supabase Dashboard to check your role:\n');
    console.log('SELECT email, raw_user_meta_data, raw_app_meta_data FROM auth.users;');
    console.log('\nLook for your email and check if raw_user_meta_data contains {"role": "admin"}');
    return;
  }

  if (!users || users.length === 0) {
    console.log('❌ No users found');
    return;
  }

  console.log('👥 All users and their roles:\n');
  users.forEach((user, i) => {
    const userRole = user.raw_user_meta_data?.role;
    const appRole = user.raw_app_meta_data?.role;
    const isAdmin = userRole === 'admin' || appRole === 'admin';
    
    console.log(`${i + 1}. ${user.email}`);
    console.log(`   User Metadata Role: ${userRole || 'none'}`);
    console.log(`   App Metadata Role: ${appRole || 'none'}`);
    console.log(`   Is Admin: ${isAdmin ? '✅ YES' : '❌ NO'}`);
    console.log('');
  });

  const admins = users.filter(u => 
    u.raw_user_meta_data?.role === 'admin' || 
    u.raw_app_meta_data?.role === 'admin'
  );

  if (admins.length === 0) {
    console.log('⚠️ NO ADMIN USERS FOUND!');
    console.log('\n📝 To fix this, run this SQL in Supabase Dashboard:\n');
    console.log(`UPDATE auth.users`);
    console.log(`SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb`);
    console.log(`WHERE email = 'YOUR-EMAIL@example.com';`);
  } else {
    console.log(`✅ Found ${admins.length} admin user(s)`);
  }
}

verifyAdminRole().catch(console.error);
