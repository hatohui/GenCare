'use client'
import React, { useEffect, useState } from 'react'
import Sidenav from '@/Components/Dashboard/Sidenav'
import useToken from '@/Hooks/useToken'
import { forbidden, useRouter } from 'next/navigation'
import { MANAGEMENT_TEAM } from '@/Constants/Management'
import { useAccountStore } from '@/Hooks/useAccount'
import { isTokenValid } from '@/Utils/isTokenValid'

export default function Layout({ children }: { children: React.ReactNode }) {
	const [isClient, setIsClient] = useState(false)
	const tokenStore = useToken()
	const accountStore = useAccountStore()
	const router = useRouter()
	const { accessToken: token } = tokenStore
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const verificationTimeout = setTimeout(() => {
			if (isLoading) router.push('/login?error=verification_timeout')
		}, 5000)

		return clearTimeout(verificationTimeout)
	}, [])

	useEffect(() => {
		setIsClient(true)
	}, [])

	useEffect(() => {
		if (!isClient) return

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

		const { decodedToken } = validation

		accountStore.setAccount(decodedToken)

		if (!MANAGEMENT_TEAM.includes(decodedToken.account.role)) {
			forbidden()
		}

		setIsLoading(false)
	}, [token, isClient, router])

	if (!isClient || isLoading) {
		return (
			<div className='h-screen w-screen animate-pulse center-all'>
				Verifying you....
			</div>
		)
	}

	return (
		<div className='flex flex-col md:flex-row md:overflow-hidden h-screen florageBackground'>
			<div className='w-full flex-none md:w-64'>
				<Sidenav />
			</div>
			<main className='flex-1 p-7 h-full scroll-smooth'>{children}</main>
		</div>
	)
}
