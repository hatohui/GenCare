import useToken from '@/Hooks/useToken'

export const useAccessTokenHeader = (): string => {
	const store = useToken()
	const token = store.accessToken

	console.log('token: ', token)

	if (!token || typeof token !== 'string') {
		throw new Error('Access Token is missing or invalid')
	}
	return `Bearer ${token}`
}
