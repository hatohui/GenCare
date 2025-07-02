'use client'

import React, { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Notification from '@/Components/Lab/Notification'
import SearchBar from '@/Components/Management/SearchBar'
import { motion } from 'motion/react'
import { ArrowLeftSVG } from '@/Components/SVGs'
import TestList from '@/Components/staff/TestList'

interface NotificationState {
	type: 'success' | 'error'
	message: string
}

const TestsAccountPage = ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = use(params)
	const router = useRouter()
	const [notification, setNotification] = useState<NotificationState | null>(
		null
	)

	return (
		<div className='max-w-7xl mx-auto p-6'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className='mb-8'
			>
				<div className='flex items-center gap-4 mb-4'>
					<button
						onClick={() => router.push('/dashboard/tests')}
						className='p-2 rounded-full hover:bg-gray-100 transition-colors'
						aria-label='Quay lại'
					>
						<ArrowLeftSVG className='size-6 text-gray-600' />
					</button>
					<div>
						<h1 className='text-3xl font-bold text-main'>
							Chi Tiết Xét Nghiệm
						</h1>
						<p className='text-gray-600'>
							Quản lý kết quả xét nghiệm của khách hàng
						</p>
					</div>
				</div>
			</motion.div>

			{/* Search Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className='mb-8'
			>
				<div className='bg-white border border-gray-200 rounded-[20px] p-4 shadow-sm'>
					<div className='flex items-center gap-3'>
						<SearchBar className='flex-1' waitTime={500} onChange={() => {}} />
					</div>
				</div>
			</motion.div>

			{/* Test List */}
			<TestList id={id} />

			{notification && (
				<Notification
					type={notification.type}
					message={notification.message}
					onClose={() => setNotification(null)}
				/>
			)}
		</div>
	)
}

export default TestsAccountPage
