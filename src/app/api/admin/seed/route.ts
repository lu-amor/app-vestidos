import { NextResponse } from 'next/server';
import { addItem, createRental } from '@/lib/RentalManagementSystem';

export async function POST(req: Request) {
  const cookieHeader = req.headers.get('cookie');
  const sessionCookie = cookieHeader?.includes('gr_admin=');
  if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json().catch(() => ({}));
    const name = body.name || `Seed Item ${Date.now()}`;

    const { item, error: addErr } = addItem({
      name,
      category: 'dress',
      pricePerDay: 10,
      sizes: ['S','M'],
      color: 'black',
      style: 'test',
      description: name,
      images: ['/images/placeholder.jpg'],
      alt: name,
    });

    if (addErr) return NextResponse.json({ error: addErr }, { status: 400 });

    const start = body.start || '2025-11-20';
    const end = body.end || '2025-11-21';

    const { rental, error: rentErr } = createRental({
      itemId: item.id,
      start,
      end,
      customer: { name: 'Test Customer', email: 'test@example.com', phone: '+34123456789' },
    });

    if (rentErr) return NextResponse.json({ error: rentErr }, { status: 400 });

    return NextResponse.json({ item, rental }, { status: 201 });
  } catch (e) {
    console.error('Seed error', e);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}
