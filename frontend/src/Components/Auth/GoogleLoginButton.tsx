import {
	REDIRECT_MEMBER_AFTER_LOGIN_PATH,
	REDIRECT_STAFF_AFTER_LOGIN_PATH,
} from '@/Constants/Auth'
import useToken from '@/Hooks/useToken'
import { OauthResponse } from '@/Interfaces/Auth/Schema/oauth'
import { useOauthAccount } from '@/Services/auth-service'
import { getRoleFromToken } from '@/Utils/Auth/getRoleFromToken'
import { PermissionLevel } from '@/Utils/Permissions/isAllowedRole'
import clsx from 'clsx'
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
	const tokenStore = useToken()

	const handleCredentialResponse = (response: OauthResponse) => {
		handleOauth.mutate(
			{ credential: response.credential },
			{
				onSuccess: data => {
					tokenStore.setAccessToken(data.accessToken)
					const role = getRoleFromToken(data.accessToken)

					if (PermissionLevel[role] >= PermissionLevel.consultant)
						router.push(REDIRECT_MEMBER_AFTER_LOGIN_PATH)
					else router.push(REDIRECT_STAFF_AFTER_LOGIN_PATH)
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
	}, [handleCredentialResponse, text])

	return (
		<div className={clsx('w-full', className)}>
			<div
				id='google-signin-button'
				data-client-id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
			/>
		</div>
	)
}
