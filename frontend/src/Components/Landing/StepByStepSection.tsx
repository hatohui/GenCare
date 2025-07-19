'use client'

import { motion } from 'motion/react'
import { useState } from 'react'
import { useLocale } from '@/Hooks/useLocale'

export default function ProcessSteps() {
	const { t } = useLocale()
	const [isInView, setIsInView] = useState(false)

	const timelineData = [
		{
			step: '1',
			title: t('landing.steps.step1.title'),
			description: t('landing.steps.step1.description'),
			icon: (
				<svg
					className='w-12 h-12 text-blue-500'
					fill='currentColor'
					viewBox='0 0 24 24'
				>
					<path d='M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z' />
				</svg>
			),
		},
		{
			step: '2',
			title: t('landing.steps.step2.title'),
			description: t('landing.steps.step2.description'),
			icon: (
				<svg
					className='w-12 h-12 text-green-500'
					fill='currentColor'
					viewBox='0 0 24 24'
				>
					<path d='M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z' />
					<path d='M9 12l2 2 4-4' />
				</svg>
			),
		},
		{
			step: '3',
			title: t('landing.steps.step3.title'),
			description: t('landing.steps.step3.description'),
			icon: (
				<svg
					className='w-12 h-12 text-purple-500'
					fill='currentColor'
					viewBox='0 0 24 24'
				>
					<path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
				</svg>
			),
		},
		{
			step: '4',
			title: t('landing.steps.step4.title'),
			description: t('landing.steps.step4.description'),
			icon: (
				<svg
					className='w-12 h-12 text-orange-500'
					fill='currentColor'
					viewBox='0 0 24 24'
				>
					<path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
					<path d='M12 6v6l4 2' />
				</svg>
			),
		},
	]

	return (
		<section className='py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden pb-40'>
			{/* Background decoration */}
			<div className='absolute inset-0 opacity-5'>
				<motion.div
					animate={{
						scale: [1, 1.1, 1],
						opacity: [0.05, 0.1, 0.05],
					}}
					transition={{
						duration: 6,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
					className='absolute top-10 left-20 w-32 h-32 bg-main rounded-full blur-3xl'
				></motion.div>
				<motion.div
					animate={{
						scale: [1.1, 1, 1.1],
						opacity: [0.05, 0.1, 0.05],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
					className='absolute bottom-10 right-20 w-40 h-40 bg-secondary rounded-full blur-3xl'
				></motion.div>
			</div>

			<div className='relative z-10 max-w-7xl mx-auto px-8'>
				<motion.h2
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: 'easeOut' }}
					className='text-5xl md:text-6xl font-bold text-center mb-20 text-secondary leading-tight'
					viewport={{ once: true, amount: 0.3 }}
				>
					{t('landing.steps.process_title')}{' '}
					<span className='bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent'>
						{t('landing.steps.at_gencare')}
					</span>
				</motion.h2>

				<div className='relative min-h-[700px]'>
					{/* Timeline vertical line animation */}
					<motion.div
						initial={{ scaleY: 0 }}
						whileInView={{ scaleY: 1 }}
						transition={{ duration: 2, ease: 'easeInOut' }}
						className='absolute left-1/2 transform -translate-x-1/2 w-2 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 h-full z-0 rounded-full shadow-lg origin-top'
						viewport={{ once: true, amount: 0.3 }}
						onAnimationStart={() => setIsInView(true)}
					></motion.div>

					{/* Timeline items */}
					{timelineData.map((item, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, x: i % 2 === 0 ? -80 : 80 }}
							animate={isInView ? { opacity: 1, x: 0 } : {}}
							transition={{
								duration: 0.8,
								delay: 0.5 + i * 0.4, // Delay based on line animation progress
								ease: 'easeOut',
							}}
							className={`relative flex items-center mb-20 ${
								i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
							}`}
						>
							{/* Enhanced Content card */}
							<motion.div
								whileHover={{
									scale: 1.05,
									y: -5,
									transition: { duration: 0.3, ease: 'easeOut' },
								}}
								className={`bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 w-96 z-10 border border-gray-100/50 ${
									i % 2 === 0 ? 'mr-20' : 'ml-20'
								}`}
							>
								<div className='text-center'>
									<motion.div
										className='flex justify-center mb-6'
										whileHover={{
											scale: 1.1,
											rotate: 5,
											transition: { duration: 0.3 },
										}}
									>
										{item.icon}
									</motion.div>
									<h3 className='text-2xl font-bold mb-6 text-secondary leading-tight'>
										{item.title}
									</h3>
									<p className='text-gray-600 leading-relaxed text-lg'>
										{item.description}
									</p>
								</div>

								{/* Subtle gradient border */}
								<div className='absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-accent/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500'></div>
							</motion.div>

							{/* Enhanced Circle on timeline */}
							<motion.div
								initial={{ scale: 0, opacity: 0 }}
								animate={isInView ? { scale: 1, opacity: 1 } : {}}
								transition={{
									duration: 0.6,
									delay: 0.5 + i * 0.4 + 0.2,
									ease: 'easeOut',
								}}
								whileHover={{
									scale: 1.3,
									boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
									transition: { duration: 0.3 },
								}}
								className='absolute left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white font-bold text-2xl z-20 bg-gradient-to-r from-accent to-accent/80 backdrop-blur-sm'
							>
								<motion.span
									initial={{ scale: 0 }}
									animate={isInView ? { scale: 1 } : {}}
									transition={{
										duration: 0.4,
										delay: 0.5 + i * 0.4 + 0.3,
										ease: 'easeOut',
									}}
								>
									{item.step}
								</motion.span>
							</motion.div>
						</motion.div>
					))}
				</div>

				{/* Bottom CTA */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{
						duration: 0.8,
						delay: 0.5 + timelineData.length * 0.4 + 0.5,
						ease: 'easeOut',
					}}
					className='text-center mt-20'
				>
					<motion.button
						whileHover={{
							scale: 1.05,
							boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
							transition: { duration: 0.3, ease: 'easeOut' },
						}}
						whileTap={{ scale: 0.95 }}
						className='px-10 py-5 bg-gradient-to-r from-main to-secondary text-white rounded-3xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'
					>
						<span className='flex items-center justify-center gap-3'>
							{t('landing.steps.get_started')}
							<svg
								className='w-5 h-5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M13 7l5 5m0 0l-5 5m5-5H6'
								/>
							</svg>
						</span>
					</motion.button>
				</motion.div>
			</div>
		</section>
	)
}
