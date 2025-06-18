import { NextResponse } from 'next/server';

// Токен и чат можно вынести в .env.local
const TELEGRAM_BOT_TOKEN = '7286138169:AAEbfdElJiRFpPJ8Dw9f43BJuORgyd6mdDc';
const TELEGRAM_CHAT_ID = '683203214';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export async function POST(request: Request) {
  try {
    const { phone, text } = await request.json();
    if (!phone || !text) {
      return NextResponse.json({ error: 'Поля phone и text обязательны' }, { status: 400 });
    }

    const messageText =
      `📩 *Новая заявка СКК* 📩\n\n` +
      `*Номер телефона:* ${phone}\n` +
      `*Сообщение:* ${text}`;

    const resp = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: messageText,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[{ text: 'Принять обращение', callback_data: 'accept_skk' }]]
        }
      }),
    });

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