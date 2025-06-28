'use client'

import { motion } from 'motion/react'

const items = [
	{
		title: 'Hỗ trợ 24/7',
		desc: 'Kết nối bác sĩ mọi lúc, mọi nơi',
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
						d='M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z'
					/>
				</svg>
			</span>
		),
		desc: 'Được đánh giá bởi hơn 5.000 bệnh nhân',
	},
	{
		title: 'Bác sĩ uy tín',
		desc: '100% bác sĩ được cấp phép & xác thực',
	},
	{
		title: 'Đặt lịch nhanh',
		desc: 'Gặp bác sĩ trong vòng 15 phút',
	},
	{
		title: 'Linh hoạt & tiết kiệm',
		desc: 'Nhiều gói dịch vụ phù hợp nhu cầu',
	},
]

export default function TrustedBySection() {
	return (
		<section className='relative md:absolute py-10 bg-gradient-to-b from-white to-general text-center px-6 rounded-[30px] mx-auto md:max-w-7xl md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 shadow-2xl'>
			<div className='max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-0 px-6 text-center'>
				{items.map((item, i) => (
					<motion.div
						key={i}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: i * 0.1 }}
						className='flex-1 border-l first:border-none px-4'
					>
						<h3 className='text-lg font-semibold text-main'>{item.title}</h3>
						<p className='text-sm text-secondary mt-1'>{item.desc}</p>
					</motion.div>
				))}
			</div>
		</section>
	)
}
