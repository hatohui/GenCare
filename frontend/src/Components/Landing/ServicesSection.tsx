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
		<section className='snap-start text-center relative h-fit overflow-hidden pb-20'>
			<div className='relative z-10 max-w-7xl mx-auto px-8'>
				<motion.h2
					{...fadeInUp}
					className='text-3xl md:text-5xl pt-20 font-bold mb-10 text-main leading-tight'
				>
					{t('landing.ourServices')}{' '}
					<span className='text-accent font-bold'>
						{t('landing.ourServicesEmphasis')}
					</span>
				</motion.h2>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6'>
					{data?.services.map((service, index) => (
						<motion.div
							key={service.id}
							variants={cardVariants}
							initial='initial'
							whileInView='whileInView'
							whileHover='whileHover'
							transition={{ delay: index * 0.1 }}
							className='group relative bg-white p-5 rounded-xl shadow-md hover:shadow-lg border border-general flex flex-col justify-between overflow-hidden min-h-[220px]'
						>
							<div className='relative z-10 mb-3 flex flex-col items-center'>
								{/* Service Image/Icon */}
								<motion.div
									variants={iconVariants}
									className='w-12 h-12 mb-2 rounded-lg bg-general flex items-center justify-center shadow-sm overflow-hidden border border-general'
								>
									{service.imageUrls && service.imageUrls.length > 0 ? (
										<img
											src={service.imageUrls[0].url}
											alt={service.name}
											className='w-full h-full object-cover rounded-lg border border-general'
										/>
									) : (
										<span className='text-lg'>🚑</span>
									)}
								</motion.div>
								<h3 className='text-xs font-semibold mb-1 text-main group-hover:text-accent transition-colors duration-500 leading-tight'>
									{service.name}
								</h3>
								<p className='text-text text-[11px] leading-relaxed line-clamp-2'>
									{service.description}
								</p>
							</div>

							<motion.button
								variants={buttonVariants}
								whileHover='whileHover'
								whileTap='whileTap'
								className='self-center px-4 py-1.5 bg-main rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 mt-2'
							>
								<span className='flex items-center justify-center gap-2'>
									{t('landing.viewDetails')}
									<svg
										className='w-3 h-3'
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
						className='px-8 py-4 bg-main text-white rounded-2xl font-semibold text-base shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5'
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
