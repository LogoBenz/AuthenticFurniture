import { supabase } from '@/lib/supabase-simple';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Space, Subcategory } from '@/types';

// Check if Supabase is properly configured
function isSupabaseConfigured(): boolean {
  // Always return true since we're using direct config
  return true;
}

// Map Supabase row to Space
function mapSupabaseRowToSpace(row: any): Space {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    icon: row.icon,
    sort_order: row.sort_order,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at,
    subcategories: row.subcategories || []
  };
}

// Map Supabase row to Subcategory
function mapSupabaseRowToSubcategory(row: any): Subcategory {
  return {
    id: row.id,
    space_id: row.space_id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    icon: row.icon,
    sort_order: row.sort_order,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at,
    space: row.space ? mapSupabaseRowToSpace(row.space) : undefined
  };
}

// Get all active spaces with their subcategories
export async function getAllSpaces(): Promise<Space[]> {
  if (!isSupabaseConfigured()) {
    console.warn('⚠️ Supabase not configured, using fallback data');
    return getFallbackSpaces();
  }

  try {
    const { data, error } = await supabase
      .from('spaces')
      .select(`
        *,
        subcategories (*)
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching spaces:', error);
      return getFallbackSpaces();
    }

    return data.map(mapSupabaseRowToSpace);
  } catch (error) {
    console.error('Error fetching spaces:', error);
    return getFallbackSpaces();
  }
}

// Get spaces for navigation (with subcategories)
export async function getSpacesForNavigation(): Promise<Space[]> {
  if (!isSupabaseConfigured()) {
    return getFallbackSpaces();
  }

  try {
    const { data, error } = await supabase
      .from('spaces')
      .select(`
        *,
        subcategories (*)
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching spaces for navigation:', error);
      return getFallbackSpaces();
    }

    return data.map(mapSupabaseRowToSpace);
  } catch (error) {
    console.error('Error fetching spaces for navigation:', error);
    return getFallbackSpaces();
  }
}

// Get subcategories by space ID
export async function getSubcategoriesBySpace(spaceId: string): Promise<Subcategory[]> {
  if (!isSupabaseConfigured()) {
    return getFallbackSubcategories(spaceId);
  }

  try {
    const { data, error } = await supabase
      .from('subcategories')
      .select('*')
      .eq('space_id', spaceId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching subcategories:', error);
      return getFallbackSubcategories(spaceId);
    }

    return data.map(mapSupabaseRowToSubcategory);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return getFallbackSubcategories(spaceId);
  }
}

// Get space by slug
export async function getSpaceBySlug(slug: string): Promise<Space | null> {
  if (!isSupabaseConfigured()) {
    const spaces = getFallbackSpaces();
    return spaces.find(space => space.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from('spaces')
      .select(`
        *,
        subcategories (*)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching space by slug:', error);
      return null;
    }

    return mapSupabaseRowToSpace(data);
  } catch (error) {
    console.error('Error fetching space by slug:', error);
    return null;
  }
}

// Get subcategory by slug
export async function getSubcategoryBySlug(slug: string): Promise<Subcategory | null> {
  if (!isSupabaseConfigured()) {
    const spaces = getFallbackSpaces();
    for (const space of spaces) {
      const subcategory = space.subcategories?.find(sub => sub.slug === slug);
      if (subcategory) return subcategory;
    }
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('subcategories')
      .select(`
        *,
        space (*)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching subcategory by slug:', error);
      return null;
    }

    return mapSupabaseRowToSubcategory(data);
  } catch (error) {
    console.error('Error fetching subcategory by slug:', error);
    return null;
  }
}

// Admin functions
export async function createSpace(spaceData: Partial<Space>): Promise<Space | null> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, cannot create space');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('spaces')
      .insert([spaceData])
      .select()
      .single();

    if (error) {
      console.error('Error creating space:', error);
      return null;
    }

    return mapSupabaseRowToSpace(data);
  } catch (error) {
    console.error('Error creating space:', error);
    return null;
  }
}

export async function updateSpace(id: string, spaceData: Partial<Space>): Promise<Space | null> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, cannot update space');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('spaces')
      .update(spaceData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating space:', error);
      return null;
    }

    return mapSupabaseRowToSpace(data);
  } catch (error) {
    console.error('Error updating space:', error);
    return null;
  }
}

export async function deleteSpace(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, cannot delete space');
    return false;
  }

  try {
    const { error } = await supabase
      .from('spaces')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting space:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting space:', error);
    return false;
  }
}

export async function createSubcategory(subcategoryData: Partial<Subcategory>): Promise<Subcategory | null> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, cannot create subcategory');
    return null;
  }

  try {
    // Use admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('subcategories')
      .insert([subcategoryData])
      .select()
      .single();

    if (error) {
      // Check if it's an RLS policy error
      if (error.message?.includes('row-level security policy')) {
        console.warn('⚠️ Permission denied: Please ensure you are logged in as an admin');
        throw new Error('Permission denied. Admin authentication required.');
      }
      console.error('Error creating subcategory:', error.message || error);
      throw new Error(`Failed to create subcategory: ${error.message || 'Unknown error'}`);
    }

    return mapSupabaseRowToSubcategory(data);
  } catch (error) {
    console.error('Error creating subcategory:', error);
    return null;
  }
}

export async function updateSubcategory(id: string, subcategoryData: Partial<Subcategory>): Promise<Subcategory | null> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, cannot update subcategory');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('subcategories')
      .update(subcategoryData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating subcategory:', error);
      return null;
    }

    return mapSupabaseRowToSubcategory(data);
  } catch (error) {
    console.error('Error updating subcategory:', error);
    return null;
  }
}

export async function deleteSubcategory(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, cannot delete subcategory');
    return false;
  }

  try {
    const { error } = await supabase
      .from('subcategories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting subcategory:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    return false;
  }
}

// Fallback data
function getFallbackSpaces(): Space[] {
  return [
    {
      id: '1',
      name: 'Home',
      slug: 'home',
      description: 'Furniture for residential spaces',
      icon: 'Home',
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subcategories: [
        {
          id: '1-1',
          space_id: '1',
          name: 'Sofa Sets',
          slug: 'sofa-sets',
          description: 'Complete living room sofa collections',
          icon: 'Sofa',
          sort_order: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '1-2',
          space_id: '1',
          name: 'Beds',
          slug: 'beds',
          description: 'Bedroom furniture and bed frames',
          icon: 'Bed',
          sort_order: 2,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '1-3',
          space_id: '1',
          name: 'Cabinets',
          slug: 'cabinets',
          description: 'Storage cabinets and wardrobes',
          icon: 'Archive',
          sort_order: 3,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '1-4',
          space_id: '1',
          name: 'Dining Sets',
          slug: 'dining-sets',
          description: 'Complete dining room furniture',
          icon: 'Table',
          sort_order: 4,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    },
    {
      id: '2',
      name: 'Office',
      slug: 'office',
      description: 'Professional office furniture',
      icon: 'Briefcase',
      sort_order: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subcategories: [
        {
          id: '2-1',
          space_id: '2',
          name: 'Desks & Tables',
          slug: 'desks-tables',
          description: 'Office desks and work tables',
          icon: 'Table',
          sort_order: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2-2',
          space_id: '2',
          name: 'Office Chairs',
          slug: 'office-chairs',
          description: 'Ergonomic office seating',
          icon: 'GraduationCap',
          sort_order: 2,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    }
  ];
}

function getFallbackSubcategories(spaceId: string): Subcategory[] {
  const spaces = getFallbackSpaces();
  const space = spaces.find(s => s.id === spaceId);
  return space?.subcategories || [];
}
