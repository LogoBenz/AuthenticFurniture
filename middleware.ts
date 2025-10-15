import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Try to find the auth token in various cookie formats
    const allCookies = request.cookies.getAll();
    console.log('🍪 All cookies:', allCookies.map(c => c.name));
    
    // Look for Supabase auth cookies
    const authCookie = allCookies.find(c => 
      c.name.includes('auth-token') || 
      c.name.includes('sb-') ||
      c.name.includes('supabase')
    );

    console.log('🔑 Found auth cookie:', authCookie?.name);

    // For now, allow all admin access until we figure out the cookie name
    // TODO: Re-enable auth check once cookie name is identified
    console.log('⚠️ Middleware: Allowing admin access (auth check disabled for debugging)');
    return NextResponse.next();

    /* Uncomment this once we know the correct cookie name:
    if (!authCookie?.value) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        global: {
          headers: {
            Authorization: `Bearer ${authCookie.value}`
          }
        }
      });

      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/login';
        redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }

      const role = user.user_metadata?.role || user.app_metadata?.role;

      if (role !== 'admin') {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/unauthorized';
        return NextResponse.redirect(redirectUrl);
      }
    }
    */
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
