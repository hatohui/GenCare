import React from 'react'
import { motion } from 'motion/react'
import { OrderDetail } from '@/Interfaces/Payment/Types/BookService'

const BookingItem = ({ item }: { item: OrderDetail }) => {
	return (
		<motion.div
			className='bg-general p-6 flex flex-col rounded-[30px] mb-6 max-w-5xl mx-auto shadow-lg hover:shadow-xl transition ease-in-out duration-300'
			whileHover={{ scale: 1.02 }}
		>
			<div className='flex justify-between'>
				<h3 className='font-bold text-2xl text-main'>{item.serviceName}</h3>
				<span className='text-sm text-gray-600'>
					{item.createdAt.toLocaleString()}
				</span>
			</div>
			<ul className='mt-4 space-y-2'>
				<li className='flex items-center'>
					<span className='font-bold w-45'>Name:</span>
					<span className='ml-2'>{`${item.firstName} ${item.lastName}`}</span>
				</li>
				<li className='flex items-center'>
					<span className='font-bold w-45'>Phone:</span>
					<span className='ml-2'>{item.phoneNumber}</span>
				</li>
				<li className='flex items-center'>
					<span className='font-bold w-45'>Gender:</span>
					<span className='ml-2'>{item.gender ? 'Male' : 'Female'}</span>
				</li>
				<li className='flex items-center'>
					<span className='font-bold w-45'>Date of Birth:</span>
					<span className='ml-2'>{item.dateOfBirth.toLocaleString()}</span>
				</li>
				<li className='flex items-center'>
					<span className='font-bold w-45'>Payment Status:</span>
					<span className='ml-2'>{item.purchaseId}</span>
				</li>
			</ul>
			<div className='mt-4 flex justify-end'>
				<button className='px-4 py-2 bg-accent text-white font-bold rounded-full hover:bg-rose-500  transition'>
					View Test Result
				</button>
			</div>
		</motion.div>
	)
}

export default BookingItem
