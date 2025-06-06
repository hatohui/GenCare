import useToken from '@/Hooks/useToken'

export const useAccessTokenHeader = (): string => {
	const { accessToken } = useToken()

	if (!accessToken) {
		throw new Error('Invalid or missing access Token')
	}

	return `Bearer ${accessToken}`
}
