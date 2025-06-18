// app/api/send-skk/route.ts
import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = '7286138169:AAEbfdElJiRFpPJ8Dw9f43BJuORgyd6mdDc';
const TELEGRAM_CHAT_ID = '683203214';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    const payload = {
      chat_id: TELEGRAM_CHAT_ID,
      text: `Сообщение из сайта СКК:\n\n${text}`,
    };

    const resp = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('Telegram API error:', errText);
      return NextResponse.json({ error: 'Не удалось отправить сообщение' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Internal error in send-skk:', e);
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 });
  }
}
