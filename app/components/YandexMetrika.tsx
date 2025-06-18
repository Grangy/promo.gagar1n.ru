// components/YandexMetrika.tsx
'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'

// Расширяем глобальный Window
declare global {
  interface Window {
    ym?: (counterId: number, event: string, payload?: unknown) => void
  }
}

const COUNTER_ID = 102744886

export default function YandexMetrika() {
  const pathname = usePathname()

  // SPA‑трекинг: при каждом изменении пути шлём hit
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.ym === 'function') {
      window.ym(COUNTER_ID, 'hit', pathname)
    }
  }, [pathname])

  return (
    <>
      {/* Инициализация счётчика */}
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++){
                if (document.scripts[j].src === r) return;
              }
              k=e.createElement(t),a=e.getElementsByTagName(t)[0];
              k.async=1; k.src=r;
              a.parentNode.insertBefore(k,a)
            })
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(${COUNTER_ID}, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true
            });
          `,
        }}
      />

      {/* noscript‑fallback */}
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${COUNTER_ID}`}
            style={{ position: 'absolute', left: '-9999px' }}
            width={1}
            height={1}
            alt=""
          />
        </div>
      </noscript>
    </>
  )
}