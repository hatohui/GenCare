import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccountStore } from '@/Hooks/useAccount'

import {
	isAllowedRole,
	PermissionLevel,
} from '@/Utils/Permissions/isAllowedRole'
import { isTokenValid } from '@/Utils/Auth/isTokenValid'
import { useGetMe } from '@/Services/account-service'
import useToken from './useToken'

export function useAuthGuard(
	requiredRole: PermissionLevel = PermissionLevel.staff
) {
	const tokenStore = useToken()
	const accountStore = useAccountStore()
	const { accessToken: token, isHydrated } = tokenStore
	const router = useRouter()
	const { data: user, isLoading: isUserLoading } = useGetMe()

	useEffect(() => {
		if (!isHydrated) return

		const validation = isTokenValid(token)

		if (!validation.valid) {
			accountStore.removeAccount()
			tokenStore.removeAccessToken()

			let errorParam = 'authentication_error'
			if (validation.error === 'no_token') errorParam = 'no_session'
			if (validation.error === 'invalid_token') errorParam = 'invalid_token'
			if (validation.error === 'token_expired') errorParam = 'session_expired'

			router.push(`/login?error=${errorParam}`)
		}
	}, [token, isHydrated, accountStore, tokenStore, router])

	useEffect(() => {
		if (token && user) {
			accountStore.setAccount(user)

			if (!isAllowedRole(user.role.name, requiredRole)) {
				router.push('/403')
			}
		}
	}, [user, token, isHydrated, accountStore, router])

	return {
		user,
		isUserLoading,
	}
}
