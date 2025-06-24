'use client'

import LoginForm from '@/Components/Auth/LoginForm'
import LoadingPage from '@/Components/Loading'
import {
	REDIRECT_MEMBER_AFTER_LOGIN_PATH,
	REDIRECT_STAFF_AFTER_LOGIN_PATH,
} from '@/Constants/Auth'
import useToken from '@/Hooks/useToken'
import { ApiErrorResponse } from '@/Interfaces/Auth/ApiErrorResponse'
import { LoginApi } from '@/Interfaces/Auth/Schema/login'
import { OauthResponse } from '@/Interfaces/Auth/Schema/oauth'
import { TokenData } from '@/Interfaces/Auth/Schema/token'
import { useLoginAccount, useOauthAccount } from '@/Services/auth-service'
import { getRoleFromToken } from '@/Utils/Auth/getRoleFromToken'
import { isTokenValid } from '@/Utils/Auth/isTokenValid'
import { PermissionLevel } from '@/Utils/Permissions/isAllowedRole'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Login() {
	const loginMutation = useLoginAccount()
	const handleOauth = useOauthAccount()

	const [formError, setFormError] = useState<string>('')
	const [isLoggingIn, setIsLoggingIn] = useState(false)
	const router = useRouter()
	const tokenStore = useToken()

	const token = tokenStore.accessToken

	const loginSuccess = (data: TokenData) => {
		tokenStore.setAccessToken(data.accessToken)
		setFormError('')
		postLoginRedirect(data.accessToken)
	}

	const postLoginRedirect = (token: string) => {
		const role = getRoleFromToken(token)

		if (PermissionLevel[role] >= PermissionLevel.consultant)
			router.push(REDIRECT_MEMBER_AFTER_LOGIN_PATH)
		else router.push(REDIRECT_STAFF_AFTER_LOGIN_PATH)
	}

	useEffect(() => {
		if (token && isTokenValid(token).valid) postLoginRedirect(token)
	}, [router, token])

	const handleLogin = (formData: LoginApi | OauthResponse) => {
		setIsLoggingIn(true)

		if ('email' in formData && 'password' in formData) {
			loginMutation.mutate(formData, {
				onSuccess: data => loginSuccess(data),
				onError: error => {
					const err = error as AxiosError<ApiErrorResponse>

					if (err.response?.status) {
						const validationErrors = err.response.data
						console.log(validationErrors)

						setIsLoggingIn(false)
						setFormError('login or password is incorrect')
					}
				},
			})
		} else {
			handleOauth.mutate(
				{ credential: formData.credential },
				{
					onSuccess: data => loginSuccess(data),
					onError: error => {
						setIsLoggingIn(false)
						console.log(error)
					},
				}
			)
		}
	}

	if (loginMutation.isPending || loginMutation.isSuccess) return <LoadingPage />

	return (
		<>
			{isLoggingIn && <LoadingPage />}
			<div className='full-screen center-all bg-gradient-to-b from-main to-secondary p-4'>
				<div className='absolute top-0 left-0 full-screen florageBackground' />
				<LoginForm handleLogin={handleLogin} formError={formError} />
			</div>
		</>
	)
}
