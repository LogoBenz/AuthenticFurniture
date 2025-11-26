// NOTE: Temporarily removed 'server-only' import because lib/categories.ts uses this
// and is imported by client components. Will add back after refactoring.
// TODO: Add back 'server-only' after refactoring client components

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Only validate on server-side (where these variables should exist)
const isServer = typeof window === 'undefined'

if (isServer && (!supabaseUrl || !supabaseServiceKey)) {
  console.error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  // Don't throw on client side - just log the error
}

// Admin client with service role key - bypasses RLS
// This should ONLY be used in server components, API routes, and server actions
export const supabaseAdmin = isServer && supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null as any // Null on client side - should never be used there

// Helper function to create a new admin client instance
// Use this when you need a fresh client instance
export function createAdminClient() {
  // Only create on server side
  if (!isServer) {
    console.error('createAdminClient() should only be called on the server')
    return null as any
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local'
    )
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
