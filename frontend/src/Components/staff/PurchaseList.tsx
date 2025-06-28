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
		const isPaidParam = searchParams.get('isPaid')
		setIsPaid(isPaidParam === null ? null : isPaidParam === 'true')
	}, [searchParams])

	if (error)
		return (
			<div className='text-red-500 text-center py-4'>
				Error loading purchases. Please try again.
			</div>
		)

	if (isFetching)
		return <div className='text-center py-4'>Loading purchases...</div>

	return (
		<div className=''>
			{data && data.length > 0 ? (
				data.map(purchase => (
					<PurchaseItem key={purchase.purchaseId} purchase={purchase} />
				))
			) : (
				<div className='text-center py-8 text-gray-500'>
					No purchases found.
				</div>
			)}
		</div>
	)
}

export default PurchaseList
