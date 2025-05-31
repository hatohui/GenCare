import { Account } from '../Types/Account'

export type TokenData = {
	accessToken: string
	refreshToken: string
	accessTokenExpiration: string
}
export type DecodedTokenData = {
	audience: string //who the token is made for
	issuer: string //who created the token
	jti: string
	expireInSeconds: number
	account: Account
}

export type RawClaims = {
	IsDeleted: string
	aud: string
	email: string
	exp: number
	iss: string
	jti: string
	sub: string
	type: string
	'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string
	'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dateofbirth': string
	'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/gender': string
	'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname': string
	'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone': string
	'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname': string
	'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/uri': string
}
