const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nufciijehcapowhhggcl.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZmNpaWplaGNhcG93aGhnZ2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMjEzNjksImV4cCI6MjA2NjY5NzM2OX0.IBOZuiEERx0QivGDKKiFzWAD_wWPWJUdw5opR4K7HZo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkWishlistTable() {
  console.log('🔍 Checking if wishlists table exists...\n');
  
  try {
    // Try to query the wishlists table
    const { data, error } = await supabase
      .from('wishlists')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        console.log('❌ wishlists table does NOT exist');
        console.log('\nYou need to run the migration. Options:');
        console.log('1. If using Supabase CLI: npx supabase db reset');
        console.log('2. If using Supabase Dashboard: Go to SQL Editor and run the migration file');
        console.log('3. Migration file: supabase/migrations/20251028114253_create_wishlists_table.sql');
      } else {
        console.log('❌ Error checking table:', error.message);
        console.log('Error code:', error.code);
      }
      return false;
    }
    
    console.log('✅ wishlists table EXISTS!');
    console.log(`📊 Current records: ${data?.length || 0}`);
    console.log('\n✅ Migration successful! The wishlist feature is ready to use.');
    
    return true;
  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
    return false;
  }
}

checkWishlistTable();
