import useToken from '@/Hooks/useToken'

export const useAccessTokenHeader = (): string => {
	const { accessToken } = useToken()

	if (!accessToken) {
		return ''
	}

	return `Bearer ${accessToken}`
}
