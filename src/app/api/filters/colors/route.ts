import { NextResponse } from 'next/server';
import { listColors, addColorOption } from '@/lib/RentalManagementSystem';

export function GET() {
  return NextResponse.json({ colors: listColors() });
}

export async function POST(req: Request) {
  // basic admin check via cookie
  const cookieHeader = req.headers.get('cookie');
  const sessionCookie = cookieHeader?.includes('gr_admin=');
  if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const color = body?.color;
    const result = addColorOption(color);
    if ((result as any).error) return NextResponse.json(result, { status: 400 });
    return NextResponse.json({ success: true, color: result.color }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
}
