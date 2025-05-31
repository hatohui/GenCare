import { ACCESS_TOKEN_COOKIE_STRING } from '@/Constants/Auth'
import { DecodedTokenData } from '@/Interfaces/Auth/Schema/token'
import { getCookie } from 'cookies-next/client'
import { jwtDecode } from 'jwt-decode'

export const getDecodedToken = (): DecodedTokenData | null => {
	const token = getCookie(ACCESS_TOKEN_COOKIE_STRING)
	if (!token) return null

	try {
		return jwtDecode(token)
	} catch (err) {
		console.error('Failed to decode token:', err)
		return null
	}
}
