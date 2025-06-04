import {
	ACCESS_TOKEN_COOKIE_STRING,
	REFRESH_TOKEN_COOKIE_STRING,
} from '@/Constants/Auth'
import { accountActions } from '@/Hooks/useToken'
import { deleteCookie } from 'cookies-next/client'

export const removeTokens = () => {
	deleteCookie(ACCESS_TOKEN_COOKIE_STRING)
	deleteCookie(REFRESH_TOKEN_COOKIE_STRING)
	accountActions.removeAccount()
}
