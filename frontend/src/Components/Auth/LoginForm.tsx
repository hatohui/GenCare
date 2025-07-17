'use client'

import { motion } from 'motion/react'
import useInput from '@/Hooks/Form/useInput'
import { loginSchema } from '@/Interfaces/Auth/Schema/login'
import { ZodError } from 'zod/v4'
import { useState } from 'react'
import FloatingLabelInput from '../Form/FloatingLabel'
import GoogleLoginButton from './GoogleLoginButton'
import { NoSeeSVG, SeeSVG } from '../SVGs'
import SubmitButton from './SubmitButton'
import Logo from '../Logo'
import Link from 'next/link'
import { OauthResponse } from '@/Interfaces/Auth/Schema/oauth'
import { useLocale } from '@/Hooks/useLocale'

export type LoginComponentProps = {
	handleLogin: (
		data: { email: string; password: string } | OauthResponse,
		rememberMe: boolean
	) => void
	formError: string | null
}

const LoginForm = ({ handleLogin, formError }: LoginComponentProps) => {
	const { reset: resetEmail, ...email } = useInput('', 'email')
	const { reset: resetPassword, ...password } = useInput('', 'password')
	const { reset: resetRemember, ...remember } = useInput(false, 'checkbox')
	const [showPassword, setShowPassword] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const { t } = useLocale()

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

			handleLogin(
				{
					email: parsed.data?.email as string,
					password: parsed.data?.password as string,
				},
				remember.value
			)
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
			className='flex-col z-10 flex items-center pb-5 justify-center w-[500px] rounded-2xl bg-white shadow-lg p-4'
			initial={{ translateX: -20, opacity: 0 }}
			animate={{ translateX: 0, opacity: 1 }}
			transition={{ duration: 1.2, ease: 'easeOut' }}
		>
			<form onSubmit={handleSubmit} className='flex flex-col p-4 w-full'>
				<div className='center-all flex-col gap-3'>
					<Logo className='w-12 drop-shadow-md' />
					<div className='text-xl font-medium mb-4 drop-shadow-md'>
						{t('auth.login')}
					</div>
				</div>
				<FloatingLabelInput
					className='mt-4'
					label={t('common.email')}
					id='email'
					autocomplete='username'
					{...email}
				/>
				<div className='relative mt-2'>
					<FloatingLabelInput
						label={t('common.password')}
						id='password'
						autocomplete='password'
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

				<div className='m-2 flex justify-between'>
					<div>
						<label className='flex items-center gap-2'>
							<input name='agreeToTerms' {...remember} className={`w-4 h-4`} />
							<span className='select-none color-text'>
								{t('auth.rememberMe')}
							</span>
						</label>
					</div>
					<Link
						href='/forgot-password'
						className='select-none underline text-blue-400 hover:text-blue-600 cursor-pointer transition-colors duration-200'
					>
						{t('auth.forgotPassword')}
					</Link>
				</div>

				{formError && (
					<p className='text-red-500 text-sm mb-3 text-center'>{formError}</p>
				)}

				<SubmitButton
					label={t('auth.login')}
					buttonClass='bg-main drop-shadow-lg text-white w-full p-2 rounded-full flex justify-center bg-gradient-to-r from-accent to-accent/80 backdrop-blur-3xl hover:from-accent/90 hover:to-accent	 '
				/>
			</form>

			<div className='w-full flex items-center gap-2 max-w-90 my-4'>
				<div className='h-[1px] flex-1 bg-gray-300'></div>
				<span className='text-gray-500 text-sm px-2'>{t('auth.or')}</span>
				<div className='h-[1px] flex-1 bg-gray-300'></div>
			</div>

			<div className='text-center'>
				<GoogleLoginButton
					text='signin_with'
					className='mt-2 mx-auto'
					handleLogin={response => handleLogin(response, remember.value)}
				/>
			</div>
		</motion.div>
	)
}

export default LoginForm
