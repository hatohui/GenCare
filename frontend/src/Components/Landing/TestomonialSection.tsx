'use client'

import { motion } from 'framer-motion'

export default function TestimonialsSection() {
	return (
		<section className='snap-start py-20 bg-gradient-to-t from-main to-secondary text-center'>
			<motion.h2
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className='text-4xl font-bold mb-12'
			>
				Khách Hàng Nói Gì
			</motion.h2>
			<div className='max-w-6xl mx-auto flex gap-8 overflow-x-scroll no-scrollbar p-6 snap-x snap-mandatory'>
				{Array(5)
					.fill(0)
					.map((_, i) => (
						<motion.div
							key={i}
							whileHover={{ scale: 1.05 }}
							className='snap-center bg-white p-6 min-w-[300px] rounded-xl shadow hover:shadow-xl transition flex flex-col items-center'
						>
							<div className='w-16 h-16 mb-4 bg-pink-200 rounded-full flex items-center justify-center text-2xl'>
								😊
							</div>
							<p className='text-gray-600 text-sm mb-2'>
								"Dịch vụ tuyệt vời! Tôi cảm thấy được lắng nghe và hỗ trợ."
							</p>
							<div className='font-bold'>Khách hàng {i + 1}</div>
						</motion.div>
					))}
			</div>
		</section>
	)
}
