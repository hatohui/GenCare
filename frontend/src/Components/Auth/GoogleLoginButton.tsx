import { OauthResponse } from '@/Interfaces/Auth/Schema/oauth'
import { useOauthAccount } from '@/Services/auth-service'
import { setAccessToken } from '@/Utils/setAccessToken'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function GoogleLoginButton({
	text = 'signup_with',
	className = '',
}: {
	className?: string
	text: 'signup_with' | 'signin_with'
}) {
	const router = useRouter()
	const handleOauth = useOauthAccount()
	const handleCredentialResponse = (response: OauthResponse) => {
		handleOauth.mutate(
			{ credential: response.credential },
			{
				onSuccess: data => {
					console.log('OAuth successful:', data)

					setAccessToken(data)
					router.push('/dashboard')
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

		// @ts-expect-error google exist
		window.google?.accounts.id.initialize({
			client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
			callback: handleCredentialResponse,
		})

		// @ts-expect-error google exist liao
		window.google?.accounts.id.renderButton(
			document.getElementById('google-signin-button'),
			{ theme: 'outline', size: 'large', text }
		)
	}, [])

	return (
		<div
			id='google-signin-button'
			className={className}
			data-client-id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
		/>
	)
}
