'use client'

import { motion } from 'motion/react'

export default function LoadingPage() {
	return (
		<div className='fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[9999]'>
			<motion.div
				className='w-16 h-16 rounded-full border-4 border-solid border-gray-200/30 border-t-accent shadow-lg spinner'
				animate={{
					rotate: 360,
					scale: [0.95, 1, 0.95],
				}}
				transition={{
					rotate: {
						duration: 1,
						repeat: Infinity,
						ease: 'linear',
					},
					scale: {
						duration: 1,
						repeat: Infinity,
						ease: 'easeInOut',
					},
				}}
			/>
		</div>
	)
}
