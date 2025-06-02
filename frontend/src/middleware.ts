import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getDecodedToken } from './Utils/getDecodedToken'
import { accountActions } from './Hooks/useToken'

export function middleware(request: NextRequest) {
	try {
		const rawClaim = getDecodedToken()
		if (!rawClaim) throw new Error('No session found.')
		// Check if token is expired
		if (rawClaim.exp && typeof rawClaim.exp === 'number') {
			//get currenttime in seconds
			const currentTimestamp = Math.floor(Date.now() / 1000)
			//compare
			if (rawClaim.exp < currentTimestamp) {
				throw new Error('Token has expired')
			}
		}
	} catch (error) {
		//handle token expiration
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error'

		console.error('Authentication error:', errorMessage)

		if (
			errorMessage.includes('Token has expired') ||
			errorMessage.includes('No session found')
		) {
			accountActions.removeAccount()
			return NextResponse.redirect(new URL('/login', request.url))
		}

		return NextResponse.redirect(new URL('/error', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/dashboard/:path*'], //add more here later
}
