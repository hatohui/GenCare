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
import { AxiosError } from 'axios'
import { ApiErrorResponse } from '@/Interfaces/Auth/ApiErrorResponse'
import useToken from '@/Hooks/useToken'
import {
	REDIRECT_MEMBER_AFTER_LOGIN_PATH,
	REDIRECT_STAFF_AFTER_LOGIN_PATH,
} from '@/Constants/Auth'
import { getRoleFromToken } from '@/Utils/Auth/getRoleFromToken'
import { PermissionLevel } from '@/Utils/Permissions/isAllowedRole'

const Register = () => {
	const router = useRouter()
	const registerMutation = useRegisterAccount()
	const tokenStore = useToken()

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

		registerMutation.mutate(apiData, {
			onSuccess: data => {
				tokenStore.setAccessToken(data.accessToken)
				const role = getRoleFromToken(data.accessToken)

				if (PermissionLevel[role] >= PermissionLevel.consultant)
					router.push(REDIRECT_MEMBER_AFTER_LOGIN_PATH)
				else router.push(REDIRECT_STAFF_AFTER_LOGIN_PATH)
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
