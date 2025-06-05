import { TokenData } from '@/Interfaces/Auth/Schema/token'
import { getDecodedToken } from './getDecodedToken'
import { accountActions } from '@/Hooks/useToken'
import { parseTokenClaims } from './parseTokenClaims'
import useAccountStore from '@/Hooks/useToken'

export const setAccessToken = (data: TokenData) => {
	// SET COOKIE
	useAccountStore.getState().setAccessToken(data.accessToken)

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
