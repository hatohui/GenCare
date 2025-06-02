'use client'

import LoginForm from '@/Components/Auth/LoginForm'
import LoadingPage from '@/Components/Loading'
import { ApiErrorResponse } from '@/Interfaces/Auth/ApiErrorResponse'
import { LoginApi } from '@/Interfaces/Auth/Schema/login'
import { useLoginAccount } from '@/Services/auth-service'
import { setAccessToken } from '@/Utils/setAccessToken'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
	const router = useRouter()
	const loginMutation = useLoginAccount()
	const [formError, setFormError] = useState<string | null>(null)

	const handleLogin = (formData: LoginApi) => {
		loginMutation.mutate(formData, {
			onSuccess: data => {
				setAccessToken(data)
				setFormError(null)
				router.push('/dashboard')
			},
			onError: error => {
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

	if (loginMutation.isPending) return <LoadingPage />

	return (
		<>
			<div className='full-screen center-all bg-gradient-to-b from-main to-secondary p-4'>
				<LoginForm handleLogin={handleLogin} formError={formError} />
			</div>
		</>
	)
}
