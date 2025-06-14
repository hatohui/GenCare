'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

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
					transition={{ duration: 0.6 }}
					className='text-4xl font-bold mb-12 text-secondary '
				>
					Khách Hàng Nói Gì
				</motion.h2>
				<motion.div style={{ x }} className='flex gap-8 p-6 '>
					{Array(5)
						.fill(0)
						.map((_, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, scale: 0.5 }}
								whileInView={{ opacity: 1, scale: 1 }}
								whileHover={{ scale: 1.05 }}
								className=' bg-white p-6 min-w-[300px] rounded-xl shadow hover:shadow-xl transition flex flex-col items-center'
							>
								<div className='w-16 h-16 mb-4 bg-pink-200 rounded-full flex items-center justify-center text-2xl'>
									😊
								</div>
								<p className='text-gray-600 text-sm mb-2'>
									&quot;Dịch vụ tuyệt vời! Tôi cảm thấy được lắng nghe và hỗ
									trợ.&quot;
								</p>
								<div className='font-bold'>Khách hàng {i + 1}</div>
							</motion.div>
						))}
				</motion.div>
			</motion.div>
		</section>
	)
}
