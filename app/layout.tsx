import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Актуальные предложения',
  description: 'Страница актуальных предложений и мероприятий',
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1.0,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="bg-gray-700 text-white font-sans overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}