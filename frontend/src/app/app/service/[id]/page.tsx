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
		return <div className='center-all h-screen'>Loading...</div>
	}

	if (error) {
		return (
			<div className='flex flex-col items-center justify-center min-h-[200px] space-y-4'>
				<div>Failed to load service details</div>{' '}
				<button
					onClick={() => router.back()}
					className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
				>
					Go Back
				</button>
			</div>
		)
	}

	const serviceData = service || {
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
