import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
function isValidSupabaseConfig(): boolean {
  return !!(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.trim() !== '' && 
    supabaseAnonKey.trim() !== '' &&
    supabaseUrl.startsWith('http') &&
    supabaseUrl.includes('supabase.co')
  );
}

// Create a proper dummy client that doesn't make network requests
function createDummyClient() {
  const dummyResponse = { data: [], error: null };
  const dummyErrorResponse = { data: null, error: new Error('Supabase not configured') };

  // Helper to mimic the query builder
  function builder(response: any) {
    return {
      select: () => Promise.resolve({ data: response.data, error: response.error }),
      insert: () => builder(dummyErrorResponse),
      update: () => builder(dummyErrorResponse),
      delete: () => builder(dummyErrorResponse),
      order: () => builder(response),
      eq: () => builder(response),
      single: () => Promise.resolve({ data: response.data, error: response.error }),
      then: undefined as any,
    };
  }

  return {
    from: () => builder(dummyResponse),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    },
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    }
  };
}

// Enhanced fetch wrapper with better error handling
function createEnhancedFetch() {
  return async (url: string, options: any = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // Increased to 30 seconds
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit'
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // Log the error for debugging but don't throw
      console.warn('Supabase connection failed:', {
        url,
        error: error.message,
        type: error.name,
        code: error.code
      });
      
      // Return a mock response that indicates failure but doesn't crash the app
      return new Response(
        JSON.stringify({ 
          error: { 
            message: 'Network connection failed',
            details: error.message,
            code: error.code || 'NETWORK_ERROR',
            name: error.name || 'NetworkError'
          } 
        }),
        { 
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  };
}

// Create the Supabase client
let supabaseClient;

if (!isValidSupabaseConfig()) {
  console.warn('Supabase configuration missing or invalid. Using fallback mode.');
  supabaseClient = createDummyClient();
} else {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      global: {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        fetch: createEnhancedFetch()
      }
    });
  } catch (error) {
    console.warn('Failed to create Supabase client:', error);
    supabaseClient = createDummyClient();
  }
}

export const supabase = supabaseClient;

// Admin client for server-side operations
export const createAdminClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseServiceKey || !supabaseUrl) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL environment variable.');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
};