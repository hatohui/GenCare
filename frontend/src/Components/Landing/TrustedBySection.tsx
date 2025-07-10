'use client'

import { motion } from 'motion/react'

const items = [
	{
		title: 'Hỗ trợ 24/7',
		desc: 'Kết nối bác sĩ mọi lúc, mọi nơi',
		icon: (
			<svg
				className='w-6 h-6'
				fill='none'
				stroke='currentColor'
				viewBox='0 0 24 24'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
				/>
			</svg>
		),
	},
	{
		title: (
			<span className='inline-flex items-center gap-1'>
				4.9
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					strokeWidth={1.5}
					stroke='currentColor'
					className='w-5 h-5 text-yellow-500 fill-yellow-500'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z'
					/>
				</svg>
			</span>
		),
		desc: 'Được đánh giá bởi hơn 5.000 bệnh nhân',
		icon: (
			<svg
				className='w-6 h-6'
				fill='none'
				stroke='currentColor'
				viewBox='0 0 24 24'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
				/>
			</svg>
		),
	},
	{
		title: 'Bác sĩ uy tín',
		desc: '100% bác sĩ được cấp phép & xác thực',
		icon: (
			<svg
				className='w-6 h-6'
				fill='none'
				stroke='currentColor'
				viewBox='0 0 24 24'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
				/>
			</svg>
		),
	},
	{
		title: 'Đặt lịch nhanh',
		desc: 'Gặp bác sĩ trong vòng 15 phút',
		icon: (
			<svg
				className='w-6 h-6'
				fill='none'
				stroke='currentColor'
				viewBox='0 0 24 24'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M13 10V3L4 14h7v7l9-11h-7z'
				/>
			</svg>
		),
	},
	{
		title: 'Linh hoạt & tiết kiệm',
		desc: 'Nhiều gói dịch vụ phù hợp nhu cầu',
		icon: (
			<svg
				className='w-6 h-6'
				fill='none'
				stroke='currentColor'
				viewBox='0 0 24 24'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
				/>
			</svg>
		),
	},
]

export default function TrustedBySection() {
	return (
		<section className='relative  py-12 bg-white text-center px-8 rounded-3xl mx-auto mt-[0px] z-20 shadow-2xl border border-gray-100/50'>
			{/* Background decoration */}
			<div className='absolute inset-0 opacity-5'>
				<motion.div
					animate={{
						scale: [1, 1.1, 1],
						opacity: [0.05, 0.1, 0.05],
					}}
					transition={{
						duration: 6,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
					className='absolute top-5 left-5 w-20 h-20 bg-main rounded-full blur-2xl'
				></motion.div>
				<motion.div
					animate={{
						scale: [1.1, 1, 1.1],
						opacity: [0.05, 0.1, 0.05],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
					className='absolute bottom-5 right-5 w-24 h-24 bg-secondary rounded-full blur-2xl'
				></motion.div>
			</div>

			<div className='relative z-10 max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-8 sm:gap-0 px-6 text-center'>
				{items.map((item, i) => (
					<motion.div
						key={i}
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
						whileHover={{
							y: -5,
							scale: 1.02,
							transition: { duration: 0.3, ease: 'easeOut' },
						}}
						className='group flex-1 border-l first:border-none px-6 py-4 relative'
					>
						{/* Icon */}
						<motion.div
							className='w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-accent to-accent/80 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300'
							whileHover={{
								scale: 1.1,
								rotate: 5,
								transition: { duration: 0.3 },
							}}
						>
							{item.icon}
						</motion.div>

						{/* Content */}
						<div>
							<h3 className='text-xl font-bold text-main mb-2 group-hover:text-secondary transition-colors duration-300'>
								{item.title}
							</h3>
							<p className='text-sm text-secondary leading-relaxed'>
								{item.desc}
							</p>
						</div>

						{/* Subtle border glow */}
						<div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 group-hover:w-16 transition-all duration-300'></div>
					</motion.div>
				))}
			</div>
		</section>
	)
}
