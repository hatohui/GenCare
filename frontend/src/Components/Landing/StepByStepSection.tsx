'use client'

import { motion } from 'motion/react'

export default function ProcessSteps() {
	return (
		<section className='snap-start py-20 bg-white text-center px-6'>
			<motion.h2
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className='text-4xl font-bold mb-12'
			>
				Quy Trình Kiểm Tra Sức Khỏe Tại GenCare
			</motion.h2>
			<div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6'>
				{[
					{
						step: '1',
						title: 'Đặt Lịch Hẹn',
						description:
							'Book an appointment via Website, Zalo, Facebook or Hotline 19001717.',
						icon: '/images/step1-icon.png', // Replace with your icon path
					},
					{
						step: '2',
						title: 'Nhận Kết Quả',
						description: 'Get test results via Zalo/SMS.',
						icon: '/images/step2-icon.png', // Replace with your icon path
					},
					{
						step: '3',
						title: 'Xem Kết Quả và Được Tư Vấn',
						description:
							'Have the doctor review test results and prescribe specialized treatment.',
						icon: '/images/step3-icon.png', // Replace with your icon path
					},
					{
						step: '4',
						title: 'Kiểm Tra Lại và Theo Dõi',
						description:
							'Retest and monitor health conditions with continuous tracking.',
						icon: '/images/step4-icon.png', // Replace with your icon path
					},
				].map((item, i) => (
					<motion.div
						key={i}
						whileHover={{ scale: 1.05 }}
						className='bg-blue-50 p-6 rounded-xl shadow hover:shadow-xl transition flex flex-col items-center text-center'
					>
						<div className='w-20 h-20 mb-4 bg-pink-200 rounded-full flex items-center justify-center text-3xl'>
							{item.step}
						</div>
						<h3 className='text-xl font-semibold mb-2'>{item.title}</h3>
						<p className='text-gray-600 text-sm mb-4'>{item.description}</p>
						<img
							src={item.icon}
							alt={`Icon for ${item.title}`}
							className='w-16 h-16 object-contain mb-4'
						/>
					</motion.div>
				))}
			</div>
		</section>
	)
}
