'use server';

import { createAdminClient } from '@/lib/supabase-admin';
import { Space, Subcategory } from '@/types';
import { mapSupabaseRowToSpace, mapSupabaseRowToSubcategory } from '@/lib/categories';

// Admin functions
export async function createSpace(spaceData: Partial<Space>): Promise<Space | null> {
    const supabase = createAdminClient();

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
    const supabase = createAdminClient();

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
    const supabase = createAdminClient();

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
    const supabase = createAdminClient();

    try {
        // Use admin client to bypass RLS
        const { data, error } = await supabase
            .from('subcategories')
            .insert([subcategoryData])
            .select()
            .single();

        if (error) {
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
    const supabase = createAdminClient();

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
    const supabase = createAdminClient();

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
