'use client'
import { motion } from 'motion/react'

const ErrorMessage = () => {
	const bubbleVariants = {
		initial: { opacity: 0, scale: 0.95, y: 10 },
		animate: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
		},
		exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } },
	}
	const textVariants = {
		initial: { opacity: 0, y: 8 },
		animate: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1], delay: 0.1 },
		},
		exit: { opacity: 0, y: 8, transition: { duration: 0.2 } },
	}

	return (
		<motion.div
			className='flex justify-center'
			variants={bubbleVariants}
			initial='initial'
			animate='animate'
			exit='exit'
		>
			<motion.p
				className='text-xs sm:text-sm text-red-500 bg-red-100/50 px-4 py-2 rounded-full'
				variants={textVariants}
			>
				An error occurred. Please try again.
			</motion.p>
		</motion.div>
	)
}

export default ErrorMessage
