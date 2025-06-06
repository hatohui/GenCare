'use client'

import { ServiceCard } from '@/Components/Services/ServiceCard'
import { CartButton } from '@/Components/Services/ServiceCart'
import { Suspense, useEffect, useState } from 'react'
import { samplePayload, useServiceByPage } from '@/Services/service-services'
import { GetServiceApiByPageResponse } from '@/Interfaces/Service/Schemas/service'
import { motion } from 'motion/react'
import { LoadingSkeleton } from '@/Components/Skeletons'
import FlorageBackground from '@/Components/Landing/FlorageBackground'

export default function Page() {
	const [services, setServices] = useState<GetServiceApiByPageResponse>({
		//sample datahere change later
		payload: samplePayload,
		page: 1,
		count: 0,
	})
	const { data: serviceData } = useServiceByPage(1, 6)

	useEffect(() => {
		if (serviceData?.payload) {
			setServices(serviceData)
		}
	}, [serviceData])

	return (
		<main className='relative min-h-screen  text-gray-900'>
			<div className='bg-general shadow-md'>
				<div className='h-20' />
				<div className='mx-auto px-6 py-4 flex items-center justify-between'>
					{/* <ServiceSearch search={search} /> */}
					<div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
						<CartButton />
					</div>
				</div>
			</div>

			<div className=' max-w-7xl mx-auto px-6 py-8'>
				<h2 className='text-2xl font-bold text-gray-800 mb-6'>
					Dịch Vụ Nổi Bật
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					<Suspense fallback={<LoadingSkeleton />}>
						{services?.payload.map((item, index) => (
							<motion.div
								key={item.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{
									delay: index * 0.15,
									duration: 0.5,
								}}
								className=' rounded-2xl p-2 duration-300'
							>
								<ServiceCard {...item} />
							</motion.div>
						))}
					</Suspense>
				</div>
				<FlorageBackground />
			</div>
		</main>
	)
}
