'use client'

import LoginForm from '@/Components/Auth/LoginForm'
import LoadingPage from '@/Components/Loading'
import { REDIRECT_AFTER_LOGIN } from '@/Constants/Auth'
import useToken from '@/Hooks/useToken'
import { ApiErrorResponse } from '@/Interfaces/Auth/ApiErrorResponse'
import { LoginApi } from '@/Interfaces/Auth/Schema/login'
import { useLoginAccount } from '@/Services/auth-service'
import { isTokenValid } from '@/Utils/isTokenValid'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Login() {
	const loginMutation = useLoginAccount()
	const [formError, setFormError] = useState<string>('')
	const router = useRouter()
	const tokenStore = useToken()
	const token = tokenStore.accessToken

	useEffect(() => {
		if (token && isTokenValid(token).valid) router.push('/dashboard')
	}, [router, token])

	const handleLogin = (formData: LoginApi) => {
		loginMutation.mutate(formData, {
			onSuccess: data => {
				tokenStore.setAccessToken(data.accessToken)
				setFormError('')
				router.push(REDIRECT_AFTER_LOGIN)
			},
			onError: error => {
				const err = error as AxiosError<ApiErrorResponse>

				if (err.response?.status) {
					const validationErrors = err.response.data
					console.error('Validation errors:', validationErrors)
					setFormError('login or password is incorrect')
				}
			},
		})
	}

	if (loginMutation.isPending || loginMutation.isSuccess) return <LoadingPage />

	return (
		<>
			<div className='full-screen center-all bg-gradient-to-b from-main to-secondary p-4'>
				<div className='absolute top-0 left-0 full-screen florageBackground' />
				<LoginForm handleLogin={handleLogin} formError={formError} />
			</div>
		</>
	)
}
