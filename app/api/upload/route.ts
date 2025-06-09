import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
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
    const ext = file.name.split('.').pop();
    const filename = `${uuidv4()}.${ext}`;
    const uploadDir = join(process.cwd(), 'uploads', type);

    // Создаем папку, если нет
    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Возвращаем URL для доступа через API
    const imageUrl = `/api/uploads/${type}/${filename}`;

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
