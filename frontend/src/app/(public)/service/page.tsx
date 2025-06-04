'use client'

import FloatingLabelInput from '@/Components/Form/FloatingLabel'
import { ServiceCard } from '@/Components/Services/ServiceCard'
import useInput from '@/Hooks/Form/useInput'
import { useState } from 'react'

export default function ServicePage() {
	const { reset: resetSearch, ...search } = useInput('', 'text')
	return (
		<main className='min-h-screen bg-[#F7F7F7] text-gray-900'>
			<div className='bg-general shadow-md'>
				<div className='h-20' />
				<div className='mx-auto px-6 py-4 flex items-center justify-between'>
					<div className='px-6 py-4 flex items-center gap-4 w-full'>
						<FloatingLabelInput
							label='Tìm kiếm dịch vụ'
							id='search-service'
							autocomplete='off'
							{...search}
							className='w-full max-w-xl'
						/>
						<button className='rounded-xl bg-accent px-4 py-2 text-sm font-medium hover:bg-accent-hover transition-colors'>
							Tìm kiếm
						</button>
					</div>
					<div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
						<button className='bg-accent text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2'>
							Giỏ Hàng
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								stroke-width='1.5'
								stroke='currentColor'
								className='size-6'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			<div className='max-w-7xl mx-auto px-6 py-8'>
				<h2 className='text-2xl font-bold text-gray-800 mb-6'>
					Dịch Vụ Nổi Bật
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					<ServiceCard />
					<ServiceCard />
					<ServiceCard />
				</div>
				<div className='h-500 bg-general' />
			</div>
		</main>
	)
}
