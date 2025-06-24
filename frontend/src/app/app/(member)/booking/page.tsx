'use client'

import BookingList from '@/Components/app/Booking/BookingList'
import { useGetOrder } from '@/Services/book-service'

const Page = () => {
	const { data, isLoading, error } = useGetOrder()

	if (isLoading) {
		return (
			<div className='flex justify-center items-center p-8'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-accent'></div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='text-red-500 text-center p-8'>
				Failed to load bookings. Please try again.
			</div>
		)
	}

	return (
		<div>
			<BookingList data={data} />
		</div>
	)
}

export default Page
