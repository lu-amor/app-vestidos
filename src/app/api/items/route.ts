import {NextResponse} from "next/server";
import {listItems, addItem, updateItem, deleteItem} from "../../../../lib/RentalManagementSystem";

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || undefined;
  const category = (searchParams.get("category") as any) || undefined;
  const size = searchParams.get("size") || undefined;
  const color = searchParams.get("color") || undefined;
  const style = searchParams.get("style") || undefined;

  const items = listItems({ q, category, size, color, style }).map((i) => ({
    id: i.id,
    name: i.name,
    category: i.category,
    pricePerDay: i.pricePerDay,
    sizes: i.sizes,
    color: i.color,
    style: i.style,
    image: i.images[0],
    alt: i.alt,
  }));

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  // Verificar autenticación
  const cookieHeader = request.headers.get('cookie');
  const sessionCookie = cookieHeader?.includes('gr_admin=');
  
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, category, pricePerDay, sizes, color, style, description, images } = body;

    // Validar campos requeridos
    if (!name || !category || !pricePerDay || !sizes || !color) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newItem = {
      name,
      category,
      pricePerDay: Number(pricePerDay),
      sizes: Array.isArray(sizes) ? sizes : [sizes],
      color,
      style: style || category,
      description: description || `${name} - ${color}`,
      images: images || ['/images/placeholder.jpg'],
      alt: `${name} in ${color}`
    };

    const result = addItem(newItem);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, item: result.item }, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
