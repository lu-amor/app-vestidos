import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Solo aplicar middleware a rutas admin
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminSession = request.cookies.get('gr_admin');
    
    console.log('Middleware: Checking admin access for:', pathname);
    console.log('Middleware: Session cookie:', adminSession?.value ? 'present' : 'missing');
    
    if (!adminSession?.value) {
      console.log('Middleware: No session found, redirecting to login');
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    console.log('Middleware: Session valid, allowing access');
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*'
};