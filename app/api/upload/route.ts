import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const type = formData.get('type') as string; // 'offer' or 'event'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    if (!['offer', 'event'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type, must be "offer" or "event"' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${uuidv4()}-${file.name.replace(/\s/g, '_')}`;
    const folder = type === 'offer' ? 'offer' : 'event';
    const filePath = join(process.cwd(), 'public', folder, filename);

    await writeFile(filePath, buffer);
    const imageUrl = `/${folder}/${filename}`;

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}