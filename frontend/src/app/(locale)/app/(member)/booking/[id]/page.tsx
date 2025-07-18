'use client'

import BookServiceForm from '@/Components/app/Booking/bookingForm'
import React, { use } from 'react'

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = use(params)
	return (
		<div>
			<BookServiceForm serviceId={id} />
		</div>
	)
}

export default Page
