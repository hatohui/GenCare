'use client'

import BlogSection from '@/Components/Landing/Blogsection'
import LandingPart from '@/Components/Landing/LandingPart'
import PrivacySection from '@/Components/Landing/PrivacySectioni'
import ServicesSection from '@/Components/Landing/ServicesSection'
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
			<PrivacySection />
		</>
	)
}

export default Page
