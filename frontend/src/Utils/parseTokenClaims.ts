import { DecodedTokenData, RawClaims } from '@/Interfaces/Auth/Schema/token'
import { Account } from '@/Interfaces/Auth/Types/Account'

export function parseTokenClaims(raw: RawClaims): DecodedTokenData {
	if (!raw || typeof raw !== 'object') {
		throw new Error('Invalid token claims: raw claims object is required')
	}

	if (!raw.sub || !raw.email) {
		throw new Error('Invalid token claims: subject and email are required')
	}

	const isDeleted = raw.IsDeleted.toLowerCase() === 'true'
	const genderString =
		raw['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/gender']

	const account: Account = {
		id: raw.sub,
		role: raw['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
		email: raw.email,
		firstName:
			raw['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
		lastName:
			raw['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
		gender: genderString === 'Male',
		phoneNumber:
			raw['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'],
		dateOfBirth:
			raw['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dateofbirth'],
		avatarUrl: raw['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/uri'],
		deletedAt: isDeleted ? new Date().toISOString() : '',
		isDeleted,
	}

	return {
		audience: raw.aud,
		issuer: raw.iss,
		jti: raw.jti,
		expireInSeconds: raw.exp,
		account,
	}
}
