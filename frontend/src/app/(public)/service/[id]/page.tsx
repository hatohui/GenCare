'use client'

import ServiceDetail from '@/Components/Services/ServiceDetail'
import { useServiceById } from '@/Services/service-services'
import { use } from 'react'
import { samplePayload } from '@/Services/service-services'
export default function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params)
	const { data: service } = useServiceById(id)

	const serviceData = samplePayload.find(item => item.id === id) ||
		service || {
			id: '',
			name: '',
			description: '',
			price: 0,
		}

	return (
		<main className='max-h-screen bg-[#F7F7F7] text-gray-900'>
			<div className='h-20 shadow-neutral-500' />
			<ServiceDetail {...serviceData} />
		</main>
	)
}
