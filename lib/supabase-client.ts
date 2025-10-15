/**
 * Authenticated Supabase Client for Browser
 * This client includes the user's session token automatically
 */

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a client that persists and uses the user's session
export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

// Export a singleton instance for convenience
export const supabase = createClient();
