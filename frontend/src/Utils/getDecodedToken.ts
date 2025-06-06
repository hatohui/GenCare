import { RawClaims } from '@/Interfaces/Auth/Schema/token'
import { jwtDecode } from 'jwt-decode'

export const getDecodedToken = (token: string): RawClaims | null => {
	try {
		return jwtDecode(token)
	} catch (error) {
		console.error('JWT decode failed:', error)
		return null
	}
}
