'use client'

import React, { useEffect, useState } from 'react'
// import PurchaseItem from './PurchaseItem'
import Pagination from '../Management/Pagination'
import { useViewPurchaseById } from '@/Services/book-service'
import { useSearchParams } from 'next/navigation'

const PurchaseList = ({ id }: { id: string }) => {
	const searchParams = useSearchParams()
	const [search, setSearch] = useState<string>('')

	const { data, isError, isFetching } = useViewPurchaseById(id, search)

	useEffect(() => {
		setSearch(searchParams.get('search') || '')
	}, [searchParams])

	return (
		<div className='h-screen'>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-cols-max auto-rows-max'>
				{data?.map((purchase, index) => (
					<div key={index}>asd</div>
					// <PurchaseItem key={index} purchase={purchase} />
				))}
			</div>
		</div>
	)
}

export default PurchaseList
