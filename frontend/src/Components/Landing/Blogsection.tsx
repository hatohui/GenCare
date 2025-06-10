'use client'

import { motion } from 'framer-motion'

export default function BlogSection() {
	return (
		<section className='snap-start py-20 bg-white text-center'>
			<motion.h2
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className='text-4xl font-bold mb-12'
			>
				Kiến Thức Về Sức Khỏe Giới Tính
			</motion.h2>
			<div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-3'>
				{Array(3)
					.fill(0)
					.map((_, i) => (
						<motion.div
							key={i}
							whileHover={{ scale: 1.05 }}
							className='bg-blue-50 p-6 rounded-xl shadow hover:shadow-xl transition border border-gray-100 flex flex-col justify-between'
						>
							<h3 className='text-lg font-bold mb-2'>Bài Viết {i + 1}</h3>
							<p className='text-gray-600 text-sm mb-4'>
								Lorem ipsum dolor sit amet, consectetur adipisicing elit.
								Voluptatem, ipsa.
							</p>
							<motion.button
								whileHover={{ scale: 1.1 }}
								className='self-center px-6 py-3 bg-accent rounded-full text-white font-bold'
							>
								Đọc Thêm
							</motion.button>
						</motion.div>
					))}
			</div>
		</section>
	)
}
