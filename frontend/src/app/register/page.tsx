'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import RegisterPage from '@/Components/Auth/RegisterForm'
import {
	RegisterAPI,
	RegisterFormData,
} from '@/Interfaces/Auth/Schema/register'
import { useRegisterAccount } from '@/Services/auth-service'
import LoadingPage from '@/Components/Loading'
import { setCookie } from 'cookies-next/client'

const Register = () => {
	const router = useRouter()
	const registerMutation = useRegisterAccount()

	const handleRegister = (formData: RegisterFormData) => {
		const apiData: RegisterAPI = {
			email: formData.email,
			firstName: formData.firstName,
			lastName: formData.lastName,
			gender: formData.gender,
			phoneNumber: formData.phoneNumber,
			dateOfBirth: formData.dateOfBirth,
			password: formData.password,
		}

		//on success, set cookies
		registerMutation.mutate(apiData, {
			onSuccess: data => {
				setCookie('accessToken', data.accessToken, {
					sameSite: 'strict',
					maxAge: data.accessTokenExpiration.getUTCSeconds(),
				})
				setCookie('refreshToken', data.refreshToken)
				router.push('/dashboard')
			},
			onError: error => {
				console.error('Registration error:', error)
				// show toast or error message if needed
			},
		})
	}

	if (registerMutation.isPending) return <LoadingPage />

	return (
		<div className='full-screen center-all bg-gradient-to-b from-main to-secondary p-4 flex items-center justify-center'>
			<RegisterPage handleRegister={handleRegister} />
		</div>
	)
}

export default Register
