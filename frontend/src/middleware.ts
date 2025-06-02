import { ACCESS_TOKEN_COOKIE_STRING } from '@/Constants/Auth'
import { getCookie } from 'cookies-next/client'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
	const token = getCookie(ACCESS_TOKEN_COOKIE_STRING)

	if (!token) {
		return NextResponse.redirect(new URL('/login', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/dashboard/:path*'],
}
