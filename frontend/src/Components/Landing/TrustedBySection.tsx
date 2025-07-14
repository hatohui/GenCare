'use client'

import { CheckCircle, Clock, DollarSign, Star, Zap } from 'lucide-react'
import { motion } from 'motion/react'

const items = [
	{
		title: 'Hỗ trợ 24/7',
		desc: 'Kết nối bác sĩ mọi lúc, mọi nơi',
		icon: <Clock className='w-6 h-6' />,
	},
	{
		title: (
			<span className='inline-flex items-center gap-1'>
				4.9
				<Star className='w-5 h-5 text-yellow-500 fill-yellow-500' />
			</span>
		),
		desc: 'Được đánh giá bởi hơn 5.000 bệnh nhân',
		icon: <Star className='w-6 h-6' />,
	},
	{
		title: 'Bác sĩ uy tín',
		desc: '100% bác sĩ được cấp phép & xác thực',
		icon: <CheckCircle className='w-6 h-6' />,
	},
	{
		title: 'Đặt lịch nhanh',
		desc: 'Gặp bác sĩ trong vòng 15 phút',
		icon: <Zap className='w-6 h-6' />,
	},
	{
		title: 'Linh hoạt & tiết kiệm',
		desc: 'Nhiều gói dịch vụ phù hợp nhu cầu',
		icon: <DollarSign className='w-6 h-6' />,
	},
]

export default function TrustedBySection() {
	return (
		<section className='relative md:absolute bg-white text-center px-8 pt-4 rounded-[30px] mx-auto md:max-w-6xl mt-[0px] z-20 shadow-2xl border border-gray-100/50 md:right-0 md:left-0 md:-translate-y-1/2'>
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
						className='group flex-1  md:border-l first:border-none px-6 py-4 relative'
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
