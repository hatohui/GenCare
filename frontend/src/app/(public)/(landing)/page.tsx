'use client'

import BlogSection from '@/Components/Landing/Blogsection'
import FooterSection from '@/Components/Landing/Footer'
import LandingPart from '@/Components/Landing/LandingPart'
import ServicesSection from '@/Components/Landing/ServicesSection'
import ProcessSteps from '@/Components/Landing/StepByStepSection'
import TestimonialsSection from '@/Components/Landing/TestomonialSection'
import TrustedBySection from '@/Components/Landing/TrustedBySection'
import WhyChooseUsSection from '@/Components/Landing/WhyChooseUs'

const Page = () => {
	return (
		<>
			<LandingPart />
			<TrustedBySection />
			<WhyChooseUsSection />
			<ServicesSection />
			<BlogSection />
			<TestimonialsSection />
			<div className='abosolute w-full top-1'>
				<ProcessSteps />
			</div>
			<FooterSection />
		</>
	)
}

export default Page
