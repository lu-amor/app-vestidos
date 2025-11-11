import { NextResponse } from "next/server";
import { isAdmin } from "../../../../../../../lib/CsrfSessionManagement";
import { cancelRental } from "../../../../../../../lib/RentalManagementSystem";

export async function POST(req: Request, context?: { params?: { id?: string } }) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const params = await context?.params;
  const id = params?.id;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { error } = cancelRental(id);
  if (error) return NextResponse.json({ error }, { status: 404 });
  return NextResponse.json({ ok: true });
}
