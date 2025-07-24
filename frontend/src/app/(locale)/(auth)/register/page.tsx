'use client'

import RegisterPage from '@/Components/Auth/RegisterForm'
import LoadingPage from '@/Components/Loading'
import LanguageSwitcher from '@/Components/LanguageSwitcher'
import { useRegister } from '@/Hooks/Auth/useRegister'
import ReturnButton from '@/Components/Common/ReturnButton'
import FlorageBackground from '@/Components/Landing/FlorageBackground'

const Register = () => {
	const { isProcessing, isPending, isSuccess, handleLogin, handleRegister } =
		useRegister()

	if (isPending || isSuccess || isProcessing) return <LoadingPage />

	return (
		<div className='full-screen center-all bg-gradient-to-b from-main to-secondary p-4 flex items-center justify-center'>
			<FlorageBackground className='z-0' />
			<div className='absolute top-4 left-4 z-20'>
				<ReturnButton />
			</div>

			<div className='absolute top-4 right-4 z-20'>
				<LanguageSwitcher onTop={true} />
			</div>

			<RegisterPage
				className='mt-[3rem] z-10'
				handleRegister={handleRegister}
				handleLogin={handleLogin}
			/>
		</div>
	)
}

export default Register
