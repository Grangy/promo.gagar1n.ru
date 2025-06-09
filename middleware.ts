import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const allowedIPs = ['77.105.164.42', '91.210.178.134']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/events') || pathname.startsWith('/offers')) {
    // Получаем IP из заголовка x-forwarded-for (список через запятую, берём первый)
    const xForwardedFor = request.headers.get('x-forwarded-for')
    const ip = xForwardedFor ? xForwardedFor.split(',')[0].trim() : null

    if (!ip || !allowedIPs.includes(ip)) {
      return new NextResponse('Доступ запрещён', { status: 403 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/events/:path*', '/offers/:path*'],
}
