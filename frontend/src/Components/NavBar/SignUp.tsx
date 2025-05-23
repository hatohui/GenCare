import { motion } from 'framer-motion'

export type SignUpProp = {
	className?: string
}

export default function SignUp({ className }: SignUpProp) {
	return (
		<motion.div
			className={`flex items-center space-x-2 cursor-pointer font-medium text-white ${className}`}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			<span>Sign Up</span>
			<div className='w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center'>
				<svg
					className='stroke-white w-6 h-6'
					fill='none'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<circle cx='12' cy='7' r='4'></circle>
					<path d='M5.5 21a6.5 6.5 0 0113 0'></path>
				</svg>
			</div>
		</motion.div>
	)
}
