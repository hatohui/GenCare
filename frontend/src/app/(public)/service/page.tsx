'use client'

import FloatingLabelInput from '@/Components/Form/FloatingLabel'
import useInput from '@/Hooks/Form/useInput'
import { useState } from 'react'

export default function ServicePage() {
	const { reset: resetSearch, ...search } = useInput('', 'text')
	return (
		<main className='min-h-screen bg-[#F7F7F7] text-gray-900'>
			<div className='bg-general shadow-md'>
				<div className='h-25' />
				<div className=' mx-auto px-6 py-4 flex items-center justify-between'>
					<div className='mx-auto px-6 py-4 flex items-center gap-4'>
						<FloatingLabelInput
							label='Tìm kiếm dịch vụ'
							id='search-service'
							autocomplete='off'
							{...search}
							className='w-full max-w-md'
						/>
						<button className='rounded-xl bg-gray-200 px-4 py-2 text-sm font-medium'>
							Tìm kiếm
						</button>
					</div>
					<div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
						<button className='bg-accent text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2'>
							Giỏ Hàng 🛒
						</button>
					</div>
				</div>
			</div>

			<div className='max-w-7xl mx-auto px-6 py-8'>
				<h2 className='text-2xl font-bold text-gray-800 mb-6'>
					Dịch Vụ Nổi Bật
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'></div>
			</div>
		</main>
	)
}
