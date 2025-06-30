import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'

import useToken from '@/Hooks/Auth/useToken'
import { useLoginAccount, useOauthAccount } from '@/Services/auth-service'
import { getRoleFromToken } from '@/Utils/Auth/getRoleFromToken'
import { isTokenValid } from '@/Utils/Auth/isTokenValid'
import { PermissionLevel } from '@/Utils/Permissions/isAllowedRole'
import {
	REDIRECT_MEMBER_AFTER_LOGIN_PATH,
	REDIRECT_STAFF_AFTER_LOGIN_PATH,
} from '@/Constants/Auth'

import { LoginApi } from '@/Interfaces/Auth/Schema/login'
import { OauthResponse } from '@/Interfaces/Auth/Schema/oauth'
import { ApiErrorResponse } from '@/Interfaces/Auth/ApiErrorResponse'
import { TokenData } from '@/Interfaces/Auth/Schema/token'

export const useLogin = () => {
	const [isLoggingIn, setIsLoggingIn] = useState(false)
	const [formError, setFormError] = useState<string>('')
	const tokenStore = useToken()

	const router = useRouter()
	const loginMutation = useLoginAccount()
	const oauthMutation = useOauthAccount()

	const token = tokenStore.accessToken

	const postLoginRedirect = useCallback(
		(token: string) => {
			const role = getRoleFromToken(token)
			if (PermissionLevel[role] >= PermissionLevel.consultant)
				router.push(REDIRECT_MEMBER_AFTER_LOGIN_PATH)
			else router.push(REDIRECT_STAFF_AFTER_LOGIN_PATH)
		},
		[router]
	)

	const loginSuccess = useCallback(
		(data: TokenData) => {
			tokenStore.setAccessToken(data.accessToken)
			setFormError('')
			postLoginRedirect(data.accessToken)
		},
		[tokenStore, postLoginRedirect]
	)

	const handleLogin = useCallback(
		(formData: LoginApi | OauthResponse) => {
			setIsLoggingIn(true)

			if ('email' in formData && 'password' in formData) {
				loginMutation.mutate(formData, {
					onSuccess: loginSuccess,
					onError: error => {
						const err = error as AxiosError<ApiErrorResponse>
						if (err.response?.status) {
							setFormError('login or password is incorrect')
						}
						setIsLoggingIn(false)
					},
				})
			} else {
				oauthMutation.mutate(
					{ credential: formData.credential },
					{
						onSuccess: loginSuccess,
						onError: error => {
							console.error(error)
							setIsLoggingIn(false)
						},
					}
				)
			}
		},
		[loginMutation, oauthMutation, loginSuccess]
	)

	useEffect(() => {
		if (token && isTokenValid(token).valid) {
			postLoginRedirect(token)
		}
	}, [token, postLoginRedirect])

	return {
		isLoggingIn,
		formError,
		handleLogin,
		isPending: loginMutation.isPending,
		isSuccess: loginMutation.isSuccess,
	}
}
