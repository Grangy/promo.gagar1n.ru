import { NextResponse } from 'next/server';

// Токен и чат можно вынести в .env.local, но для простоты оставим здесь
const TELEGRAM_BOT_TOKEN = '7286138169:AAEbfdElJiRFpPJ8Dw9f43BJuORgyd6mdDc';
const TELEGRAM_CHAT_ID = '683203214';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export async function POST(request: Request) {
  try {
    const { phone, text } = await request.json();
    if (!phone || !text) {
      return NextResponse.json(
        { error: 'Поля phone и text обязательны' },
        { status: 400 }
      );
    }

    // Формируем простое текстовое сообщение
    const messageText =
      `📩 Новая заявка СКК` +
      `\n\nНомер телефона: ${phone}` +
      `\nСообщение: ${text}`;

    const resp = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: messageText,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('Telegram API error:', errText);
      return NextResponse.json(
        { error: 'Не удалось отправить сообщение' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Internal error in send-skk:', e);
    return NextResponse.json(
      { error: 'Внутренняя ошибка' },
      { status: 500 }
    );
  }
}