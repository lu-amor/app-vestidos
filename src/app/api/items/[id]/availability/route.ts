import { NextResponse } from "next/server";
import { getItem, getItemRentals } from "@/lib/RentalManagementSystem";
export async function GET(_: Request, { params }: { params: any }) {
  // `params` may be a promise in the Next.js app router; await it before accessing properties.
  const p = await params;
  const id = Number(p.id);
  const item = getItem(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const rentals = getItemRentals(id).map((r) => ({ start: r.start, end: r.end }));
  return NextResponse.json({ rentals });
}
