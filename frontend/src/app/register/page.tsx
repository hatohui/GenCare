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
import { setAccessToken } from '@/Utils/setAccessToken'

const Register = () => {
	const router = useRouter()
	const registerMutation = useRegisterAccount()

	//handle register Logic
	const handleRegister = (formData: RegisterFormData) => {
		const apiData: RegisterApi = {
			email: formData.email,
			firstName: formData.firstName,
			lastName: formData.lastName,
			gender: Boolean(formData.gender),
			phoneNumber: formData.phoneNumber,
			dateOfBirth: formData.dateOfBirth,
			password: formData.password,
		}

		registerMutation.mutate(apiData, {
			onSuccess: data => {
				setAccessToken(data)
				router.push('/dashboard')
			},

			onError: error => {
				console.error('Registration error:', error)
				// show toast or error message if needed
			},
		})
	}

	//loading page
	if (registerMutation.isPending) return <LoadingPage />

	return (
		<div className='full-screen center-all bg-gradient-to-b from-main to-secondary p-4 flex items-center justify-center'>
			<RegisterPage handleRegister={handleRegister} />
		</div>
	)
}

export default Register
