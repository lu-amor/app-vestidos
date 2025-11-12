import { NextResponse } from "next/server";
import { setAdminSession, verifyCsrfToken } from "@/lib/CsrfSessionManagement";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const csrf = form.get("csrf")?.toString() ?? null;
    
    // For development, skip CSRF verification if token is test-csrf or empty
    const isDev = process.env.NODE_ENV === 'development';
    if (!isDev && !verifyCsrfToken(csrf)) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 400 });
    }
    
    const username = (form.get("username") || "").toString();
    const password = (form.get("password") || "").toString();

    const expectedPass = process.env.ADMIN_PASSWORD || "admin123";
    const expectedUsr = process.env.ADMIN_USERNAME || "admin";
    
    console.log('Login attempt:', {
      username,
      expectedUsr,
      passwordMatch: password === expectedPass,
      expectedPass: expectedPass.substring(0, 3) + '***' // Solo mostramos los primeros caracteres por seguridad
    });
    
    if (!username || username !== expectedUsr || password !== expectedPass) {
      console.log('Login failed: credentials mismatch');
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    console.log('Credentials valid, setting session...');
    const sessionToken = await setAdminSession();
    console.log('Session set with token:', sessionToken.substring(0, 8) + '***');
    
    // Create redirect response with cookie
    const url = new URL("/admin", req.url);
    const response = NextResponse.redirect(url);
    
    // Set the session cookie explicitly
    response.cookies.set('gr_admin', sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    console.log('Login successful, redirecting with session cookie');
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
