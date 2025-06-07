import { CartButton } from '@/Components/Services/ServiceCart'
import { Suspense } from 'react'

import { LoadingSkeleton } from '@/Components/Skeletons'
import FlorageBackground from '@/Components/Landing/FlorageBackground'
import ServiceList from '@/Components/Services/ServiceList'

export default function Page() {
	return (
		<main className='relative min-h-screen  text-gray-900'>
			<div className='bg-general shadow-md'>
				<div className='h-20' />
				<div className='mx-auto px-6 py-4 flex items-center justify-between'>
					{/* <ServiceSearch search={search} /> */}
					<div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
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
		</main>
	)
}
