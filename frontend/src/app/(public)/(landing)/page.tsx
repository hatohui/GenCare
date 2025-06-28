'use client'

import FooterSection from '@/Components/Landing/Footer'
import LandingPart from '@/Components/Landing/LandingPart'
import ServicesSection from '@/Components/Landing/ServicesSection'
import ProcessSteps from '@/Components/Landing/StepByStepSection'
import TestimonialsSection from '@/Components/Landing/TestomonialSection'
import TrustedBySection from '@/Components/Landing/TrustedBySection'
import WhyChooseUsSection from '@/Components/Landing/WhyChooseUs'
import { motion } from 'motion/react'

const Page = () => {
	return (
		<main className='relative scroll-bar'>
			<LandingPart />
			<TrustedBySection />
			<WhyChooseUsSection />
			<ServicesSection />
			{/* <BlogSection /> */}
			<TestimonialsSection />
			<div className='abosolute -translate-y-[750px] z-10  '>
				<motion.div
					initial={{ filter: 'blur(0px)' }}
					whileInView={{ filter: 'blur(2px)' }}
					className=''
				></motion.div>
				<ProcessSteps />
			</div>
			<FooterSection />
		</main>
	)
}

export default Page
