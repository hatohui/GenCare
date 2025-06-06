import { getDecodedToken } from './getDecodedToken'
import { DecodedTokenData } from '@/Interfaces/Auth/Schema/token'
import { parseTokenClaims } from './parseTokenClaims'

export const decodeToken = (token: string): DecodedTokenData | null => {
	try {
		const decodedToken = getDecodedToken(token)
		if (!decodedToken) throw new Error('')
		return parseTokenClaims(decodedToken)
	} catch (error) {
		console.error(error)
		return null
	}
}
