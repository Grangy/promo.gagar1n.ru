// app/components/Popup.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;        // <-- добавили
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && e.target === popupRef.current) onClose();
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className={`fixed inset-0 z-50 bg-black/60 transition-opacity ${
        isOpen ? 'flex' : 'hidden'
      } items-center justify-center`}
    >
      <div className="bg-white text-black dark:bg-[#1a1a1a] dark:text-white rounded-2xl w-full max-w-sm p-6 relative shadow-xl animate-fadeIn border dark:border-red-800">
        <button
          className="absolute top-4 right-4 text-gray-700 hover:text-black dark:text-gray-400 dark:hover:text-white"
          onClick={onClose}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {children ? (
          // Если передали дочерний контент — рендерим его
          children
        ) : (
          // Иначе отображаем старую форму ввода телефона
          <DefaultPhoneForm onClose={onClose} />
        )}
      </div>
    </div>
  );
};

export default Popup;


// Вынесем старую логику формы в отдельный компонент:
interface DefaultPhoneFormProps {
  onClose: () => void;
}

const DefaultPhoneForm: React.FC<DefaultPhoneFormProps> = ({ onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rawPhone, setRawPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formattedPhone) inputRef.current?.focus();
  }, [formattedPhone]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onClose();
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);

  const formatPhone = (value: string) => {
    let digits = value.replace(/\D/g, '');
    if (digits.startsWith('8')) digits = '7' + digits.slice(1);
    else if (!digits.startsWith('7')) digits = '7' + digits;
    setRawPhone(digits);

    let formatted = '+7';
    if (digits.length > 1) formatted += ` (${digits.slice(1, 4)})`;
    if (digits.length >= 4) formatted += ` ${digits.slice(4, 7)}`;
    if (digits.length >= 7) formatted += `-${digits.slice(7, 9)}`;
    if (digits.length >= 9) formatted += `-${digits.slice(9, 11)}`;
    setFormattedPhone(formatted);
  };

  const validatePhone = (digits: string) => digits.length >= 8 && digits.length <= 13;

  const handleSubmit = async () => {
    if (!validatePhone(rawPhone)) {
      setError('Введите корректный номер (от 8 до 13 цифр)');
      setSuccess('');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/send-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: rawPhone }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Номер успешно отправлен!');
        setRawPhone('');
        setFormattedPhone('');
      } else {
        setError(data.message || 'Ошибка отправки');
      }
    } catch {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Оставьте номер телефона</h3>
      <input
        ref={inputRef}
        type="tel"
        value={formattedPhone}
        onChange={e => formatPhone(e.target.value)}
        placeholder="+7 (___) ___-__-__"
        className={`w-full border rounded-md px-3 py-2 mb-2 outline-none transition focus:ring-2 bg-white dark:bg-black dark:text-white ${
          error ? 'border-red-500 focus:ring-red-400' : 'focus:ring-red-400 dark:focus:ring-red-600'
        }`}
      />
      {error && <p className="text-sm text-red-600 dark:text-red-400 mb-2">{error}</p>}
      {success && <p className="text-sm text-green-600 dark:text-green-400 mb-2">{success}</p>}
      <button
        disabled={loading}
        onClick={handleSubmit}
        className={`w-full bg-red-600 text-white px-4 py-2 rounded-md transition hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 ${
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Отправка...' : 'Отправить'}
      </button>
    </>
  );
};
