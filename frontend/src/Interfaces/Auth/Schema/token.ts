import { Account } from '../Types/Account'

export type TokenData = {
	accessToken: string
	refreshToken: string
	accessTokenExpiration: string
}

export type DecodedTokenData = Account
