'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import RegisterPage from '@/Components/Auth/RegisterForm'
import {
	RegisterApi,
	RegisterFormData,
} from '@/Interfaces/Auth/Schema/register'
import { useRegisterAccount } from '@/Services/auth-service'
import LoadingPage from '@/Components/Loading'
import { setAccessToken } from '@/Utils/setTokens'
import { AxiosError } from 'axios'
import { ApiErrorResponse } from '@/Interfaces/Auth/ApiErrorResponse'

const Register = () => {
	const router = useRouter()
	const registerMutation = useRegisterAccount()

	//handle register Logic
	const handleRegister = (formData: RegisterFormData) => {
		const apiData: RegisterApi = {
			email: formData.email,
			firstName: formData.firstName,
			lastName: formData.lastName,
			gender: formData.gender,
			phoneNumber: formData.phoneNumber,
			dateOfBirth: formData.dateOfBirth,
			password: formData.password,
		}

		console.log(formData)

		registerMutation.mutate(apiData, {
			onSuccess: data => {
				setAccessToken(data)
				router.push('/dashboard')
			},

			onError: error => {
				const err = error as AxiosError<ApiErrorResponse>

				if (err.response?.status) {
					// Handle validation errors
					const validationErrors = err.response.data.errors
					console.error('Validation errors:', validationErrors)
					// You can show these errors in the UI if needed
				}
			},
		})
	}

	//loading page
	if (registerMutation.isPending) return <LoadingPage />

	return (
		<div className='full-screen center-all bg-gradient-to-b from-main to-secondary p-4 flex items-center justify-center'>
			<RegisterPage className='mt-[3rem]' handleRegister={handleRegister} />
		</div>
	)
}

export default Register
