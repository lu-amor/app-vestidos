import { NextResponse } from "next/server";
import { listItems, listItemIds } from "../../../../lib/RentalManagementSystem";

export function GET() {
  try {
    const items = listItems();
    return NextResponse.json({ count: items.length, ids: listItemIds(), items });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
