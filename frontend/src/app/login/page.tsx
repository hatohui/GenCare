'use client'

import LoginForm from '@/Components/Auth/LoginForm'
import { LoginApi } from '@/Interfaces/Auth/Schema/login'
import { useLoginAccount } from '@/Services/auth-service'
import { setAccessToken } from '@/Utils/setAccessToken'
import { useRouter } from 'next/navigation'

export default function Login() {
	const router = useRouter()
	const loginMutation = useLoginAccount()

	const handleLogin = (formData: LoginApi) => {
		loginMutation.mutate(formData, {
			onSuccess: data => {
				setAccessToken(data)
				router.push('/dashboard')
			},
			onError: error => {
				console.error('Login error:', error)
				// Show toast or error message if needed
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
