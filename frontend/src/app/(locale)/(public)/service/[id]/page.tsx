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
		return (
			<main className='min-h-screen bg-gradient-to-br from-general via-white to-general pt-20'>
				<div className='max-w-6xl mx-auto px-6 py-8'>
					<div className='animate-pulse'>
						<div className='h-8 bg-gray-200 rounded w-1/4 mb-6'></div>
						<div className='h-4 bg-gray-200 rounded w-1/2 mb-8'></div>
						<div className='h-96 bg-gray-200 rounded'></div>
					</div>
				</div>
			</main>
		)
	}

	if (error) {
		return (
			<main className='min-h-screen bg-gradient-to-br from-general via-white to-general pt-20'>
				<div className='max-w-6xl mx-auto px-6 py-8'>
					<div className='text-center max-w-md mx-auto p-6'>
						<div className='text-red-500 text-6xl mb-4'>⚠️</div>
						<h3 className='text-xl font-semibold text-gray-800 mb-2'>
							Service not found
						</h3>
						<p className='text-gray-600 mb-4'>
							The service you&apos;re looking for doesn&apos;t exist or has been removed.
						</p>
						<button
							onClick={() => router.back()}
							className='bg-main hover:bg-main/90 text-white px-6 py-3 rounded-[30px] font-medium transition-colors'
						>
							Go Back
						</button>
					</div>
				</div>
			</main>
		)
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
		<main className='min-h-screen bg-gradient-to-br from-general via-white to-general pt-20'>
			<ServiceDetail {...serviceData} />
		</main>
	)
}
