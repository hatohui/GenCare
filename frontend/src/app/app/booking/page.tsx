'use client'

import BookingList from '@/Components/app/Booking/BookingList'
import { useGetOrder } from '@/Services/book-service'

const Page = () => {
	const { data, isLoading } = useGetOrder()

	if (isLoading) {
		return <div>Loading...</div>
	}

	return (
		<div>
			<BookingList data={data} />
		</div>
	)
}

export default Page
