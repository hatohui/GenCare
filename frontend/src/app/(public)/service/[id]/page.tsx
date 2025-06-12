'use client'

import ServiceDetail from '@/Components/Services/ServiceDetail'
import { useServiceById } from '@/Services/service-services'
import { use } from 'react'
import { samplePayload } from '@/Services/service-services'
import { useRouter } from 'next/navigation'
export default function Page({ params }: { params: Promise<{ id: string }> }) {
	const router = useRouter()
	const { id } = use(params)
	const { data: service, isLoading, error } = useServiceById(id)
	if (isLoading) {
		return <div>Loading...</div>
	}

	if (error) {
		return router.back()
	}

	const serviceData = service ||
		samplePayload.find(item => item.id === id) || {
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
