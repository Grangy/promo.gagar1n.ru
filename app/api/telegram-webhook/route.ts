import { NextResponse } from 'next/server';

export async function POST() {
  // Здесь можно логировать входящие update или отключить webhook
  return NextResponse.json({ ok: true });
}