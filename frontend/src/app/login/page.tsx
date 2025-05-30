'use client'

import LoginForm from '@/Components/Auth/LoginForm'
import { LoginAPI } from '@/Interfaces/Auth/Schema/login'
import { useLoginAccount } from '@/Services/auth-service'
import { setCookie } from 'cookies-next/client'

import { useRouter } from 'next/navigation'
export default function Login() {

	const router = useRouter()
	const loginMutation = useLoginAccount()

	const handleLogin = (formData: LoginAPI) => {
		loginMutation.mutate(formData, {
			onSuccess: data => {
				setCookie('accessToken', data.accessToken, {
					sameSite: 'strict',
					maxAge: data.accessTokenExpiration.getUTCSeconds(),
				})
				setCookie('refreshToken', data.refreshToken)
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
