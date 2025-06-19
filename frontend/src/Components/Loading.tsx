'use client'

import { motion } from 'motion/react'

export default function LoadingPage() {
	return (
		<div className='fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[9999]'>
			<motion.div
				className='w-20 h-20 rounded-full border-8 border-solid border-gray-200/50 border-t-accent spinner'
				animate={{
					rotate: 360,
					scale: [0.8, 1.2, 0.8],
					opacity: [0.5, 1, 0.5],
				}}
				transition={{
					rotate: {
						duration: 2,
						repeat: Infinity,
						ease: 'linear',
					},
					scale: {
						duration: 2,
						repeat: Infinity,
						ease: 'easeInOut',
					},
					opacity: {
						duration: 2,
						repeat: Infinity,
						ease: 'easeInOut',
					},
				}}
			>
				<motion.div
					className='w-full h-full rounded-full bg-accent'
					animate={{
						scale: [0.8, 1.2, 0.8],
					}}
					transition={{
						scale: {
							duration: 2,
							repeat: Infinity,
							ease: 'easeInOut',
						},
					}}
				/>
			</motion.div>
		</div>
	)
}
