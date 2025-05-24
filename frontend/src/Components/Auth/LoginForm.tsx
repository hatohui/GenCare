'use client'

import { motion } from 'motion/react'
import TypedText from '../TypedText'
import useInput from '@/Hooks/Form/useInput'

const LoginForm = () => {
	const { reset: resetUsername, ...username } = useInput('', 'text')
	const { reset: resetPassword, ...password } = useInput('', 'password')
	const { reset: resetRemember, ...remember } = useInput(false, 'checkbox')

	const handleReset = () => {
		resetUsername()
		resetPassword()
		resetRemember()
	}

	console.log(handleReset)

	const handleSubmit = () => {}

	return (
		<motion.div
			className=' flex-col flex items-center justify-center h-120 w-[500px] rounded-2xl bg-white shadow-lg'
			initial={{ translateX: -20, opacity: 0 }}
			animate={{ translateX: 0, opacity: 1 }}
			transition={{ duration: 1.2, ease: 'easeOut' }}
		>
			<div className='text-3xl font-bold text-accent'>Logo here</div>
			<form onSubmit={handleSubmit} className='flex flex-col gap-4 p-4 w-full'>
				<label htmlFor='username' className='text-sm font-semibold'>
					Username
				</label>
				<input
					{...username}
					placeholder='example@gmail.com'
					className='p-2 rounded'
				/>
				<label htmlFor='password' className='text-sm font-semibold'>
					password
				</label>
				<input
					type='password'
					placeholder='Password'
					value={password.value}
					onChange={password.onChange}
					className='p-2 rounded'
				/>
				<div className='flex items-center gap-2'>
					<input
						type='checkbox'
						id='remember'
						checked={remember.value}
						onChange={remember.onChange}
						className='cursor-pointer'
					/>
					<label htmlFor='remember' className='cursor-pointer'>
						Remember me
					</label>
				</div>
				<button type='submit' className='bg-accent text-white p-2 rounded'>
					Login
				</button>
			</form>
		</motion.div>
	)
}

export default LoginForm
