'use client'

import React, { useEffect, useState } from 'react'
import { useLocale } from '@/Hooks/useLocale'
import { useGetMe } from '@/Services/account-service'
import { useAccountStore } from '@/Hooks/useAccount'
import useToken from '@/Hooks/Auth/useToken'
import { useRouter } from 'next/navigation'
import { isTokenValid } from '@/Utils/Auth/isTokenValid'

export default function MemberLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const [isClient, setIsClient] = useState(false)
	const tokenStore = useToken()
	const accountStore = useAccountStore()
	const router = useRouter()
	const { accessToken: token } = tokenStore
	const [isLoading, setIsLoading] = useState(true)
	const { data } = useGetMe()
	const { t } = useLocale()

	useEffect(() => {
		const verificationTimeout = setTimeout(() => {
			if (isLoading) router.push('/login?error=verification_timeout')
		}, 5000)

		return clearTimeout(verificationTimeout)
	}, [isLoading, router])

	useEffect(() => {
		setIsClient(true)
	}, [])

	useEffect(() => {
		if (!isClient) return

		if (!token && !accountStore.data) {
			setIsLoading(false)
			return
		}

		const validation = isTokenValid(token)

		if (!validation.valid) {
			accountStore.removeAccount()
			tokenStore.removeAccessToken()

			switch (validation.error) {
				case 'no_token':
					router.push('/login?error=no_session')
					break
				case 'invalid_token':
					router.push('/login?error=invalid_token')
					break
				case 'token_expired':
					router.push('/login?error=session_expired')
					break
				default:
					router.push('/login?error=authentication_error')
			}

			return
		}

		if (data && data.id !== accountStore.data?.id) {
			accountStore.setAccount(data)
		}

		setIsLoading(false)
	}, [token, isClient, router, data, accountStore, tokenStore])

	if (!isClient || isLoading) {
		return (
			<div className='h-screen w-screen animate-pulse center-all'>
				{t('auth.verifyingUser')}
			</div>
		)
	}

	return <>{children}</>
}
