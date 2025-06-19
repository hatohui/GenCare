import { OauthResponse } from '@/Interfaces/Auth/Schema/oauth'
import clsx from 'clsx'
import { useEffect } from 'react'

export default function GoogleLoginButton({
	text = 'signup_with',
	className = '',
	handleLogin,
}: {
	className?: string
	text: 'signup_with' | 'signin_with'
	handleLogin: (response: OauthResponse) => void
}) {
	useEffect(() => {
		if (typeof window === 'undefined') return

		// @ts-expect-error google exist
		window.google?.accounts.id.initialize({
			client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
			callback: handleLogin,
		})

		// @ts-expect-error google exist liao
		window.google?.accounts.id.renderButton(
			document.getElementById('google-signin-button'),
			{ theme: 'outline', size: 'large', text }
		)
	}, [handleLogin, text])

	return (
		<div className={clsx('w-full', className)}>
			<div
				id='google-signin-button'
				data-client-id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
			/>
		</div>
	)
}
