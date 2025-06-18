'use client';
import React, { useState } from 'react';

interface SKKFormProps {
  onSuccess: () => void;
}

const SKKForm: React.FC<SKKFormProps> = ({ onSuccess }) => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'error' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !message.trim()) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/send-skk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, text: message }),
      });

      if (!res.ok) throw new Error('Network error');

      setStatus('success');
      setTimeout(onSuccess, 1500);
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h3 className="text-xl font-medium">Связаться со службой качества</h3>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold mb-1">
          Ваш номер телефона <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="+7 (___) ___-__-__"
          required
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-800"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold mb-1">
          Опишите вашу проблему <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Напишите, в чём заключается ваша проблема или отзыв"
          required
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-800"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-2 rounded-lg bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-[length:200%_200%] bg-left-top hover:bg-right-bottom transition-all duration-500 text-white font-semibold disabled:opacity-50"
      >
        {status === 'sending' ? 'Отправка...' : 'Отправить'}
      </button>

      {status === 'error' && <p className="text-sm text-red-600">Ошибка отправки. Попробуйте ещё раз.</p>}
      {status === 'success' && <p className="text-sm text-green-600">Сообщение отправлено!</p>}
    </form>
  );
};

export default SKKForm;