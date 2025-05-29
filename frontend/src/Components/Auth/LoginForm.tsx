'use client'

import { motion } from 'motion/react'
import useInput from '@/Hooks/Form/useInput'
import MotionCheckbox from '../Form/MotionCheckbox'
import { loginSchema } from '@/Interfaces/Auth/Schema/login'
import { ZodError } from 'zod'
import { useState } from 'react'
import FloatingLabelInput from '../Form/FloatingLabel'

export type LoginComponentProps = {
	handleLogin: (data: { email: string; password: string }) => void
}

const LoginForm = ({handleLogin} : LoginComponentProps  ) => {
	const { reset: resetEmail, ...email } = useInput('', 'email')
	const { reset: resetPassword, ...password } = useInput('', 'password')
	const { reset: resetRemember, ...remember } = useInput(false, 'checkbox')
	const [errors, setErrors] = useState<Record<string, string>>({})

	const handleReset = () => {
		resetEmail()
		resetPassword()
		resetRemember()
	}

	console.log(handleReset)
	console.log(errors)


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		try {
			const parsed = loginSchema.parse({
				email: email.value,
				password: password.value,
			})
			

			handleLogin({
				...parsed
			})
		} catch (err) {
			if (err instanceof ZodError) {
				const fieldErrors: Record<string, string> = {}
				err.errors.forEach(e => {
					if (e.path[0]) fieldErrors[e.path[0].toString()] = e.message
				})

				setErrors(fieldErrors)
			} else {
				alert('Error occurred.')
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
				<FloatingLabelInput label='Password' id='password' {...password} />

				<MotionCheckbox
					label='Remember me'
					checked={remember.value}
					onCheckedChange={remember.onChange as any}
				/>
				<button
					type='submit'
					className='bg-accent text-white p-2 rounded-full hover:bg-accent-dark transition-colors duration-200'
				>
					Đăng nhập
				</button>
			</form>
			<div className='text-gray-500 text-sm'>Quên mật khẩu? </div>
		</motion.div>
	)
}

export default LoginForm
