'use client'

import FloatingLabelInput from '@/Components/Form/FloatingLabel'
import { ServiceCard } from '@/Components/Services/ServiceCard'
import { CartButton } from '@/Components/Services/ServiceCart'
import ServiceSearch from '@/Components/Services/ServiceSearch'
import useInput from '@/Hooks/Form/useInput'
import { useEffect, useState } from 'react'
import { array } from 'zod/v4'
import { samplePayload, useServiceByPage } from '@/Services/service-services'
import { GetServiceApiByPageResponse } from '@/Interfaces/Service/Schemas/service'

export default function Page() {
	const { ...search } = useInput('', 'text')
	const [services, setServices] = useState<GetServiceApiByPageResponse>({
		//sample datahere change later
		payload: samplePayload,
		page: 1,
		count: 0,
	})
	const { data: serviceDatam } = useServiceByPage(1, 2)

	useEffect(() => {
		if (serviceDatam?.payload) {
			setServices(serviceDatam)
		}
	}, [serviceDatam])

	return (
		<main className='min-h-screen bg-[#F7F7F7] text-gray-900'>
			<div className='bg-general shadow-md'>
				<div className='h-20' />
				<div className='mx-auto px-6 py-4 flex items-center justify-between'>
					{/* <ServiceSearch search={search} /> */}
					<div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
						<CartButton />
					</div>
				</div>
			</div>

			<div className='max-w-7xl mx-auto px-6 py-8'>
				<h2 className='text-2xl font-bold text-gray-800 mb-6'>
					Dịch Vụ Nổi Bật
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{services?.payload.map(item => (
						<ServiceCard key={item.id} {...item} />
					))}
				</div>
				<div className='h-500 bg-general' />
			</div>
		</main>
	)
}
