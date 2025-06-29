'use client'

import React from 'react'
import BookingItem from './BookingItem'
import { OrderDetails } from '@/Interfaces/Payment/Types/BookService'
import { motion } from 'motion/react'

interface BookingListProps {
	data: OrderDetails | undefined
}

const BookingList = ({ data }: BookingListProps) => {
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
					<BookingItem booking={item} />
				</motion.div>
			))}
		</div>
	)
}

export default BookingList
