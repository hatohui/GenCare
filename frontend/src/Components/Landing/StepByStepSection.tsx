'use client'

import { motion } from 'motion/react'

export default function ProcessSteps() {
	const timelineData = [
		{
			step: '1',
			title: 'Đặt Lịch Hẹn',
			description:
				'Đặt lịch hẹn qua Website, Zalo, Facebook hoặc Hotline 19001717.',
			icon: (
				<svg
					className='w-12 h-12 text-blue-500'
					fill='currentColor'
					viewBox='0 0 24 24'
				>
					<path d='M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z' />
				</svg>
			),
		},
		{
			step: '2',
			title: 'Nhận Kết Quả',
			description: 'Nhận kết quả xét nghiệm qua Zalo/SMS.',
			icon: (
				<svg
					className='w-12 h-12 text-green-500'
					fill='currentColor'
					viewBox='0 0 24 24'
				>
					<path d='M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z' />
					<path d='M9 12l2 2 4-4' />
				</svg>
			),
		},
		{
			step: '3',
			title: 'Xem Kết Quả và Được Tư Vấn',
			description:
				'Bác sĩ sẽ xem xét kết quả và đưa ra phác đồ điều trị chuyên biệt.',
			icon: (
				<svg
					className='w-12 h-12 text-purple-500'
					fill='currentColor'
					viewBox='0 0 24 24'
				>
					<path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
				</svg>
			),
		},
		{
			step: '4',
			title: 'Kiểm Tra Lại và Theo Dõi',
			description:
				'Tái khám và theo dõi tình trạng sức khỏe với hệ thống theo dõi liên tục.',
			icon: (
				<svg
					className='w-12 h-12 text-orange-500'
					fill='currentColor'
					viewBox='0 0 24 24'
				>
					<path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
					<path d='M12 6v6l4 2' />
				</svg>
			),
		},
	]

	return (
		<section className='py-20 bg-white'>
			<div className='max-w-6xl mx-auto px-6'>
				<motion.h2
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='text-4xl font-bold text-center mb-16 text-secondary'
				>
					Quy Trình Kiểm Tra Sức Khỏe Tại GenCare
				</motion.h2>

				<div className='relative min-h-[600px]'>
					{/* Timeline line */}
					<div className='absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 to-pink-500 h-full'></div>

					{/* Timeline items */}
					{timelineData.map((item, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: i * 0.2 }}
							className={`flex items-center mb-16 ${
								i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
							}`}
						>
							{/* Content card */}
							<motion.div
								whileHover={{ scale: 1.05 }}
								className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-80 ${
									i % 2 === 0 ? 'mr-16' : 'ml-16'
								}`}
							>
								<div className='text-center'>
									<div className='flex justify-center mb-4'>{item.icon}</div>
									<h3 className='text-2xl font-semibold mb-4 text-secondary'>
										{item.title}
									</h3>
									<p className='text-gray-600 leading-relaxed'>
										{item.description}
									</p>
								</div>
							</motion.div>

							{/* Circle on timeline */}
							<motion.div
								whileHover={{ scale: 1.2 }}
								className='w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-xl z-10 bg-gradient-to-r from-blue-500 to-pink-500 flex-shrink-0'
							>
								{item.step}
							</motion.div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
