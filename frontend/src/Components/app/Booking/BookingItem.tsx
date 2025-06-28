import React, { useState } from 'react'
import { motion } from 'motion/react'
import { OrderDetail } from '@/Interfaces/Payment/Types/BookService'
import clsx from 'clsx'
import { useDeleteOrderDetail, useMomoPay } from '@/Services/book-service'
import { useRouter } from 'next/navigation'
import { TrashCanSVG } from '@/Components/SVGs'
import ConfirmDialog from '@/Components/ConfirmationDialog'

const BookingItem = ({ item }: { item: OrderDetail }) => {
	const momoPayment = useMomoPay(item.purchaseId)
	const deleteOrder = useDeleteOrderDetail(item.orderDetailId)
	const router = useRouter()
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

	const handlePayment = () => {
		momoPayment.mutate(undefined, {
			onSuccess: data => router.push(data.payUrl),
			onError: error => {
				console.error('Payment failed:', error)
				// Add user-friendly error notification
			},
		})
	}

	const handleDelete = () => {
		deleteOrder.mutate(undefined, {
			onSuccess: () => router.push('/app/booking'),
		})
	}

	return (
		<motion.div
			className='bg-general p-6 flex flex-col rounded-[30px] mb-6 max-w-5xl mx-auto shadow-lg hover:shadow-xl transition ease-in-out duration-300'
			whileHover={{ scale: 1.02 }}
		>
			<ConfirmDialog
				isOpen={showDeleteConfirm}
				title='Delete Booking'
				message='Are you sure you want to delete this booking? This action cannot be undone.'
				onConfirm={() => {
					handleDelete()
					setShowDeleteConfirm(false)
				}}
				onCancel={() => setShowDeleteConfirm(false)}
			/>
			<div className='flex justify-between'>
				<h3 className='font-bold text-2xl text-main'>{item.serviceName}</h3>

				<span className='text-sm text-gray-600'>
					Booked on:{' '}
					{item.createdAt instanceof Date
						? item.createdAt.toLocaleString()
						: new Date(item.createdAt).toLocaleString()}
				</span>
				<span onClick={() => setShowDeleteConfirm(true)}>
					<TrashCanSVG className='size-12 rounded-full hover:bg-accent/20 p-2 transition text-accent' />
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
					<span className='ml-2'>
						{item.gender === true
							? 'Male'
							: item.gender === false
							? 'Female'
							: 'Not specified'}
					</span>
				</li>
				<li className='flex items-center'>
					<span className='font-bold w-45'>Date of Birth:</span>
					<span className='ml-2'>
						{item.dateOfBirth instanceof Date
							? item.dateOfBirth.toLocaleDateString()
							: new Date(item.dateOfBirth).toLocaleDateString()}
					</span>
				</li>
				<li className='flex items-center'>
					<span className='font-bold w-45'>Payment Status:</span>
					<span
						className={clsx(item.status ? 'text-green-500' : 'text-red-500')}
					>
						{item.status ? 'Đã thanh toán' : 'Chưa Thanh toán'}
					</span>
				</li>
			</ul>
			<div className='mt-4 flex justify-end'>
				{item.status ? (
					<button className='px-4 py-2 bg-accent text-white font-bold rounded-full hover:bg-rose-500  transition'>
						View Test Result
					</button>
				) : (
					<button
						onClick={handlePayment}
						className='px-4 py-2 bg-accent text-white font-bold rounded-full hover:bg-rose-500  transition'
					>
						Thanh Toán bằng momo!
					</button>
				)}
			</div>
		</motion.div>
	)
}

export default BookingItem
