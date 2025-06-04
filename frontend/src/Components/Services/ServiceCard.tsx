import { motion } from 'motion/react'

export const ServiceCard = () => {
	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
			className='bg-white rounded-2xl shadow-md p-4'
		>
			<h3 className='text-xl font-semibold mb-2'>Dịch Vụ 1</h3>
			<p className='text-accent mb-2'>500.000 VNĐ</p>
			<p className='text-gray-600 mb-4'>Mô tả ngắn về dịch vụ.</p>
			<div className='flex items-center justify-end mb-4 gap-4'>
				<button className='bg-general text-black px-4 py-2 rounded-full font-medium text-sm'>
					Detail
				</button>
				<button className='bg-accent text-white px-4 py-2 rounded-full font-medium text-sm'>
					Booking
				</button>
			</div>
		</motion.div>
	)
}
