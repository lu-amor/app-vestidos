import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowed = /\.(jpe?g|png|gif|webp|svg)$/i;
    const origName = (file as any).name ?? 'upload';
    const ext = path.extname(origName);
    if (!allowed.test(ext)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const publicDir = path.join(process.cwd(), 'public', 'images', 'dresses');
    fs.mkdirSync(publicDir, { recursive: true });
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const dest = path.join(publicDir, filename);
    fs.writeFileSync(dest, buffer);

    return NextResponse.json({ path: `/images/dresses/${filename}` });
  } catch (err) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
