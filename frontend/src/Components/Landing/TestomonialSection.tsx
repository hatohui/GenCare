'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import BlogSection from './Blogsection'
import { useLocale } from '../../Hooks/useLocale'

import Image from 'next/image'
import useLocalizedTestimonials from '@/Constants/LocalizedTestimonials'
import { fadeInUp, textVariants } from '../../Utils/animations'

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
	const { t } = useLocale()
	const testimonials = useLocalizedTestimonials()

	const x = useTransform(scrollYProgress, [0, 1.2], ['50%', '-95%'])

	const testimonialVariants = {
		initial: { opacity: 0, y: 40 },
		whileInView: { opacity: 1, y: 0 },
		whileHover: {
			scale: 1.05,
			y: -8,
			filter: 'brightness(1)',
			transition: { duration: 0.3 },
		},
	}

	return (
		<section
			ref={targetRef}
			className='relative h-[600vh] flex-col items-center justify-center text-center pb-[1vh]'
		>
			<BlogSection />

			<motion.div className='sticky top-0 translate-y-12 h-screen overflow-hidden flex flex-col items-center'>
				<motion.h2
					{...fadeInUp}
					className='text-4xl md:text-5xl font-bold mb-16 text-secondary leading-tight'
				>
					{t('testimonial.title')}{' '}
					<span className='bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent'>
						{t('testimonial.titleEmphasis')}
					</span>
				</motion.h2>

				<motion.div style={{ x }} className='flex gap-12 p-8'>
					<div className='min-w-[350px] flex items-end'>
						<p className='text-xl text-gray-600 mb-16 w-[300px] leading-relaxed'>
							{t('testimonial.introText')}
						</p>
					</div>
					{testimonials.map((item, i) => (
						<motion.div
							key={i}
							variants={testimonialVariants}
							initial='initial'
							whileInView='whileInView'
							whileHover='whileHover'
							className='group relative bg-white w-sm rounded-3xl shadow-2xl hover:shadow-3xl flex flex-col items-center justify-between overflow-hidden border border-gray-100/50'
						>
							{/* Name overlay */}
							<div className='absolute top-6 left-6 z-20'>
								<motion.p
									variants={textVariants}
									className='text-2xl font-bold text-white drop-shadow-2xl'
								>
									{item.name}
								</motion.p>
							</div>

							{/* Background image */}
							<Image
								src={item.avatar}
								alt={`Portrait of ${item.name}`}
								className='object-cover h-[450px] select-none rounded-3xl'
								width={500}
								height={500}
							/>

							{/* Enhanced Testimonial text overlay */}
							<div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 z-10'>
								<motion.p
									variants={textVariants}
									className='text-white text-md leading-relaxed font-medium'
								>
									&quot; {item.content} &quot;
								</motion.p>
							</div>
						</motion.div>
					))}
				</motion.div>
			</motion.div>
		</section>
	)
}
