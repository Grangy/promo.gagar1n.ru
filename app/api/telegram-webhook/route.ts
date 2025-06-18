import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = '7286138169:AAEbfdElJiRFpPJ8Dw9f43BJuORgyd6mdDc';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export async function POST(request: Request) {
  const update = await request.json();

  if (update.callback_query) {
    const { id: callback_query_id, message, data } = update.callback_query;

    if (data === 'accept_skk') {
      // изменяем кнопку на "Обращение принято ✅"
      await fetch(`${TELEGRAM_API}/editMessageReplyMarkup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: message.chat.id,
          message_id: message.message_id,
          reply_markup: {
            inline_keyboard: [[{ text: 'Обращение принято ✅', callback_data: 'accepted' }]]
          }
        }),
      });

      // отвечаем Telegram, чтобы убрать индикатор ожидания
      await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id }),
      });
    }
    return NextResponse.json({});
  }

  return NextResponse.json({});
}