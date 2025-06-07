import { motion } from 'motion/react'

export const LoadingSkeleton = () => (
	<motion.div
		initial={{ opacity: 0.5 }}
		animate={{ opacity: 1 }}
		transition={{
			duration: 0.8,
			ease: 'easeOut',
			repeat: Infinity,
			repeatType: 'reverse',
		}}
		className='bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300'
	>
		<div className='h-6 bg-gray-300 mb-2 animate-pulse'></div>
		<div className='h-4 bg-gray-200 mb-2 w-3/4 animate-pulse'></div>
		<div className='h-4 bg-gray-200 mb-4 animate-pulse'></div>
		<div className='h-10 bg-gray-300 rounded-full animate-pulse'></div>
	</motion.div>
)
