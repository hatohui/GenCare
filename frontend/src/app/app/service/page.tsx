'use client'

import { BookingButton } from '@/Components/Services/ServiceCart'
import { useEffect } from 'react'
import FlorageBackground from '@/Components/Landing/FlorageBackground'

import SearchBar from '@/Components/Management/SearchBar'
import { useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import { SearchSVG } from '@/Components/SVGs'
import ItemCardHeader from '@/Components/Management/ItemCardHeader'
import ServiceList from '@/Components/app/services/ServiceList'

export default function Page() {
	const searchParams = useSearchParams()

	useEffect(() => {
		const sort = searchParams.get('orderByPrice') || ''
		const search = searchParams.get('search') || ''

		console.log(sort, search)
	}, [searchParams]) // triggers when the URL params change

	return (
		<section className='relative min-h-screen  text-gray-900'>
			<div className='relative bg-general shadow-md rounded-[30px] '>
				<div className='mx-auto px-6  flex items-center justify-around  '>
					<div className='relative w-full'>
						<SearchSVG className='absolute top-1/2 left-2 -translate-y-1/2 text-main z-10 size-7' />
						<SearchBar className='border-none backdrop-blur-2xl ml-15' />
					</div>
					<div className='mx-auto px-6 py-4 flex items-center justify-end flex-1/2'>
						<BookingButton />
					</div>
				</div>
			</div>

			<div className='flex items-center gap-2 mx-auto px-6 py-4'>
				<button
					className={clsx(
						'px-4 py-2 text-main border border-accent rounded-full hover:bg-accent/50 hover:text-white transition-colors',
						{
							'bg-accent text-white':
								searchParams.get('orderByPrice') === 'true',
						}
					)}
					onClick={() => {
						const params = new URLSearchParams(searchParams)
						if (params.has('orderByPrice')) {
							params.delete('orderByPrice')
						} else {
							params.set('orderByPrice', 'true')
						}
						window.location.search = params.toString()
					}}
				>
					Sắp xếp theo giá
				</button>
			</div>

			{/* <ItemCardHeader
				label='Tên dịch vụ'
				secondaryLabel='Miêu tả'
				fourthLabel='Giá'
				fifthLabel='Tác vụ'
			/> */}

			<div className=' max-w-7xl mx-auto px-6 py-8 overflow-scroll'>
				<ServiceList />
			</div>
		</section>
	)
}
