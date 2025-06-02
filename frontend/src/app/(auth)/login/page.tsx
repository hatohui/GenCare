'use client'

import LoginForm from '@/Components/Auth/LoginForm'
import LoadingPage from '@/Components/Loading'
import useAccountStore from '@/Hooks/useToken'
import { ApiErrorResponse } from '@/Interfaces/Auth/ApiErrorResponse'
import { LoginApi } from '@/Interfaces/Auth/Schema/login'
import { useLoginAccount } from '@/Services/auth-service'
import { setAccessToken } from '@/Utils/setTokens'
import { AxiosError } from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Login() {
	const loginMutation = useLoginAccount()
	const error = useSearchParams().get('error')
	const errorMap: Record<string, string> = {
		invalid_session: 'Invalid session, please log in again.',
		session_expired: 'Your session has expired. Please log in again.',
		unauthorized: 'You are not authorized to access that page.',
	}

	const paramError = error && errorMap[error]
	const [formError, setFormError] = useState<string>(paramError || '')
	const store = useAccountStore()
	const account = store.account
	const router = useRouter()

	useEffect(() => {
		if (account) {
			console.log(account)
			router.push('/dashboard')
		}
	}, [store, router])

	const handleLogin = (formData: LoginApi) => {
		loginMutation.mutate(formData, {
			onSuccess: data => {
				console.log(data)

				setAccessToken(data)
				setFormError('')
				router.push('/dashboard')
			},
			onError: error => {
				console.log(error)

				const err = error as AxiosError<ApiErrorResponse>

				if (err.response?.status) {
					// Handle validation errors
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
				<LoginForm handleLogin={handleLogin} formError={formError} />
			</div>
		</>
	)
}
