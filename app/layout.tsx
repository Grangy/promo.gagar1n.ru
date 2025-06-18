import './globals.css'
import type { Metadata } from 'next'
import YandexMetrika from './components/YandexMetrika'

export const metadata: Metadata = {
  title: 'Актуальные предложения',
  description: 'Страница актуальных предложений и мероприятий',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="bg-gray-700 text-white font-sans overflow-x-hidden">
        <YandexMetrika />
        {children}
      </body>
    </html>
  )
}
