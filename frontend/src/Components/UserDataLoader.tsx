'use client'

import { useEffect } from 'react'
import useToken from '@/Hooks/Auth/useToken'
import { useAccountStore } from '@/Hooks/useAccount'
import { useGetMe } from '@/Services/account-service'
import { isTokenValid } from '@/Utils/Auth/isTokenValid'

const UserDataLoader = () => {
	const tokenStore = useToken()
	const accountStore = useAccountStore()
	const { data: user } = useGetMe()

	useEffect(() => {
		// Only load user data if we have a valid token
		if (tokenStore.accessToken && isTokenValid(tokenStore.accessToken).valid) {
			if (user && accountStore.data?.id !== user.id) {
				accountStore.setAccount(user)
			}
		} else if (!tokenStore.accessToken) {
			// Clear account data if no token
			accountStore.removeAccount()
		}
	}, [user, tokenStore.accessToken])

	// This component doesn't render anything
	return null
}

export default UserDataLoader
