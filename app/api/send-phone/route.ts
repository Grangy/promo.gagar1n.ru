// my-app/app/api/send-phone/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  if (!phone || !/^\d{8,13}$/.test(phone)) {
    return NextResponse.json({ success: false, message: 'Некорректный номер' }, { status: 400 });
  }

  // Здесь укажи свой вебхук
  const webhookUrl = 'https://webhook.site/8cd0b7d7-9bc8-444b-aaa2-c1f60e1e5c70';

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false, message: 'Ошибка отправки' }, { status: 500 });
  }
}
