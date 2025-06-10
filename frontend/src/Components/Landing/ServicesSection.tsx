'use client'

import { motion } from 'framer-motion'

export default function ServicesSection() {
	return (
		<section className='snap-start py-20 bg-gradient-to-b from-white to-general text-center'>
			<motion.h2
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className='text-4xl font-bold mb-12'
			>
				Dịch Vụ Của Chúng Tôi
			</motion.h2>
			<div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-2'>
				{[
					'Kiểm Tra STI',
					'Tư Vấn Giới Tính',
					'Điều Trị Hormone',
					'Khám Sức Khỏe',
					'Hỗ Trợ Tâm Lý',
					'Sàng Lọc Bệnh',
				].map((service, i) => (
					<motion.div
						key={i}
						whileHover={{ scale: 1.05 }}
						className='bg-white p-6 rounded-xl shadow hover:shadow-xl transition border border-gray-100 flex flex-col justify-between'
					>
						<div className='mb-6'>
							<div className='w-16 h-16 mx-auto mb-4  bg-secondary rounded-full flex items-center justify-center text-2xl'>
								🚑
							</div>
							<h3 className='text-lg font-bold mb-2'>{service}</h3>
							<p className='text-gray-600 text-sm'>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
								aspernatur nobis.
							</p>
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
