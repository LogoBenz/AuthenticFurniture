const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nufciijehcapowhhggcl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZmNpaWplaGNhcG93aGhnZ2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMjEzNjksImV4cCI6MjA2NjY5NzM2OX0.IBOZuiEERx0QivGDKKiFzWAD_wWPWJUdw5opR4K7HZo'
);

async function createMissingSubcategories() {
  console.log('🔧 Creating missing subcategories...\n');

  try {
    // Get spaces
    const { data: spaces, error: spacesError } = await supabase
      .from('spaces')
      .select('id, name, slug');

    if (spacesError) {
      console.error('❌ Error fetching spaces:', spacesError);
      return;
    }

    // Find space IDs
    const officeSpace = spaces.find(s => s.slug === 'office');
    const homeSpace = spaces.find(s => s.slug === 'home');
    const hotelSpace = spaces.find(s => s.slug === 'hotel-lounge-school');

    if (!officeSpace || !homeSpace) {
      console.error('❌ Required spaces not found');
      return;
    }

    // Define missing subcategories
    const newSubcategories = [
      // Office space
      { space_id: officeSpace.id, name: 'Office Desks', slug: 'office-desks', icon: 'Table', sort_order: 10 },
      { space_id: officeSpace.id, name: 'Reception Desks', slug: 'reception-desks', icon: 'Table', sort_order: 11 },
      { space_id: officeSpace.id, name: 'Storage Cabinets', slug: 'storage-cabinets', icon: 'Archive', sort_order: 12 },
      
      // Home space
      { space_id: homeSpace.id, name: 'Living Room', slug: 'living-room', icon: 'Sofa', sort_order: 10 },
      { space_id: homeSpace.id, name: 'Lounge Chairs', slug: 'lounge-chairs', icon: 'Armchair', sort_order: 11 },
      { space_id: homeSpace.id, name: 'Gaming Chairs', slug: 'gaming-chairs', icon: 'Armchair', sort_order: 12 },
      
      // Hotel/Lounge/School space
      { space_id: hotelSpace.id, name: 'Conference Furniture', slug: 'conference-furniture', icon: 'Users', sort_order: 10 },
    ];

    console.log('📝 Creating subcategories:\n');

    for (const sub of newSubcategories) {
      const { data, error } = await supabase
        .from('subcategories')
        .insert({
          space_id: sub.space_id,
          name: sub.name,
          slug: sub.slug,
          description: `Browse our ${sub.name.toLowerCase()} collection`,
          icon: sub.icon,
          sort_order: sub.sort_order,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          console.log(`⚠️  ${sub.name} already exists`);
        } else {
          console.error(`❌ Error creating ${sub.name}:`, error);
        }
      } else {
        console.log(`✅ Created: ${sub.name}`);
      }
    }

    console.log('\n🎉 Done! Now run: node scripts/fix-product-relationships.js');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createMissingSubcategories();
