import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const PUBLIC_ROUTES = [
  '/', '/shop', '/collections', '/journal', '/our-heritage',
  '/atelier-archive', '/contact', '/faq', '/size-guide', '/shipping',
  '/refund-policy', '/terms-conditions', '/privacy-policy', '/cookie-policy',
  '/sitemap', '/sahib-ali-foundation', '/bulk-events', '/custom-order',
  '/thank-you', '/pages', '/auth/login', '/auth/register', '/auth/reset-password',
  '/auth/callback', '/auth/confirm',
];

function isPublic(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  if (pathname.startsWith('/shop/')) return true;
  if (pathname.startsWith('/collections/')) return true;
  if (pathname.startsWith('/journal/')) return true;
  if (pathname.startsWith('/pages/')) return true;
  if (pathname.startsWith('/_next')) return true;
  if (pathname.startsWith('/api/public')) return true;
  if (pathname.startsWith('/uploads')) return true;
  if (pathname.includes('.')) return true; // static files
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { response, user } = await updateSession(request);

  // Allow all public storefront + auth routes through
  if (isPublic(pathname)) {
    return response;
  }

  // All other routes require auth:
  //   /admin/*  → any authenticated non-customer
  //   /account/* → any authenticated user
  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/auth/login';
    loginUrl.searchParams.set('next', pathname);
    return Response.redirect(loginUrl);
  }

  // For /admin/*: also block customers (staff only)
  if (pathname.startsWith('/admin')) {
    // We need the user's role to decide. We do a lightweight fetch via the
    // same cookie-bound client by relying on the public profiles table
    // (or fall back to JWT claims where available).
    // The check happens here only as a redirect hint — actual enforcement
    // also happens in the admin layout server component.
    const roleFromClaims =
      (user.app_metadata?.role as string | undefined) ||
      (user.user_metadata?.role as string | undefined);

    if (roleFromClaims === 'customer') {
      const accountUrl = request.nextUrl.clone();
      accountUrl.pathname = '/account';
      accountUrl.search = '';
      return Response.redirect(accountUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Run on every request except static assets and image optimizer
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
