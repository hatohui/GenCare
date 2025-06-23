'use client'

import React from 'react'
import BookingItem from './BookingItem'
import { OrderDetails } from '@/Interfaces/Payment/Types/BookService'
import { motion } from 'motion/react'

const BookingList = ({ data }: { data: OrderDetails | undefined }) => {
	if (!data) return null

	return (
		<div className='grid gap-4'>
			{data?.map((item, index) => (
				<motion.div
					key={index}
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.1 }}
				>
					<BookingItem item={item} />
				</motion.div>
			))}
		</div>
	)
}

export default BookingList
