'use client'

import { motion } from 'motion/react'
import FlorageBackground from './FlorageBackground'

export default function WhyChooseUsSection() {
	return (
		<section className='pt-40 py-20 bg-white text-center'>
			<motion.h2
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className='text-4xl font-bold mb-12 text-secondary'
			>
				Vì Sao Chọn Chúng Tôi?
			</motion.h2>
			<div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-2'>
				{['Chuyên Gia Y Tế', 'Bảo Mật Tối Đa', 'Dịch Vụ Tận Tâm'].map(
					(item, i) => (
						<motion.div
							key={i}
							whileHover={{ y: -8 }}
							className='bg-blue-50 p-8 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center text-center'
						>
							<div className='w-16 h-16  bg-blue-200 rounded-full flex items-center justify-center text-2xl'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									strokeWidth='1.5'
									stroke='currentColor'
									className='size-6 fill-accent text-accent'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z'
									/>
								</svg>
							</div>
							<h3 className='text-lg font-bold mb-2'>{item}</h3>
							<p className='text-gray-600 text-sm'>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
								aspernatur nobis.
							</p>
						</motion.div>
					)
				)}
			</div>
			<FlorageBackground />
		</section>
	)
}
