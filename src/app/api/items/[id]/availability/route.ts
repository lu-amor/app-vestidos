import { NextResponse } from "next/server";
import {getItem, getItemRentals} from "@/lib/RentalManagementSystem";

export async function GET(req: Request, context?: { params?: { id?: string } }) {
  // Next may provide `params` asynchronously for dynamic routes; await before using.
  const params = await context?.params;
  const idStr = params?.id;
  if (!idStr) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const id = Number(idStr);
  const item = getItem(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const rentals = getItemRentals(id).map((r) => ({ start: r.start, end: r.end }));
  return NextResponse.json({ rentals });
}
