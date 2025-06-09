'use client'

import { CartButton } from '@/Components/Services/ServiceCart'
import { Suspense } from 'react'
import { LoadingSkeleton } from '@/Components/Skeletons'
import FlorageBackground from '@/Components/Landing/FlorageBackground'
import ServiceList from '@/Components/Services/ServiceList'
import SearchBar from '@/Components/Management/SearchBar'
import useInput from '@/Hooks/Form/useInput'

export default function Page() {
	const { ...search } = useInput('', 'text')
	return (
		<section className='relative min-h-screen  text-gray-900'>
			<div className='relative bg-general shadow-md overflow-hidden'>
				<div className='mx-auto px-6 py-4 flex items-center justify-between pt-20 '>
					<SearchBar value={search.value} handleSearch={search.onChange} />
					<div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-1/15'>
						<CartButton />
					</div>
				</div>
			</div>

			<div className=' max-w-7xl mx-auto px-6 py-8'>
				<h2 className='text-2xl font-bold text-gray-800 mb-6'>
					Dịch Vụ Nổi Bật
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-cols-max auto-rows-max'>
					<Suspense fallback={<LoadingSkeleton />}>
						<ServiceList />
					</Suspense>
				</div>
				<FlorageBackground />
			</div>
		</section>
	)
}

//
