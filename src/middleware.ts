import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase credentials are not configured, allow local development without blocking
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options
        });
        response = NextResponse.next({
          request: {
            headers: request.headers
          }
        });
        response.cookies.set({
          name,
          value,
          ...options
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: '',
          ...options
        });
        response = NextResponse.next({
          request: {
            headers: request.headers
          }
        });
        response.cookies.set({
          name,
          value: '',
          ...options
        });
      }
    }
  });

  const { data: { user } } = await supabase.auth.getUser();

  // Guard protected game & onboarding routes if user is not authenticated
  const protectedPrefixes = ['/dashboard', '/onboarding', '/agency', '/office'];
  const isProtectedPath = protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix));

  if (isProtectedPath && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect already-authenticated users away from auth pages
  const authPaths = ['/login', '/register'];
  const isAuthPath = authPaths.includes(request.nextUrl.pathname);
  if (isAuthPath && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/assets (streaming raw 3D assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/assets).*)'
  ]
};

