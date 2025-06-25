'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

const Testimonials = [
	{
		name: 'Nguyễn Văn A',
		avatar:
			'https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=76&q=80',
		content:
			'Ứng dụng Health Care rất tiện lợi, giúp tôi theo dõi sức khỏe hàng ngày và đặt lịch khám dễ dàng.',
	},
	{
		name: 'Trần Thị B',
		avatar:
			'https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=76&q=80',
		content:
			'Tôi cảm thấy an tâm hơn khi sử dụng Health Care để theo dõi chu kỳ và lịch tiêm phòng cho con.',
	},
	{
		name: 'Lê Minh Cường',
		avatar:
			'https://images.unsplash.com/photo-1573497491208-6b1acb260507?ixlib=rb-4.0.3&auto=format&fit=crop&w=76&q=80',
		content:
			'Dịch vụ tư vấn trực tuyến rất nhanh chóng và chuyên nghiệp. Tôi đã được bác sĩ hỗ trợ kịp thời.',
	},
	{
		name: 'Phạm Quỳnh Anh',
		avatar:
			'https://images.unsplash.com/photo-1603415526960-f7e0328f63c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=76&q=80',
		content:
			'Ứng dụng có giao diện dễ sử dụng, phù hợp với cả người lớn tuổi trong gia đình tôi.',
	},
	{
		name: 'Hoàng Thanh Tùng',
		avatar:
			'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=76&q=80',
		content:
			'Tôi đánh giá cao tính năng theo dõi lịch sử khám bệnh và nhắc nhở dùng thuốc của Health Care.',
	},
	{
		name: 'Đinh Mai Hương',
		avatar:
			'https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=76&q=80',
		content:
			'Health Care giúp tôi đặt lịch tư vấn sản phụ khoa dễ dàng, không cần chờ đợi lâu tại bệnh viện.',
	},
]

/**
 * Section for testimonials. Scroll-based animation for each testimonial.
 * When scroll to the section, the background color will change from white to general.
 * Each testimonial will have its own animation when scroll to that testimonial.
 * The testimonial will scale up and fade in when scroll to it.
 * @returns The TestimonialsSection component
 */
export default function TestimonialsSection() {
	const targetRef = useRef<HTMLDivElement | null>(null)
	const { scrollYProgress } = useScroll({ target: targetRef })

	const x = useTransform(scrollYProgress, [0, 1.2], ['45%', '-95%'])

	const bgColor = useTransform(scrollYProgress, [0, 1], ['#ffffff', '#f1f1f1']) // From white to general

	return (
		<section
			ref={targetRef}
			className='relative py-20 h-[400vh] flex-col items-center justify-center text-center bg-white '
		>
			<motion.div
				style={{ backgroundColor: bgColor }}
				className='sticky top-1 h-screen overflow-hidden flex flex-col items-center justify-center'
			>
				<motion.h2
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					className='text-4xl font-bold mb-12 text-secondary'
				>
					Khách Hàng Nói Gì
				</motion.h2>
				<motion.div style={{ x }} className='flex gap-8 p-6 '>
					<div className='min-w-[300px] flex items-end'>
						<p className='text-lg text-gray-600 mb-12'>
							"GenCare provided exceptional service and care. The staff is
							friendly and professional. Highly recommended!"
						</p>
					</div>
					{Testimonials.map((item, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 50 }}
							whileHover={{ scale: 1.05 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ type: 'spring', duration: 0.6 }}
							className='bg-white p-6 min-w-[300px] h-[400px] rounded-xl shadow hover:shadow-xl transition flex flex-col items-center'
						>
							{item.avatar && (
								<img
									src={item.avatar}
									alt={`Picture of customer ${i + 1}`}
									className='w-16 h-16 mb-4 rounded-full object-cover'
								/>
							)}
							<p className='text-gray-600 text-sm mb-2'>
								&quot; {item.content} &quot;
							</p>
							<div className='font-bold'>Khách hàng {i + 1}</div>
						</motion.div>
					))}
				</motion.div>
			</motion.div>
		</section>
	)
}
