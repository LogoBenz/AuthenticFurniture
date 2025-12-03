/**
 * Authenticated Supabase Client for Admin Operations
 * Use this in admin pages to ensure operations include auth token
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

// For client components (admin pages)
export function createAuthenticatedClient() {
  return createClientComponentClient();
}

// For server components and API routes
export function createServerAuthClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase credentials');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Check if user is admin
export async function isUserAdmin(userId: string) {
  const supabase = createServerAuthClient();

  const { data, error } = await supabase.auth.admin.getUserById(userId);

  if (error || !data?.user) {
    return false;
  }

  const role = data.user.user_metadata?.role || data.user.app_metadata?.role;
  return role === 'admin';
}

// Get current user's role
export async function getCurrentUserRole() {
  const supabase = createAuthenticatedClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user.user_metadata?.role || user.app_metadata?.role || null;
}
