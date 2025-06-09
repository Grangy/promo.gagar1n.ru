import { NextResponse } from 'next/server';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

interface Params {
  path: string[];
}

export async function GET(request: Request, context: { params: Params }) {
  const params = await Promise.resolve(context.params);
  const { path } = params;

  const filePath = join(process.cwd(), 'uploads', ...path);

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const fileBuffer = readFileSync(filePath);

  const ext = path[path.length - 1].split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
  };
  const contentType = mimeTypes[ext ?? ''] || 'application/octet-stream';

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': contentType,
    },
  });
}
