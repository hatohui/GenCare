'use client'

import RegisterPage from '@/Components/Auth/RegisterForm'
import LoadingPage from '@/Components/Loading'
import LanguageSwitcher from '@/Components/LanguageSwitcher'
import { useRegister } from '@/Hooks/Auth/useRegister'

const Register = () => {
	const { isProcessing, isPending, isSuccess, handleLogin, handleRegister } =
		useRegister()

	if (isPending || isSuccess || isProcessing) return <LoadingPage />

	return (
		<div className='full-screen center-all bg-gradient-to-b from-main to-secondary p-4 flex items-center justify-center'>
			{/* Language Switcher */}
			<div className='absolute top-4 right-4 z-20'>
				<LanguageSwitcher onTop={true} />
			</div>

			<RegisterPage
				className='mt-[3rem]'
				handleRegister={handleRegister}
				handleLogin={handleLogin}
			/>
		</div>
	)
}

export default Register
