'use client'

import LoginForm from '@/Components/Auth/LoginForm'
import LoadingPage from '@/Components/Loading'
import LanguageSwitcher from '@/Components/LanguageSwitcher'
import { useLogin } from '@/Hooks/Auth/useLogin'
import ReturnButton from '@/Components/Common/ReturnButton'

export default function Login() {
	const { isLoggingIn, formError, handleLogin, isPending, isSuccess } =
		useLogin()

	if (isPending || isSuccess || isLoggingIn) return <LoadingPage />

	return (
		<div className='full-screen center-all bg-gradient-to-b from-main to-secondary p-4'>
			<div className='absolute top-0 left-0 full-screen florageBackground' />
			<div className='absolute top-4 left-4 z-20'>
				<ReturnButton />
			</div>

			<div className='absolute top-4 right-4 z-20'>
				<LanguageSwitcher onTop={true} />
			</div>

			<LoginForm handleLogin={handleLogin} formError={formError} />
		</div>
	)
}
