'use client'

import React, { useEffect, useState } from 'react'
import { useAuthGuard } from '@/Hooks/Auth/useAuthGuard'
import { PermissionLevel } from '@/Utils/Permissions/isAllowedRole'
import LoadingIcon from '@/Components/LoadingIcon'
import BackgroundCircles from '@/Components/BackgroundCircles'
import SideNav from '@/Components/Dashboard/Sidenav'
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
	// Add authentication guard for member access
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

		// If already logged out, do nothing
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

	return (
		<div className='flex flex-col md:flex-row md:overflow-hidden h-screen florageBackground relative'>
			<main className='flex-1 p-7 h-full scroll-smooth overflow-scroll relative z-10'>
				{children}
			</main>
		</div>
	)
}
