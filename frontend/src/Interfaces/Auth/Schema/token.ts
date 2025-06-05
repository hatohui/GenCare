import { Account } from '../Types/Account'

export type TokenData = {
	accessToken: string
}
export type DecodedTokenData = {
	audience: string //who the token is made for
	issuer: string //who created the token
	jti: string
	expireInSeconds: number
	account: TokenizedAccount
}

export type RawClaims = {
	sub: string
	email: string
	'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string
	'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname': string
	'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname': string
	'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dateofbirth': string
	'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/gender': string
	'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/uri': string
	'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone': string
	jti: string
	type: string
	exp: number
	iss: string
	aud: string
}

export type TokenizedAccount = Pick<Account, 'id' | 'role'>
