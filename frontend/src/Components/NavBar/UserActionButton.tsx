import { motion } from 'framer-motion'
import { NavComponentProps } from '../NavBar'

const UserActionButton = ({ className, onTop }: NavComponentProps) => {
	return (
		<motion.div
			className={`gap-3 ${className} ${onTop ? 'text-accent' : 'text-white'}`}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			<motion.button
				id='signUp'
				className='cursor-pointer font-medium select-none pt-1 px-2 text-center flex'
				whileHover={{
					filter: 'brightness(0.8)',
				}}
			>
				Sign Up
			</motion.button>
			<motion.button
				className='bg-blue-500 rounded-full p-1 cursor-pointer'
				whileHover={{
					filter: 'brightness(0.8)',
				}}
			>
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
			</motion.button>
		</motion.div>
	)
}

export default UserActionButton
