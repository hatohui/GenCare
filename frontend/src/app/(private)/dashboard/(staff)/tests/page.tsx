'use client'

import React, { useState } from 'react'
import DashboardStats from '@/Components/Lab/DashboardStats'
import TestOrderTable from '@/Components/Lab/TestOrderTable'
import Notification from '@/Components/Lab/Notification'
import SearchBar from '@/Components/Management/SearchBar'
import { useGetOrder } from '@/Services/book-service'
import { motion } from 'motion/react'
import { OrderDetail } from '@/Interfaces/Payment/Types/BookService'

interface TestOrder {
	orderDetailId: string
	patientName: string
	testType: string
	orderDate: string
	sampleDate: string | null
	resultDate: string | null
	status: 'completed' | 'pending'
}

interface NotificationState {
	type: 'success' | 'error'
	message: string
}

const mapOrderToTestOrder = (order: OrderDetail): TestOrder => ({
	orderDetailId: order.orderDetailId,
	patientName: (order.firstName + ' ' + order.lastName).trim(),
	testType: order.serviceName,
	orderDate: order.createdAt as unknown as string,
	sampleDate: (order as any).sampleDate || null,
	resultDate: (order as any).resultDate || null,
	status: order.status ? 'completed' : 'pending',
})

const TestsPage = () => {
	const { data, isLoading, error } = useGetOrder()
	const [search, setSearch] = useState('')
	const [notification, setNotification] = useState<NotificationState | null>(
		null
	)

	// Map and filter orders
	const orders: TestOrder[] = (data || []).map(mapOrderToTestOrder)
	const filteredOrders: TestOrder[] = orders.filter(
		order =>
			order.patientName.toLowerCase().includes(search.toLowerCase()) ||
			order.testType?.toLowerCase().includes(search.toLowerCase()) ||
			order.orderDetailId?.includes(search)
	)

	if (isLoading) return <div>Loading...</div>
	if (error) return <div>Error loading orders</div>

	return (
		<div className='max-w-7xl mx-auto p-6'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className='text-center mb-8'
			>
				<h1 className='text-3xl font-bold text-main mb-2'>
					Quản Lý Kết Quả Xét Nghiệm
				</h1>
				<p className='text-gray-600'>
					Xem và quản lý kết quả xét nghiệm của khách hàng
				</p>
			</motion.div>

			<DashboardStats orders={filteredOrders} />

			{/* Search Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className='mb-8'
			>
				<div className='bg-white border border-gray-200 rounded-[20px] p-4 shadow-sm'>
					<div className='flex items-center gap-3'>
						<SearchBar
							className='flex-1'
							waitTime={500}
							onChange={e => setSearch(e.target.value)}
						/>
					</div>
				</div>
			</motion.div>

			<TestOrderTable orders={filteredOrders} />

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

export default TestsPage
