import useToken from '@/Hooks/useToken'

export const useAccessTokenHeader = (): string => {
	const { accessToken } = useToken()
	return `Bearer ${accessToken}`
}
