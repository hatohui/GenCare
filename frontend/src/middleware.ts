import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ACCESS_TOKEN_COOKIE_STRING } from './Constants/Auth'
import { jwtDecode } from 'jwt-decode'

export async function middleware(request: NextRequest) {
	try {
		const token = request.cookies.get(ACCESS_TOKEN_COOKIE_STRING)?.value

		if (!token) throw new Error('No session found.')

		const decoded = jwtDecode(token)

		// Check expiration
		if (decoded.exp && typeof decoded.exp === 'number') {
			const currentTime = Math.floor(Date.now() / 1000)
			if (decoded.exp < currentTime) {
				throw new Error('Token expired')
			}
		}

		return NextResponse.next()
	} catch (error) {
		console.error('Auth error:', error)

		// Redirect to login with error reason
		const loginUrl = new URL('/login', request.url)

		if (error instanceof Error) {
			loginUrl.searchParams.set(
				'error',
				error.message.includes('expired')
					? 'session_expired'
					: 'invalid_session'
			)
		}

		// Clear token cookie (server-side)
		const response = NextResponse.redirect(loginUrl)
		response.cookies.delete(ACCESS_TOKEN_COOKIE_STRING)

		return response
	}
}

export const config = {
	matcher: ['/dashboard/:path*'],
}
