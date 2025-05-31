import {
	ACCESS_TOKEN_COOKIE_STRING,
	REFRESH_TOKEN_COOKIE_STRING,
} from '@/Constants/Auth'
import { DecodedTokenData, TokenData } from '@/Interfaces/Auth/Schema/token'
import { setCookie } from 'cookies-next/client'
import { getDecodedToken } from './getDecodedToken'
import { accountActions } from '@/Hooks/useToken'

export const setAccessToken = (data: TokenData) => {
	// SET COOKIE
	setCookie(ACCESS_TOKEN_COOKIE_STRING, data.accessToken, {
		sameSite: 'strict',
		expires: new Date(data.accessTokenExpiration),
	})
	setCookie(REFRESH_TOKEN_COOKIE_STRING, data.refreshToken)
	// DECODE COOKIE
	const decodedData: DecodedTokenData | null = getDecodedToken()
	console.log(decodedData)
	if (!decodedData) return

	// SET ACCOUNT
	accountActions.setAccount(decodedData)
}
