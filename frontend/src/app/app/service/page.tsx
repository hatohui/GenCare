'use client'

import { BookingButton } from '@/Components/Services/ServiceCart'
import { useEffect } from 'react'
import SearchBar from '@/Components/Management/SearchBar'
import { useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import { SearchSVG } from '@/Components/SVGs'
import ServiceList from '@/Components/app/services/ServiceList'
import { useRouter, usePathname } from 'next/navigation'

export default function Page() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()

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
						if (!params.has('orderByPrice')) {
							params.set('orderByPrice', 'true')
						} else if (params.get('orderByPrice') === 'true') {
							params.set('orderByPrice', 'false')
						} else {
							params.delete('orderByPrice')
						}

						router.push(`${pathname}?${params.toString()}`)
					}}
				>
					{searchParams.get('orderByPrice') === 'true'
						? 'Giá tăng dần ↑'
						: searchParams.get('orderByPrice') === 'false'
						? 'Giá giảm dần ↓'
						: 'Sắp xếp giá'}
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
