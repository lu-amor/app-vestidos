import { NextResponse } from "next/server";
import { isAdmin } from "../../../../../../../lib/CsrfSessionManagement";
import { cancelRental } from "../../../../../../../lib/RentalManagementSystem";

export async function POST(request: Request, { params }: { params: any }) {
  // Verificar cookie directamente desde headers
  const cookieHeader = request.headers.get('cookie');
  const sessionCookie = cookieHeader?.includes('gr_admin=');
  
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const { error } = cancelRental(params.id);
  if (error) return NextResponse.json({ error }, { status: 404 });
  return NextResponse.json({ ok: true });
}
