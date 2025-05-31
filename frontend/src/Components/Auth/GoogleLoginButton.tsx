import { useOauthAccount } from '@/Services/auth-service'
import { useEffect } from 'react'

export default function GoogleLoginButton() {
	const handleOauth = useOauthAccount()
	const handleCredentialResponse = (response: string) => {
		handleOauth.mutate(
			{ credential: response },
			{
				onSuccess: data => {
					console.log('OAuth successful:', data)
					// Handle successful OAuth login, e.g., redirect or show success message
				},
				onError: error => {
					console.error('OAuth error:', error)
					// Handle OAuth error, e.g., show error message
				},
			}
		)
	}

	useEffect(() => {
		if (typeof window === 'undefined') return

		// @ts-ignore
		window.google?.accounts.id.initialize({
			client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
			callback: handleCredentialResponse,
		})

		// @ts-ignore
		window.google?.accounts.id.renderButton(
			document.getElementById('google-signin-button'),
			{ theme: 'outline', size: 'large' }
		)
	}, [])

	return <div id='google-signin-button' />
}
