import useToken from '@/Hooks/useToken'

export const useAccessTokenHeader = (): string => {
	const { accessToken } = useToken()

	try {
		if (!accessToken) {
			throw new Error('Invalid or missing access Token')
		}

		return `Bearer ${accessToken}`
	} catch (error) {
		console.error('Invalid token')

		return ''
	}
}
