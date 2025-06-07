import { DecodedTokenData } from '@/Interfaces/Auth/Schema/token'
import { decodeToken } from './decodeToken'

export type TokenValidationResult =
	| {
			valid: false
			error: TokenError
	  }
	| {
			valid: true
			decodedToken: DecodedTokenData
	  }

export type TokenError =
	| 'no_token'
	| 'invalid_token'
	| 'token_expired'
	| 'unauthorized'

export const isTokenValid = (token: string | null): TokenValidationResult => {
	if (!token) return { valid: false, error: 'no_token' }

	const decodedToken = decodeToken(token)

	if (!decodedToken) return { valid: false, error: 'invalid_token' }

	const currentTime = Math.floor(Date.now() / 1000)

	if (
		decodedToken.expireInSeconds &&
		currentTime >= decodedToken.expireInSeconds - 5
	)
		return { valid: false, error: 'token_expired' }

	return { valid: true, decodedToken }
}
