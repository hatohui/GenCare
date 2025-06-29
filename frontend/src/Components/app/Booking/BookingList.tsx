'use client'

import React from 'react'
import BookingItem from './BookingItem'
import {
	OrderDetails,
	OrderDetail,
} from '@/Interfaces/Payment/Types/BookService'
import { motion } from 'motion/react'

interface BookingListProps {
	data: OrderDetails | undefined
	onViewTestResult: (item: OrderDetail) => void
}

const BookingList = ({ data, onViewTestResult }: BookingListProps) => {
	if (!data) return null

	return (
		<div className='grid gap-4'>
			{data?.map((item, index) => (
				<motion.div
					key={item.orderDetailId || `booking-${index}`}
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.1 }}
				>
					<BookingItem item={item} onViewTestResult={onViewTestResult} />
				</motion.div>
			))}
		</div>
	)
}

export default BookingList
