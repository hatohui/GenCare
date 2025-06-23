'use client'

import { useGetOrder } from '@/Services/book-service'
import React from 'react'
import BookingItem from './BookingItem'
import { OrderDetails } from '@/Interfaces/Payment/Types/BookService'

const BookingList = ({ data }: { data: OrderDetails | undefined }) => {
	if (!data) return null

	return (
		<div>
			{data?.map((item, index) => (
				<BookingItem key={index} item={item} />
			))}
		</div>
	)
}

export default BookingList
