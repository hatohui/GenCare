import {
	ACCESS_TOKEN_COOKIE_STRING,
	REFRESH_TOKEN_COOKIE_STRING,
} from '@/Constants/Auth'
import { TokenData } from '@/Interfaces/Auth/Schema/token'
import { setCookie } from 'cookies-next/client'
import { getDecodedToken } from './getDecodedToken'
import { accountActions } from '@/Hooks/useToken'
import { parseTokenClaims } from './parseTokenClaims'

export const setAccessToken = (data: TokenData) => {
	// SET COOKIE
	setCookie(ACCESS_TOKEN_COOKIE_STRING, data.accessToken, {
		sameSite: 'strict',
		expires: new Date(data.accessTokenExpiration),
	})
	setCookie(REFRESH_TOKEN_COOKIE_STRING, data.refreshToken)

	// DECODE COOKIE
	const tokenClaim = getDecodedToken(data.accessToken)

	if (!tokenClaim) {
		console.warn('Token decoding failed. User not authenticated.')
		accountActions.removeAccount()
		return
	}

	const decodedTokenData = parseTokenClaims(tokenClaim)

	// SET ACCOUNT
	accountActions.setAccount(decodedTokenData.account)
}
