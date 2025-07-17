'use client'

import ServiceDetail from '@/Components/Services/ServiceDetail'
import { useServiceById } from '@/Services/service-services'
import { use } from 'react'
import { useRouter } from 'next/navigation'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
	const router = useRouter()

	const { id } = use(params)

	const { data: service, isLoading, error } = useServiceById(id)

	if (isLoading) {
		return <div>Loading...</div>
	}

	if (error) {
		router.back()
		return <div>loading error</div>
	}

	const serviceData = {
		id: service?.id || '',
		name: service?.name || '',
		description: service?.description || '',
		price: service?.price || 0,
		imageUrls: service?.imageUrls || [],
		createdAt: service?.createdAt || null,
		updatedAt: service?.updatedAt || null,
		createdBy: service?.createdBy || null,
	}

	return (
		<main className='max-h-screen bg-[#F7F7F7] text-gray-900'>
			<div className='h-20 shadow-neutral-500' />
			<ServiceDetail {...serviceData} />
		</main>
	)
}
