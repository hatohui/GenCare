'use client'

import { motion } from 'motion/react'
import useInput from '@/Hooks/Form/useInput'
import MotionCheckbox from '../MotionCheckbox'
import FloatingLabelInput from '../FloatingLabel'
import { loginSchema } from '@/Interfaces/Auth/Schema/login'
import { ZodError } from 'zod'
import { loginUser } from '@/Services/auth-service'
import { useState } from 'react'
import { redirect } from 'next/navigation'

const LoginForm = () => {
	const { reset: resetEmail, ...email } = useInput('', 'email')
	const { reset: resetPassword, ...password } = useInput('', 'password')
	const { reset: resetRemember, ...remember } = useInput(false, 'checkbox')
	const [errors, setErrors] = useState<Record<string, string>>({})

	// const handleReset = () => {
	// 	resetEmail()
	// 	resetPassword()
	// 	resetRemember()
	// }

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		try {
			const parsed = loginSchema.parse({
				email: email.value,
				password: password.value,
			})
			await loginUser(parsed)

			alert('Login successful!')
			redirect('/') // Redirect to dashboard or home page after successful login
		} catch (err) {
			console.log(err)

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
				<FloatingLabelInput
					label='email'
					id='email'
					type='email'
					value={email.value}
					onChange={email.onChange}
					// required
				/>
				{errors.email && (
					<div className='text-red-500 text-sm'>{errors.email}</div>
				)}
				<FloatingLabelInput
					label='password'
					id='password'
					type='password'
					value={password.value}
					onChange={password.onChange}
					// required
				/>
				{errors.password && (
					<div className='text-red-500 text-sm'>{errors.password}</div>
				)}

				<MotionCheckbox
					label='Remember me'
					checked={remember.value}
					onCheckedChange={remember.onChange as any} //can you fix this later? (dont want type to be any)
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
