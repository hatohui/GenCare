'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { useAccountStore } from '@/Hooks/useAccount'
import { useGetOrder } from '@/Services/book-service'
import {
	HeartSVG,
	BookingListVSG,
	ServiceSVG,
	AccountSVG,
	CheckCircleSVG,
	ClockSVG,
	// CalendarSVG,
} from '@/Components/SVGs'
import LoadingIcon from '@/Components/LoadingIcon'

const UserHomePage = () => {
	const router = useRouter()
	const { data: user } = useAccountStore()
	const { data: bookings, isLoading: bookingsLoading } = useGetOrder()

	// Calculate stats from bookings
	const totalBookings = bookings?.length || 0
	const completedBookings =
		bookings?.filter(booking => booking.status).length || 0
	const pendingBookings = totalBookings - completedBookings

	// Quick actions for users
	const quickActions = [
		{
			title: 'Đặt dịch vụ',
			description: 'Khám phá và đặt các dịch vụ y tế',
			icon: <ServiceSVG className='size-6' />,
			path: '/app/service',
			color: 'bg-blue-500',
			gradient: 'from-blue-500 to-blue-600',
		},
		{
			title: 'Theo dõi chu kỳ',
			description: 'Quản lý chu kỳ kinh nguyệt',
			icon: <HeartSVG className='size-6' />,
			path: '/app/birthcontrol',
			color: 'bg-pink-500',
			gradient: 'from-pink-500 to-pink-600',
		},
		{
			title: 'Đặt lịch tư vấn',
			description: 'Đặt lịch với chuyên gia tư vấn',
			icon: <AccountSVG className='size-6' />,
			path: '/app/consultants',
			color: 'bg-green-500',
			gradient: 'from-green-500 to-green-600',
		},
		{
			title: 'Xem đặt dịch vụ',
			description: 'Kiểm tra trạng thái đặt dịch vụ',
			icon: <BookingListVSG className='size-6' />,
			path: '/app/booking',
			color: 'bg-purple-500',
			gradient: 'from-purple-500 to-purple-600',
		},
	]

	// Recent activity (mock data - replace with real data)
	const recentActivity = [
		{
			id: 1,
			type: 'booking',
			message: 'Đã đặt dịch vụ khám tổng quát',
			time: '2 ngày trước',
			status: 'completed',
		},
		{
			id: 2,
			type: 'consultation',
			message: 'Đã đặt lịch tư vấn với Dr. Nguyễn',
			time: '1 tuần trước',
			status: 'pending',
		},
		{
			id: 3,
			type: 'cycle',
			message: 'Đã cập nhật thông tin chu kỳ',
			time: '2 tuần trước',
			status: 'completed',
		},
	]

	if (bookingsLoading) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<LoadingIcon className='size-8' />
			</div>
		)
	}

	return (
		<div className='max-w-7xl mx-auto p-6'>
			{/* Welcome Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className='text-center mb-8'
			>
				<h1 className='text-3xl font-bold text-main mb-2'>
					Chào mừng trở lại, {user?.firstName}! 👋
				</h1>
				<p className='text-gray-600'>
					Quản lý sức khỏe của bạn một cách dễ dàng và thuận tiện
				</p>
			</motion.div>

			{/* Stats Cards */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'
			>
				<div className='bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-gray-600'>Tổng đặt dịch vụ</p>
							<p className='text-2xl font-bold text-main'>{totalBookings}</p>
						</div>
						<div className='p-3 bg-blue-100 rounded-full'>
							<BookingListVSG className='size-6 text-blue-600' />
						</div>
					</div>
				</div>

				<div className='bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-gray-600'>Đã hoàn thành</p>
							<p className='text-2xl font-bold text-green-600'>
								{completedBookings}
							</p>
						</div>
						<div className='p-3 bg-green-100 rounded-full'>
							<CheckCircleSVG className='size-6 text-green-600' />
						</div>
					</div>
				</div>

				<div className='bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-gray-600'>Đang chờ xử lý</p>
							<p className='text-2xl font-bold text-yellow-600'>
								{pendingBookings}
							</p>
						</div>
						<div className='p-3 bg-yellow-100 rounded-full'>
							<ClockSVG className='size-6 text-yellow-600' />
						</div>
					</div>
				</div>
			</motion.div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
				{/* Quick Actions */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}
					className='bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm'
				>
					<h2 className='text-xl font-bold text-gray-800 mb-4'>
						Thao tác nhanh
					</h2>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						{quickActions.map((action, index) => (
							<motion.button
								key={action.title}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 + index * 0.1 }}
								onClick={() => router.push(action.path)}
								className='p-4 border border-gray-200 rounded-[15px] hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 text-left group'
							>
								<div className='flex items-center gap-3'>
									<div
										className={`p-3 rounded-full ${action.color} text-white`}
									>
										{action.icon}
									</div>
									<div>
										<h3 className='font-semibold text-gray-800 group-hover:text-main transition-colors'>
											{action.title}
										</h3>
										<p className='text-sm text-gray-600'>
											{action.description}
										</p>
									</div>
								</div>
							</motion.button>
						))}
					</div>
				</motion.div>

				{/* Recent Activity */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}
					className='bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm'
				>
					<h2 className='text-xl font-bold text-gray-800 mb-4'>
						Hoạt động gần đây
					</h2>
					<div className='space-y-4'>
						{recentActivity.map((activity, index) => (
							<motion.div
								key={activity.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 + index * 0.1 }}
								className='flex items-start gap-3 p-3 rounded-[15px] hover:bg-gray-50 transition-colors'
							>
								<div
									className={`p-2 rounded-full ${
										activity.status === 'completed'
											? 'bg-green-100 text-green-600'
											: 'bg-yellow-100 text-yellow-600'
									}`}
								>
									{activity.status === 'completed' ? (
										<CheckCircleSVG className='size-4' />
									) : (
										<ClockSVG className='size-4' />
									)}
								</div>
								<div className='flex-1'>
									<p className='text-sm text-gray-800'>{activity.message}</p>
									<p className='text-xs text-gray-500 mt-1'>{activity.time}</p>
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>

			{/* Health Tips Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className='mt-8 bg-gradient-to-r from-main to-secondary rounded-[20px] p-6 text-white'
			>
				<div className='text-center'>
					<h2 className='text-xl font-bold mb-2'>💡 Mẹo sức khỏe hôm nay</h2>
					<p className='text-white/90'>
						Uống đủ nước mỗi ngày giúp cơ thể khỏe mạnh và tăng cường hệ miễn
						dịch. Hãy đặt mục tiêu uống ít nhất 8 ly nước mỗi ngày!
					</p>
				</div>
			</motion.div>
		</div>
	)
}

export default UserHomePage
