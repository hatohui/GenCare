'use client'

import { motion } from 'framer-motion'

export default function LoadingPage() {
	return (
		<div className='fixed top-0 left-0 w-full h-1 z-[9999]'>
			<motion.div
				className='h-full bg-main'
				initial={{ width: 0 }}
				animate={{ width: '100%' }}
				transition={{
					duration: 2,
					ease: 'easeInOut',
					repeat: Infinity,
					repeatType: 'loop',
				}}
				variants={{
					animate: {
						width: ['0%', '100%'],
					},
				}}
			/>
		</div>
	)
}
