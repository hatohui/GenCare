'use client'

import { motion } from 'motion/react'
import TypedText from '../TypedText'
import useInput from '@/Hooks/Form/useInput'
import MotionCheckbox from '../MotionCheckbox'
import FloatingLabelInput from '../FloatingLabel'
import { on } from 'events'

const LoginForm = () => {
	const { reset: resetUsername, ...username } = useInput('', 'text')
	const { reset: resetPassword, ...password } = useInput('', 'password')
	const { reset: resetRemember, ...remember } = useInput(false, 'checkbox')

	const handleReset = () => {
		resetUsername()
		resetPassword()
		resetRemember()
	}

	const handleSubmit = () => {}

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
					label='username'
					id='username'
					type='username'
					value={username.value}
					onChange={username.onChange}
				/>
				<FloatingLabelInput
					label='password'
					id='password'
					type='password'
					value={password.value}
					onChange={password.onChange}
				/>

				<MotionCheckbox
					label='Remember me'
					checked={remember.value}
					onCheckedChange={remember.onChange as any} //can you fix this later? (dont want this to be any)
				/>
				<button
					type='submit'
					className='bg-accent text-white p-2 rounded-full hover:bg-accent-dark transition-colors duration-200'
				>
					Login
				</button>
			</form>
			<div className='text-gray-500 text-sm'>forgot your password? </div>
		</motion.div>
	)
}

export default LoginForm
