import { supabase } from '@/lib/supabase-simple';

import { Space, Subcategory } from '@/types';

// Check if Supabase is properly configured
function isSupabaseConfigured(): boolean {
  // Always return true since we're using direct config
  return true;
}

// Map Supabase row to Space
export function mapSupabaseRowToSpace(row: any): Space {
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
export function mapSupabaseRowToSubcategory(row: any): Subcategory {
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
