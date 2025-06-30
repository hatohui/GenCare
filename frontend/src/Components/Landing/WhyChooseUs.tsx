'use client'

import { motion } from 'motion/react'
import FlorageBackground from './FlorageBackground'

const items = [
	{
		title: 'Chuyên Gia Y Tế',
		description:
			'Đội ngũ chuyên gia y tế hàng đầu với nhiều năm kinh nghiệm trong lĩnh vực chăm sóc sức khỏe.',
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
		title: 'Bảo Mật Tối Đa',
		description:
			'Cam kết bảo mật thông tin cá nhân của bạn ở mức cao nhất với công nghệ mã hóa tiên tiến.',
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
		title: 'Dịch Vụ Tận Tâm',
		description:
			'Dịch vụ khách hàng chu đáo, tận tâm hỗ trợ 24/7 với đội ngũ nhân viên chuyên nghiệp.',
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

export default function WhyChooseUsSection() {
	return (
		<section className='py-20 pt-36 bg-gradient-to-b from-white to-general relative overflow-hidden'>
			{/* Background decoration */}
			<div className='absolute inset-0 opacity-5'>
				<div className='absolute top-20 left-10 w-32 h-32 bg-main rounded-full blur-3xl'></div>
				<div className='absolute bottom-20 right-10 w-40 h-40 bg-secondary rounded-full blur-3xl'></div>
				<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent rounded-full blur-3xl'></div>
			</div>

			<div className='relative z-10 max-w-7xl mx-auto px-6'>
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='text-center mb-16'
				>
					<h2 className='text-4xl md:text-5xl font-bold mb-6 text-secondary'>
						Vì Sao Chọn{' '}
						<span className='bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent'>
							Chúng Tôi?
						</span>
					</h2>
					<p className='text-lg text-gray-600 max-w-2xl mx-auto'>
						Chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe chất lượng cao
						với những giá trị cốt lõi
					</p>
				</motion.div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					{items.map((item, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: i * 0.2 }}
							whileHover={{ y: -10, scale: 1.02 }}
							className='group relative bg-white rounded-[30px] shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden'
						>
							{/* Gradient overlay on hover */}
							<div className='absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 from-main to-secondary'></div>

							<div className='relative p-8'>
								{/* Icon container */}
								<motion.div
									whileHover={{ rotate: 360 }}
									transition={{ duration: 0.6 }}
									className={`w-16 h-16 rounded-[30px] bg-gradient-to-r ${item.color} flex items-center justify-center text-white mb-6 mx-auto shadow-lg`}
								>
									{item.icon}
								</motion.div>

								{/* Content */}
								<div className='text-center'>
									<h3 className='text-xl font-bold mb-4 text-secondary group-hover:text-main transition-colors duration-300'>
										{item.title}
									</h3>
									<p className='text-gray-600 leading-relaxed'>
										{item.description}
									</p>
								</div>

								{/* Decorative element */}
								<div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
							</div>
						</motion.div>
					))}
				</div>

				{/* Bottom CTA */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.6 }}
					className='text-center mt-16'
				>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className='px-8 py-4 bg-gradient-to-r from-main to-secondary text-white rounded-[30px] font-semibold hover:shadow-lg transition-all duration-300'
					>
						Tìm Hiểu Thêm
					</motion.button>
				</motion.div>
			</div>

			<FlorageBackground />
		</section>
	)
}
