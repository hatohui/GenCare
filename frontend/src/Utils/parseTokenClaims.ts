import {
	DecodedTokenData,
	RawClaims,
	TokenizedAccount,
} from '@/Interfaces/Auth/Schema/token'

export function parseTokenClaims(raw: RawClaims): DecodedTokenData {
	if (!raw || typeof raw !== 'object') {
		throw new Error('Invalid token claims: raw claims object is required')
	}

	if (
		!raw.sub ||
		!raw['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
	) {
		throw new Error('Invalid token claims: subject and role are required')
	}

	const account: TokenizedAccount = {
		id: raw.sub,
		role: {
			id: raw['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
			name: raw['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
			description:
				raw['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
		},
	}

	return {
		audience: raw.aud,
		issuer: raw.iss,
		jti: raw.jti,
		expireInSeconds: raw.exp,
		account,
	}
}
