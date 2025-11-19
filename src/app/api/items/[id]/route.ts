import {NextResponse} from "next/server";
import {getItem, updateItem, deleteItem} from "../../../../../lib/RentalManagementSystem";

export async function GET(request: Request, { params }: { params: any }) {
const resolvedParams = await params;
const id = parseInt(resolvedParams.id);
const item = await getItem(id);
  
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }
  
  return NextResponse.json({ item });
}

export async function PUT(request: Request, { params }: { params: any }) {
  // Verificar autenticación
  const cookieHeader = request.headers.get('cookie');
  const sessionCookie = cookieHeader?.includes('gr_admin=');
  
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
    const body = await request.json();
    const { name, category, pricePerDay, sizes, color, style, description, images } = body;

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (category !== undefined) updates.category = category;
    if (pricePerDay !== undefined) updates.pricePerDay = Number(pricePerDay);
    if (sizes !== undefined) updates.sizes = Array.isArray(sizes) ? sizes : [sizes];
    if (color !== undefined) updates.color = color;
    if (style !== undefined) updates.style = style;
    if (description !== undefined) updates.description = description;
    if (images !== undefined) updates.images = images;

    const result = updateItem(id, updates);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, item: result.item });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: any }) {
  // Verificar autenticación
  const cookieHeader = request.headers.get('cookie');
  const sessionCookie = cookieHeader?.includes('gr_admin=');
  
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
    const result = deleteItem(id);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}