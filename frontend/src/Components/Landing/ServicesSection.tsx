'use client'

import { useServiceByPage } from '@/Services/service-services'
import { motion } from 'motion/react'
import { LoadingSkeleton } from '../Skeletons'
import { useLocale } from '../../Hooks/useLocale'
import {
	fadeInUp,
	cardVariants,
	iconVariants,
	buttonVariants,
	backgroundGlow,
} from '../../Utils/animations'

export default function ServicesSection() {
	const { data, isLoading } = useServiceByPage(1, 6, true, '')
	const { t } = useLocale()

	if (isLoading) return <LoadingSkeleton />

	return (
		<section className='snap-start py-24 bg-gradient-to-b from-general to-main text-center relative overflow-hidden pb-40'>
			{/* Simplified Background decoration */}
			<div className='absolute inset-0 opacity-5'>
				<motion.div
					variants={backgroundGlow}
					animate='animate'
					className='absolute top-20 left-10 w-40 h-40 bg-white rounded-full blur-3xl'
				></motion.div>
			</div>

			<div className='relative z-10 max-w-7xl mx-auto px-8'>
				<motion.h2
					{...fadeInUp}
					className='text-5xl md:text-6xl font-bold mb-16 text-white leading-tight'
				>
					{t('landing.ourServices')}{' '}
					<span className='bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent'>
						{t('landing.ourServicesEmphasis')}
					</span>
				</motion.h2>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 py-4'>
					{data?.services.map((service, index) => (
						<motion.div
							key={service.id}
							variants={cardVariants}
							initial='initial'
							whileInView='whileInView'
							whileHover='whileHover'
							transition={{ delay: index * 0.1 }}
							className='group relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100/50 flex flex-col justify-between overflow-hidden'
						>
							{/* Subtle gradient overlay */}
							<div className='absolute inset-0 bg-gradient-to-br from-transparent via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

							<div className='relative z-10 mb-8'>
								<motion.div
									variants={iconVariants}
									className='w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-secondary to-main rounded-3xl flex items-center justify-center text-3xl shadow-lg group-hover:shadow-xl transition-all duration-500'
								>
									🚑
								</motion.div>
								<h3 className='text-xl font-bold mb-4 text-secondary group-hover:text-main transition-colors duration-500 leading-tight'>
									{service.name}
								</h3>
								<p className='text-gray-600 text-base leading-relaxed'>
									{service.description}
								</p>
							</div>

							<motion.button
								variants={buttonVariants}
								whileHover='whileHover'
								whileTap='whileTap'
								className='self-center px-8 py-4 bg-gradient-to-r from-accent to-accent/80 rounded-2xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'
							>
								<span className='flex items-center justify-center gap-2'>
									{t('landing.viewDetails')}
									<svg
										className='w-4 h-4'
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

							{/* Decorative border */}
							<div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-x-0 group-hover:scale-x-100'></div>
						</motion.div>
					))}
				</div>

				{/* Bottom CTA */}
				<motion.div
					{...fadeInUp}
					transition={{ delay: 0.3 }}
					className='text-center mt-16'
				>
					<motion.button
						variants={buttonVariants}
						whileHover='whileHover'
						whileTap='whileTap'
						className='px-10 py-5 bg-white text-main rounded-3xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'
					>
						<span className='flex items-center justify-center gap-3'>
							{t('landing.viewAllServices')}
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
