import useToken from '@/Hooks/Auth/useToken'

export const useAccessTokenHeader = (): string => {
	const { accessToken } = useToken()

	if (!accessToken) {
		return ''
	}

	return `Bearer ${accessToken}`
}
