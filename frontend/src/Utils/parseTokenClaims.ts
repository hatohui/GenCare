import {
	DecodedTokenData,
	RawClaims,
	TokenizedAccount,
} from '@/Interfaces/Auth/Schema/token'

export function parseTokenClaims(raw: RawClaims): DecodedTokenData {
	if (!raw || typeof raw !== 'object') {
		throw new Error('Invalid token claims: raw claims object is required')
	}

	if (!raw.sub || !raw.email) {
		throw new Error('Invalid token claims: subject and email are required')
	}

	// const genderString =
	// 	raw['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/gender']

	const account: TokenizedAccount = {
		id: raw.sub,
		role: raw['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
	}

	return {
		audience: raw.aud,
		issuer: raw.iss,
		jti: raw.jti,
		expireInSeconds: raw.exp,
		account,
	}
}
