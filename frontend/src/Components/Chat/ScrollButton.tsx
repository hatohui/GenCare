'use client'
import { motion } from 'motion/react'

const ScrollButton = ({ onClick }: { onClick: () => void }) => (
	<motion.button
		className='absolute bottom-4 right-4 bg-accent text-white p-2.5 rounded-full shadow-lg hover:bg-accent/90'
		onClick={onClick}
		initial={{ opacity: 0, scale: 0.8 }}
		animate={{ opacity: 1, scale: 1 }}
		exit={{ opacity: 0, scale: 0.8 }}
		transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
	>
		<svg
			xmlns='http://www.w3.org/2000/svg'
			className='h-5 w-5'
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
				d='M19 14l-7 7m0 0l-7-7m7 7V3'
			/>
		</svg>
	</motion.button>
)

export default ScrollButton
