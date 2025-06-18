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
import { REDIRECT_AFTER_LOGIN } from '@/Constants/Auth'
import Image from 'next/image'
import FlorageBackground from '@/Components/Landing/FlorageBackground'
import { motion } from 'motion/react'
import Logo from '@/Components/Logo'
import FooterSection from '@/Components/Landing/Footer'

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
				router.push(REDIRECT_AFTER_LOGIN)
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
		<main className='relative p-4 flex-col bg-gradient-to-b from-main to-secondary justify-center'>
			<Logo withLabel className='z-10 py-4 text-white' />

			<div className='w-7xl mb-5 mx-auto h-[700px] relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center bg-general rounded-[30px] px-7'>
				<div className='asfaltBackground absolute inset-0 z-[-1] opacity-50 rounded-3xl' />
				<RegisterPage
					className='w-full z-10 '
					handleRegister={handleRegister}
				/>
				<motion.div
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.5 }}
				>
					<object
						data='/svgs/register.svg'
						className='hidden md:flex overflow-hidden h-[600px] w-full'
					/>
				</motion.div>
			</div>
			<FooterSection />
			<div className='absolute top-0 left-0 full-screen florageBackground' />
		</main>
	)
}

export default Register
