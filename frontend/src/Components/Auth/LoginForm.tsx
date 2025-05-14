'use client'

import { motion } from 'motion/react'
import TypedText from '../TypedText'
import useInput from '@/Hooks/Form/useInput'

const LoginForm = () => {
	const { reset: resetUsername, ...username } = useInput('', 'text')
	const { reset: resetPassword, ...password } = useInput('', 'password')

	return (
		<motion.form
			initial={{ translateX: -20 }}
			animate={{ translateX: 0 }}
			transition={{ duration: 1.2 }}
			className='flex border-2 h-80 w-[500px] m-auto'
		>
			<label>
				<TypedText strings={['Login']} startDelay={1.2} typeSpeed={90} />
			</label>
		</motion.form>
	)
}

export default LoginForm
