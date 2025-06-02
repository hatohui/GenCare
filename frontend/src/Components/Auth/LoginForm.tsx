'use client'

import { motion } from 'motion/react'
import useInput from '@/Hooks/Form/useInput'
import { loginSchema } from '@/Interfaces/Auth/Schema/login'
import { ZodError } from 'zod/v4'
import { useState } from 'react'
import FloatingLabelInput from '../Form/FloatingLabel'
import GoogleLoginButton from './GoogleLoginButton'
import { SubmitButton } from './RegisterForm'
import { NoSeeSVG, SeeSVG } from '../Form/SVGs'

export type LoginComponentProps = {
	handleLogin: (data: { email: string; password: string }) => void
	formError: string | null
}

const LoginForm = ({ handleLogin, formError }: LoginComponentProps) => {
	const { reset: resetEmail, ...email } = useInput('', 'email')
	const { reset: resetPassword, ...password } = useInput('', 'password')
	const { reset: resetRemember, ...remember } = useInput(false, 'checkbox')
	const [showPassword, setShowPassword] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})

	const resetCredentials = () => {
		resetEmail()
		resetPassword()
		resetRemember()
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		try {
			const parsed = loginSchema.safeParse({
				email: email.value,
				password: password.value,
			})

			handleLogin({
				email: parsed.data?.email as string,
				password: parsed.data?.password as string,
			})
		} catch (err) {
			if (err instanceof ZodError) {
				setErrors(
					Object.fromEntries(
						err.issues.map(issue => [issue.path[0] as string, issue.message])
					)
				)
			} else {
				alert('Error occurred.')
				resetCredentials()
				console.log(errors)
			}
		}
	}

	return (
		<motion.div
			className=' flex-col flex items-center justify-center h-120 w-[500px] rounded-2xl bg-white shadow-lg p-4'
			initial={{ translateX: -20, opacity: 0 }}
			animate={{ translateX: 0, opacity: 1 }}
			transition={{ duration: 1.2, ease: 'easeOut' }}
		>
			<div className='text-3xl font-bold text-accent'>Logo here</div>
			<form onSubmit={handleSubmit} className='flex flex-col gap-4 p-4 w-full'>
				<FloatingLabelInput label='Email' id='email' {...email} />
				<div className='relative'>
					<FloatingLabelInput
						label='Password'
						id='password'
						{...password}
						type={showPassword ? 'text' : 'password'}
					/>
					<button
						type='button'
						className='absolute right-3 top-1/2 text-slate-700 transform -translate-y-1/2 pb-3'
						onClick={() => setShowPassword(!showPassword)}
					>
						{showPassword ? <NoSeeSVG /> : <SeeSVG />}
					</button>
				</div>
				{formError && (
					<p className='text-red-500 text-sm text-center'>{formError}</p>
				)}
				<div className='mb-4 mt-2'>
					<label
						className={`flex items-center gap-2 text-gray-700'
					`}
					>
						<input name='agreeToTerms' {...remember} className={`w-4 h-4`} />
						<span>Remember me</span>
					</label>
				</div>

				<SubmitButton buttonClass='bg-main text-white w-full p-2 rounded-full flex justify-center bg-gradient-to-r from-accent to-accent/80 backdrop-blur-3xl hover:from-accent/90 hover:to-accent	 ' />
			</form>
			<div className='text-gray-500 text-sm'>Quên mật khẩu? </div>

			<GoogleLoginButton />
		</motion.div>
	)
}

export default LoginForm
