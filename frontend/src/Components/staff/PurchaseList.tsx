'use client'

import React, { useEffect, useState } from 'react'
import { useViewPurchaseById } from '@/Services/book-service'
import { useSearchParams } from 'next/navigation'
import PurchaseItem from './PurchaseItem'

const PurchaseList = ({ id }: { id: string }) => {
	const searchParams = useSearchParams()
	const [search, setSearch] = useState<string>('')
	const [isPaid, setIsPaid] = useState<boolean | null>(null)

	const { data, error, isFetching } = useViewPurchaseById(id, search, isPaid)

	useEffect(() => {
		setSearch(searchParams.get('search') || '')
		setIsPaid(searchParams.get('isPaid') === 'true')
	}, [searchParams])

	if (error) return <div>error</div>

	if (isFetching) return <div>loading</div>

	return (
		<div className=''>
			{data?.map(purchase => (
				<PurchaseItem key={purchase.purchaseId} purchase={purchase} />
			))}
		</div>
	)
}

export default PurchaseList
