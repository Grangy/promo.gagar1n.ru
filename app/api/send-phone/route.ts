// my-app/app/api/send-phone/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  // Убираем все не‑цифры и проверяем длину 8–13 цифр
  const normalized = phone?.toString().replace(/\D+/g, '');
  if (!normalized || !/^\d{8,13}$/.test(normalized)) {
    return NextResponse.json(
      { success: false, message: 'Некорректный номер' },
      { status: 400 }
    );
  }

  const payload = {
    callerphone: normalized,
    fio:        'Промо',
    subject:    'promo_g1',
    source:     'promo_g1',
    medium:     'promo_g1',
    leadtype:   'request',
  };

  const webhookUrl = 'http://147.45.187.4:3000/webhook';

  try {
    const res = await fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Webhook error:', res.status, text);
      return NextResponse.json(
        { success: false, message: 'Ошибка вебхука', details: text },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Fetch failed:', err);
    return NextResponse.json(
      { success: false, message: 'Ошибка отправки' },
      { status: 500 }
    );
  }
}
