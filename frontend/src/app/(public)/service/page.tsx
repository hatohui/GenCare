'use client'

import FloatingLabelInput from '@/Components/Form/FloatingLabel'
import { ServiceCard } from '@/Components/Services/ServiceCard'
import { CartButton } from '@/Components/Services/ServiceCart'
import ServiceSearch from '@/Components/Services/ServiceSearch'
import useInput from '@/Hooks/Form/useInput'
import { useState } from 'react'
import { array } from 'zod/v4'

export default function Page() {
	const { ...search } = useInput('', 'text')
	return (
		<main className='min-h-screen bg-[#F7F7F7] text-gray-900'>
			<div className='bg-general shadow-md'>
				<div className='h-20' />
				<div className='mx-auto px-6 py-4 flex items-center justify-between'>
					<ServiceSearch search={search} />
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
					{[1, 2, 3, 4, 5, 6].map(item => (
						<ServiceCard key={item} />
					))}
				</div>
				<div className='h-500 bg-general' />
			</div>
		</main>
	)
}
