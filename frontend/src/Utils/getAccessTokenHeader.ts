import { ACCESS_TOKEN_COOKIE_STRING } from '@/Constants/Auth'
import { getCookie } from 'cookies-next/client'

export const getAccessTokenHeader = (): string => {
	const token = getCookie(ACCESS_TOKEN_COOKIE_STRING)
	if (!token || typeof token !== 'string') {
		throw new Error('Access Token is missing or invalid')
	}
	return `Bearer ${token}`
}
