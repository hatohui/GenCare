import { OauthResponse } from '@/Interfaces/Auth/Schema/oauth'
import clsx from 'clsx'
import { useEffect, useRef } from 'react'

export default function GoogleLoginButton({
	text = 'signup_with',
	className = '',
	handleLogin,
}: {
	className?: string
	text: 'signup_with' | 'signin_with'
	handleLogin: (response: OauthResponse) => void
}) {
	const handleLoginRef = useRef(handleLogin)

	// Update the ref when handleLogin changes
	useEffect(() => {
		handleLoginRef.current = handleLogin
	}, [handleLogin])

	useEffect(() => {
		if (typeof window === 'undefined') return

		// @ts-expect-error google exist
		window.google?.accounts.id.initialize({
			client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
			callback: (response: OauthResponse) => handleLoginRef.current(response),
		})

		// @ts-expect-error google exist liao
		window.google?.accounts.id.renderButton(
			document.getElementById('google-signin-button'),
			{ theme: 'outline', size: 'large', text }
		)
	}, [text]) // Removed handleLogin from dependencies

	return (
		<div className={clsx('w-full', className)}>
			<div
				id='google-signin-button'
				data-client-id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
			/>
		</div>
	)
}
