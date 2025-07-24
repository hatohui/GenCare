'use client'

import FooterSection from '@/Components/Landing/Footer'
import LandingPart from '@/Components/Landing/LandingPart'
import ServicesSection from '@/Components/Landing/ServicesSection'
import ProcessSteps from '@/Components/Landing/StepByStepSection'
import TestimonialsSection from '@/Components/Landing/TestomonialSection'
import TrustedBySection from '@/Components/Landing/TrustedBySection'
import WhyChooseUsSection from '@/Components/Landing/WhyChooseUs'
import BackToTop from '@/Components/Landing/BackToTop'
import FlorageBackground from '@/Components/Landing/FlorageBackground'

const Page = () => {
	return (
		<main className='relative space-y-10'>
			<LandingPart />
			<TrustedBySection />
			<WhyChooseUsSection />
			<ServicesSection />
			{/* <BlogSection /> */}
			<TestimonialsSection />
			<div className='abosolute -translate-y-[750px] z-10 h-0  '>
				<ProcessSteps />
			</div>
			<div className='abosolute translate-y-[1200px] z-10  '>
				<FooterSection />
			</div>
			<BackToTop />
			<FlorageBackground />
		</main>
	)
}

export default Page
