'use client'

import LoginForm from '@/Components/Auth/LoginForm'
import LoadingPage from '@/Components/Loading'
import { useLogin } from '@/Hooks/Auth/useLogin'

export default function Login() {
	const { isLoggingIn, formError, handleLogin, isPending, isSuccess } =
		useLogin()

	if (isPending || isSuccess || isLoggingIn) return <LoadingPage />

	return (
		<div className='full-screen center-all bg-gradient-to-b from-main to-secondary p-4'>
			<div className='absolute top-0 left-0 full-screen florageBackground' />
			<LoginForm handleLogin={handleLogin} formError={formError} />
		</div>
	)
}
