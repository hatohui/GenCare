'use client'

import ServiceDetail from '@/Components/Services/ServiceDetail'
import { useServiceById } from '@/Services/service-services'
import { use } from 'react'
export default function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params)
	const { data: service } = useServiceById(id)

	return (
		<main className='max-h-screen bg-[#F7F7F7] text-gray-900'>
			<div className='h-10 shadow-neutral-500' />
			<ServiceDetail />
		</main>
	)
}
