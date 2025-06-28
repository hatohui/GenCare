'use client'

import SearchBar from '@/Components/Management/SearchBar'
import PurchaseList from '@/Components/staff/PurchaseList'
import clsx from 'clsx'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { use, useEffect } from 'react'

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = use(params)
	const searchParams = useSearchParams()
	const router = useRouter()

	const pathname = usePathname()

	useEffect(() => {
		const sort = searchParams.get('isPaid') || ''
		const search = searchParams.get('search') || ''

		console.log(sort, search)
	}, [searchParams]) // triggers when the URL params change

	if (!id) {
		router.push('/dashboard/accounts')
		return <div>Loading...</div>
	}

	return (
		<div className=' w-full '>
			<div className='w-full flex gap-3 px-1'>
				<div className='flex items-center px-5 gap-3 grow shadow-sm bg-general py-1 pt-2 round overflow-scroll'>
					<SearchBar className='mx-2' waitTime={1000} />
				</div>
			</div>
			<div className='flex items-center gap-2 mx-auto px-6 py-4'>
				<button
					className={clsx(
						'px-4 py-2 text-main border border-accent rounded-full hover:bg-accent/50 hover:text-white transition-colors',
						{
							'bg-accent text-white': searchParams.get('isPaid') === 'true',
						}
					)}
					onClick={() => {
						const params = new URLSearchParams(searchParams)
						if (!params.has('isPaid')) {
							params.set('isPaid', 'true')
						} else if (params.get('isPaid') === 'true') {
							params.set('isPaid', 'false')
						} else {
							params.set('isPaid', 'true')
						}

						router.push(`${pathname}?${params.toString()}`)
					}}
				>
					{searchParams.get('isPaid') === 'true'
						? 'Đã thanh toán'
						: 'Chưa thanh toán'}
				</button>
			</div>

			<PurchaseList id={id} />
		</div>
	)
}

export default Page
