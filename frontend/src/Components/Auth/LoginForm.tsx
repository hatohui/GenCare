'use client'

import { motion } from 'motion/react'
import TypedText from '../TypedText'
import useInput from '@/Hooks/Form/useInput'

const LoginForm = () => {
	const { reset: resetUsername, ...username } = useInput('', 'text')
	const { reset: resetPassword, ...password } = useInput('', 'password')
	const { reset: resetRemember, ...remember } = useInput(false, 'checkbox')

	const handleSubmit = () => {}

	return (
		<motion.form
			initial={{ translateX: -20 }}
			animate={{ translateX: 0 }}
			transition={{ duration: 1.2 }}
			className='border-2 h-80 w-[500px] m-auto select-none'
			onSubmit={handleSubmit}
		>
			<div className='w-full'>
				<TypedText strings={['Login']} startDelay={1.2} typeSpeed={90} />
			</div>
			<div className='my-5 mx-5'>
				<div className='flex flex-col border-2'>
					<label htmlFor='username'>Username</label>
					<motion.input id='username' {...username} />
				</div>
				<div className='flex flex-col border-2'>
					<label htmlFor='password'>Password</label>
					<motion.input id='password' {...password} />
				</div>
				<div>
					<motion.input id='remember' {...remember} />
					<label htmlFor='remember'> Remember me</label>
				</div>
			</div>
			<div>
				<motion.button id='submit' type='submit' className='px-5 py-2 border-2'>
					<label htmlFor='submit'>Login</label>
				</motion.button>
				<motion.button
					id='googleAuth'
					className='pl-2 py-2 pr-3 border-2 flex gap-3 items-center'
				>
					<svg
						className='h-7 text-white'
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 488 512'
					>
						<path d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z' />
					</svg>
					<label htmlFor='googleAuth'>Login with Google</label>
				</motion.button>
			</div>
		</motion.form>
	)
}

export default LoginForm
