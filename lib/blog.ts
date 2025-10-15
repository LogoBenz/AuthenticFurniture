import { supabase } from '@/lib/supabase-simple';
import { BlogPost, BlogCategory, BlogLike } from '@/types';

// Check if Supabase is properly configured
function isSupabaseConfigured(): boolean {
  // Always return true since we're using direct config
  return true;
}

// Get all published blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning empty blog posts');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category_info:blog_categories(*)
      `)
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllBlogPosts:', error);
    return [];
  }
}

// Get all blog posts (including unpublished) - for admin
export async function getAllBlogPostsAdmin(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning empty blog posts');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category_info:blog_categories(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllBlogPostsAdmin:', error);
    return [];
  }
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning null');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category_info:blog_categories(*)
      `)
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getBlogPostBySlug:', error);
    return null;
  }
}

// Get featured blog posts
export async function getFeaturedBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning empty featured posts');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category_info:blog_categories(*)
      `)
      .eq('published', true)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured blog posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getFeaturedBlogPosts:', error);
    return [];
  }
}

// Get blog posts by category
export async function getBlogPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning empty posts');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category_info:blog_categories(*)
      `)
      .eq('published', true)
      .eq('category', categorySlug)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts by category:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getBlogPostsByCategory:', error);
    return [];
  }
}

// Get all blog categories
export async function getAllBlogCategories(): Promise<BlogCategory[]> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning empty categories');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching blog categories:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllBlogCategories:', error);
    return [];
  }
}

// Create a new blog post
export async function createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'likes' | 'views'>): Promise<BlogPost | null> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Cannot create blog post.');
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select(`
        *,
        category_info:blog_categories(*)
      `)
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      throw new Error(`Failed to create blog post: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in createBlogPost:', error);
    throw error;
  }
}

// Update a blog post
export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Cannot update blog post.');
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        category_info:blog_categories(*)
      `)
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      throw new Error(`Failed to update blog post: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in updateBlogPost:', error);
    throw error;
  }
}

// Delete a blog post
export async function deleteBlogPost(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Cannot delete blog post.');
  }

  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blog post:', error);
      throw new Error(`Failed to delete blog post: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error('Error in deleteBlogPost:', error);
    throw error;
  }
}

// Like a blog post
export async function likeBlogPost(postId: string, userIp: string, userAgent?: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Cannot like blog post.');
  }

  try {
    // First, check if user has already liked this post
    const { data: existingLike, error: checkError } = await supabase
      .from('blog_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_ip', userIp)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing like:', checkError);
      throw new Error('Failed to check existing like');
    }

    if (existingLike) {
      // User has already liked this post
      return false;
    }

    // Add the like
    const { error: likeError } = await supabase
      .from('blog_likes')
      .insert([{
        post_id: postId,
        user_ip: userIp,
        user_agent: userAgent
      }]);

    if (likeError) {
      console.error('Error adding like:', likeError);
      throw new Error('Failed to like blog post');
    }

    // Update the likes count
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ likes: supabase.raw('likes + 1') })
      .eq('id', postId);

    if (updateError) {
      console.error('Error updating likes count:', updateError);
      // Don't throw here as the like was already added
    }

    return true;
  } catch (error) {
    console.error('Error in likeBlogPost:', error);
    throw error;
  }
}

// Increment view count
export async function incrementBlogPostViews(postId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    return;
  }

  try {
    await supabase
      .from('blog_posts')
      .update({ views: supabase.raw('views + 1') })
      .eq('id', postId);
  } catch (error) {
    console.error('Error incrementing views:', error);
    // Don't throw here as this is not critical
  }
}

// Search blog posts
export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning empty search results');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category_info:blog_categories(*)
      `)
      .eq('published', true)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching blog posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchBlogPosts:', error);
    return [];
  }
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// Format date for display
export function formatBlogDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
