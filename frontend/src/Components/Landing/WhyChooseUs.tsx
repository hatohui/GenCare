'use client'

import { motion } from 'motion/react'
import { useLocale } from '../../Hooks/useLocale'
import { fadeInUp, cardVariants, iconVariants } from '../../Utils/animations'

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
		<section className='py-24 pt-[15%] relative overflow-hidden pb-40'>
			<div className='bg-gradient-to-b from-main to-secondary -z-20 absolute inset-0'></div>
			<div className='relative z-10 max-w-7xl mx-auto px-8'>
				<motion.div {...fadeInUp} className='text-center mb-20'>
					<h2 className='text-5xl md:text-5xl font-bold mb-6 text-general leading-tight'>
						{t('landing.whyChooseUs')}{' '}
						<span className='text-accent font-bold'>
							{t('landing.whyChooseUsEmphasis')}
						</span>
					</h2>
					<p className='text-lg text-general max-w-3xl mx-auto leading-relaxed'>
						{t('landing.whyChooseUsDescription')}
					</p>
				</motion.div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
					{items.map((item, i) => (
						<motion.div
							key={i}
							variants={cardVariants}
							initial='initial'
							whileInView='whileInView'
							whileHover='whileHover'
							transition={{ delay: i * 0.1 }}
							className='group relative bg-white rounded-3xl shadow-lg border border-gray-100/70 hover:border-accent/70 transition-all duration-150 overflow-hidden'
						>
							<div className='relative px-6 py-12 flex flex-col items-center bg-gradient-to-br from-white via-gray-50 to-white'>
								<motion.div
									variants={iconVariants}
									className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white mb-8 mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-400`}
								>
									{item.icon}
								</motion.div>

								{/* Enhanced Content */}
								<div className='text-center'>
									<h3 className='text-lg font-semibold mb-3 text-secondary group-hover:text-main transition-colors duration-150 leading-tight drop-shadow-sm'>
										{item.title}
									</h3>
									<p className='text-gray-600 leading-relaxed text-sm mb-2'>
										{item.description}
									</p>
								</div>
							</div>
							{/* Decorative accent bar on hover */}
							<div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-150'></div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}

export default WhyChooseUsSection
