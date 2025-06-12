'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

const ReturnButton = () => {
	const router = useRouter()

	return (
		<button
			onClick={() => router.back()}
			className='absolute top-4 left-4 px-4 py-2 text-sm font-medium bg-accent z-30 round text-general hover:scale-105 hover:brightness-90 transition'
		>
			← Back
		</button>
	)
}

export default ReturnButton
