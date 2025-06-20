'use client'

import { useServiceByPage } from '@/Services/service-services'
import { motion } from 'motion/react'
import { LoadingSkeleton } from '../Skeletons'

export default function ServicesSection() {
	const { data, isLoading } = useServiceByPage(1, 6, true, '')

	if (isLoading) return <LoadingSkeleton />

	return (
		<section className='snap-start py-20 bg-gradient-to-b from-white to-main text-center'>
			<motion.h2
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className='text-4xl font-bold mb-12'
			>
				Dịch Vụ Của Chúng Tôi
			</motion.h2>
			<div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-2'>
				{data?.services.map(service => (
					<motion.div
						key={service.id}
						whileHover={{ scale: 1.05 }}
						className='bg-white p-6 rounded-xl shadow hover:shadow-xl transition border border-gray-100 flex flex-col justify-between'
					>
						<div className='mb-6'>
							<div className='w-16 h-16 mx-auto mb-4  bg-secondary rounded-full flex items-center justify-center text-2xl'>
								🚑
							</div>
							<h3 className='text-lg font-bold mb-2'>{service.name}</h3>
							<p className='text-gray-600 text-sm'>{service.description}</p>
						</div>
						<motion.button
							whileHover={{ scale: 1.1 }}
							className='self-center px-6 py-3 bg-accent rounded-full text-white font-bold'
						>
							Xem Chi Tiết
						</motion.button>
					</motion.div>
				))}
			</div>
		</section>
	)
}
