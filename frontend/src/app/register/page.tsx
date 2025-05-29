import RegisterPage from '@/Components/Auth/RegisterForm'
import {
	RegisterAPI,
	RegisterFormData,
} from '@/Interfaces/Auth/Schema/register'
import { useRegisterAccount } from '@/Services/auth-service'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
	const router = useRouter()

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

		const { isError, isPending, isSuccess, data } = useRegisterAccount(apiData)

		if (isError) {
			//HANDLE ERROR
		}

		if (isSuccess && data) {
			document.cookie = `accessToken=${data.accessToken}; path=/; max-age=86400; secure; samesite=strict`
			router.push('/dashboard')
		}
	}

	return (
		<div className='full-screen center-all bg-gradient-to-b from-main to-secondary p-4 flex items-center justify-center'>
			<RegisterPage handleRegister={handleRegister} />
		</div>
	)
}

export default page
