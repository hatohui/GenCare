'use client'

import { motion } from 'motion/react'

export default function LoadingPage() {
	return (
		<div className='fixed top-0 left-0 w-full h-full flex items-center justify-center z-[9999]'>
			<motion.div
				className='w-[50px] h-[50px] rounded-full border-4 border-solid border-divider border-t-accent spinner'
				animate={{ rotate: 360 }}
				transition={{
					duration: 0.5,
					repeat: Infinity,
					ease: 'linear',
				}}
			/>
		</div>
	)
}
