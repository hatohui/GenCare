import { jwtDecode } from 'jwt-decode'
import { readCookie } from './readCookie'

export const getDecodedToken = (cookieName = 'accessToken') => {
	const token = readCookie(cookieName)
	if (!token) return null

	try {
		return jwtDecode(token)
	} catch (err) {
		console.error('Failed to decode token:', err)
		return null
	}
}
