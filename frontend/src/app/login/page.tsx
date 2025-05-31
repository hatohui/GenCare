'use client'

import LoginForm from '@/Components/Auth/LoginForm'
import { ApiErrorResponse } from '@/Interfaces/Auth/ApiErrorResponse'
import { LoginAPI } from '@/Interfaces/Auth/Schema/login'
import { useLoginAccount } from '@/Services/auth-service'
import { setAccessToken } from '@/Utils/setAccessToken'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'

export default function Login() {
	const router = useRouter()
	const loginMutation = useLoginAccount()

	const handleLogin = (formData: LoginAPI) => {
		loginMutation.mutate(formData, {
			onSuccess: data => {
				setAccessToken(data)
				router.push('/dashboard')
			},
			onError: error => {
				const err = error as AxiosError<ApiErrorResponse>

				if (err.response?.status) {
					// Handle validation errors
					const validationErrors = err.response.data
					console.error('Validation errors:', validationErrors)
					// You can show these errors in the UI if needed
				}
			},
		})
	}

	return (
		<>
			<div className='full-screen center-all bg-gradient-to-b from-main to-secondary p-4'>
				<LoginForm handleLogin={handleLogin} />
			</div>
		</>
	)
}
