import useAccountStore from '@/Hooks/useToken'

export const getAccessTokenHeader = (): string => {
	const store = useAccountStore()
	const token = store.accessToken

	console.log('token: ', token)

	if (!token || typeof token !== 'string') {
		throw new Error('Access Token is missing or invalid')
	}
	return `Bearer ${token}`
}
