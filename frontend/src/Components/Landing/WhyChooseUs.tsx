'use client'

import { motion } from 'motion/react'
import FlorageBackground from './FlorageBackground'
import { useLocale } from '../../Hooks/useLocale'
import {
	fadeInUp,
	cardVariants,
	iconVariants,
	buttonVariants,
	backgroundGlow,
} from '../../Utils/animations'

const WhyChooseUsSection = () => {
	const { t } = useLocale()

	const items = [
		{
			title: t('landing.experts.title'),
			description: t('landing.experts.description'),
			icon: (
				<svg
					className='w-8 h-8'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
					/>
				</svg>
			),
			color: 'from-blue-500 to-cyan-500',
		},
		{
			title: t('landing.security.title'),
			description: t('landing.security.description'),
			icon: (
				<svg
					className='w-8 h-8'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
					/>
				</svg>
			),
			color: 'from-green-500 to-emerald-500',
		},
		{
			title: t('landing.service.title'),
			description: t('landing.service.description'),
			icon: (
				<svg
					className='w-8 h-8'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
					/>
				</svg>
			),
			color: 'from-pink-500 to-rose-500',
		},
	]

	return (
		<section className='py-24 pt-40 bg-gradient-to-b from-white to-general relative overflow-hidden pb-40'>
			{/* Simplified Background decoration */}
			<div className='absolute inset-0 opacity-10'>
				<motion.div
					variants={backgroundGlow}
					animate='animate'
					className='absolute top-20 left-10 w-40 h-40 bg-main rounded-full blur-3xl'
				></motion.div>
				<motion.div
					variants={backgroundGlow}
					animate='animate'
					transition={{ duration: 8 }}
					className='absolute bottom-20 right-10 w-48 h-48 bg-secondary rounded-full blur-3xl'
				></motion.div>
			</div>

			<div className='relative z-10 max-w-7xl mx-auto px-8'>
				<motion.div {...fadeInUp} className='text-center mb-20'>
					<h2 className='text-5xl md:text-6xl font-bold mb-8 text-secondary leading-tight'>
						{t('landing.whyChooseUs')}{' '}
						<span className='bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent'>
							{t('landing.whyChooseUsEmphasis')}
						</span>
					</h2>
					<p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
						{t('landing.whyChooseUsDescription')}
					</p>
				</motion.div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
					{items.map((item, i) => (
						<motion.div
							key={i}
							variants={cardVariants}
							initial='initial'
							whileInView='whileInView'
							whileHover='whileHover'
							transition={{ delay: i * 0.1 }}
							className='group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100/50'
						>
							{/* Enhanced Gradient overlay on hover */}
							<div className='absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-15 transition-opacity duration-500 from-main to-secondary'></div>

							{/* Subtle border glow effect */}
							<div className='absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

							<div className='relative p-10'>
								{/* Enhanced Icon container */}
								<motion.div
									variants={iconVariants}
									className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white mb-8 mx-auto shadow-2xl group-hover:shadow-3xl transition-all duration-500`}
								>
									{item.icon}
								</motion.div>

								{/* Enhanced Content */}
								<div className='text-center'>
									<h3 className='text-2xl font-bold mb-6 text-secondary group-hover:text-main transition-colors duration-500 leading-tight'>
										{item.title}
									</h3>
									<p className='text-gray-600 leading-relaxed text-lg'>
										{item.description}
									</p>
								</div>

								{/* Enhanced Decorative element */}
								<div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-x-0 group-hover:scale-x-100'></div>
							</div>
						</motion.div>
					))}
				</div>

				{/* Enhanced Bottom CTA */}
				<motion.div
					{...fadeInUp}
					transition={{ delay: 0.4 }}
					className='text-center mt-20'
				>
					<motion.button
						variants={buttonVariants}
						whileHover='whileHover'
						whileTap='whileTap'
						className='px-10 py-5 bg-gradient-to-r from-main to-secondary text-white rounded-3xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'
					>
						<span className='flex items-center justify-center gap-3'>
							{t('landing.learnMore')}
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

			<FlorageBackground />
		</section>
	)
}

export default WhyChooseUsSection
