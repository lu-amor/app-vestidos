import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/CsrfSessionManagement";
import { listRentals } from "@/lib/RentalManagementSystem";

export async function GET(request: Request) {
  // Verificar cookie directamente desde headers
  const cookieHeader = request.headers.get('cookie');
  const sessionCookie = cookieHeader?.includes('gr_admin=');
  
  console.log('API rentals: Cookie check:', {
    hasCookieHeader: !!cookieHeader,
    hasSessionCookie: !!sessionCookie,
    cookieHeader: cookieHeader?.substring(0, 50) + '...'
  });
  
  if (!sessionCookie) {
    console.log('API rentals: No session found, returning 401');
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  console.log('API rentals: Session found, returning data');
  return NextResponse.json({ rentals: listRentals() });
}
