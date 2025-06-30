'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import BlogSection from './Blogsection'

import Image from 'next/image'
import Testimonials from '@/Constants/Testomonial'

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

	const x = useTransform(scrollYProgress, [0, 1.2], ['50%', '-95%'])

	//const bgColor = useTransform(scrollYProgress, [0, 1], ['#ffffff', '#f1f1f1']) // From white to general
	const image = useTransform(scrollYProgress, [0, 1], ['-20%', '20%'])

	return (
		<section
			ref={targetRef}
			className='relative py-20 h-[500vh] flex-col items-center justify-center text-center bg-white  '
		>
			<BlogSection />
			<motion.div
				style={{}}
				className='sticky top-0 translate-y-12 h-screen overflow-hidden flex flex-col items-center '
			>
				<motion.h2
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					className='text-4xl font-bold mb-12 text-secondary'
				>
					Khách Hàng Nói Gì
				</motion.h2>

				<motion.div style={{ x }} className='flex gap-5 p-6 '>
					<div className='min-w-[300px] flex items-end'>
						<p className='text-lg text-gray-600 mb-12 w-[250px]'>
							GenCare provided exceptional service and care. The staff is
							friendly and professional. Highly recommended!
						</p>
					</div>
					{Testimonials.map((item, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 50, filter: 'brightness(0.8)' }}
							whileHover={{ scale: 1.05, filter: 'brightness(1)' }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className='relative bg-white w-[300px] h-[400px] rounded shadow hover:shadow-xl flex flex-col items-center justify-between overflow-hidden'
						>
							{/* Name overlay */}
							<div className='absolute top-4 left-4 z-20'>
								<p className='text-2xl font-bold text-white drop-shadow-lg'>
									{item.name}
								</p>
							</div>

							{/* Background image */}
							<motion.div
								style={{ x: image }}
								className='absolute w-[500px] z-0'
							>
								<Image
									src={item.avatar}
									alt={`Portrait of ${item.name}`}
									className='object-cover h-[400px]'
									width={500}
									height={500}
								/>
							</motion.div>

							{/* Testimonial text overlay */}
							<div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 z-10'>
								<p className='text-white text-lg leading-relaxed'>
									&quot; {item.content} &quot;
								</p>
							</div>
						</motion.div>
					))}
				</motion.div>
			</motion.div>
		</section>
	)
}
