import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'

import { useRegisterAccount, useOauthAccount } from '@/Services/auth-service'
import useToken from '@/Hooks/Auth/useToken'

import {
	RegisterFormData,
	RegisterApi,
} from '@/Interfaces/Auth/Schema/register'
import { ApiErrorResponse } from '@/Interfaces/Auth/ApiErrorResponse'
import { OauthResponse } from '@/Interfaces/Auth/Schema/oauth'
import { TokenData } from '@/Interfaces/Auth/Schema/token'

import { getRoleFromToken } from '@/Utils/Auth/getRoleFromToken'
import { PermissionLevel } from '@/Utils/Permissions/isAllowedRole'
import {
	REDIRECT_MEMBER_AFTER_LOGIN_PATH,
	REDIRECT_STAFF_AFTER_LOGIN_PATH,
} from '@/Constants/Auth'

export const useRegister = () => {
	const [isProcessing, setIsProcessing] = useState(false)
	const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})

	const router = useRouter()
	const tokenStore = useToken()

	const registerMutation = useRegisterAccount()
	const oauthMutation = useOauthAccount()

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
			setFormErrors({})
			postLoginRedirect(data.accessToken)
		},
		[tokenStore, postLoginRedirect]
	)

	const handleLogin = useCallback(
		(formData: OauthResponse) => {
			setIsProcessing(true)
			oauthMutation.mutate(
				{ credential: formData.credential },
				{
					onSuccess: loginSuccess,
					onError: error => {
						console.error('OAuth error:', error)
						setIsProcessing(false)
					},
				}
			)
		},
		[oauthMutation, loginSuccess]
	)

	const handleRegister = useCallback(
		(formData: RegisterFormData) => {
			setIsProcessing(true)
			const payload: RegisterApi = {
				email: formData.email,
				firstName: formData.firstName,
				lastName: formData.lastName,
				gender: formData.gender,
				phoneNumber: formData.phoneNumber,
				dateOfBirth: formData.dateOfBirth,
				password: formData.password,
			}

			registerMutation.mutate(payload, {
				onSuccess: loginSuccess,
				onError: error => {
					setIsProcessing(false)
					const err = error as AxiosError<ApiErrorResponse>
					if (err.response?.data?.errors) {
						setFormErrors(err.response.data.errors)
						console.error('Validation errors:', err.response.data.errors)
					}
				},
			})
		},
		[registerMutation, loginSuccess]
	)

	return {
		isProcessing,
		formErrors,
		handleRegister,
		handleLogin,
		isPending: registerMutation.isPending,
		isSuccess: registerMutation.isSuccess,
	}
}
