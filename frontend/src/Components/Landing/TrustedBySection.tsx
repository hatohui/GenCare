'use client'

import { motion } from 'motion/react'

export default function TrustedBySection() {
	return (
		<section className='relative md:absolute py-10 bg-gradient-to-b from-white to-general  text-center flex flex-col items-center justify-center px-6 rounded-[30px] w-3xl max-w-5xl mx-auto left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl '>
			<motion.p
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='text-sm text-main mb-8 tracking-wide uppercase z-10 relative'
			>
				Được Tin Tưởng Bởi
			</motion.p>
			<div className='flex flex-wrap justify-center gap-8 items-center max-w-5xl mx-auto z-10 relative'>
				{Array(5)
					.fill(0)
					.map((_, i) => (
						<motion.img
							key={i}
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: i * 0.1 }}
							src={`/logo${i + 1}.png`} // Replace with your logo paths
							alt={`Logo ${i + 1}`}
							className='h-12 grayscale hover:grayscale-0 transition duration-300'
						/>
					))}
			</div>
		</section>
	)
}
