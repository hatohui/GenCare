'use client'

import { useAdminStatistics } from '@/Services/statistics-service'
import { motion } from 'motion/react'
import React, { useState } from 'react'
import {
	Users,
	DollarSign,
	Calendar,
	Package,
	TrendingUp,
	Activity,
	Download,
	RefreshCw,
} from 'lucide-react'
import StatsCard from '@/Components/Dashboard/Statistics/StatsCard'
import RevenueChart from '@/Components/Dashboard/Statistics/RevenueChart'
import UserGrowthChart from '@/Components/Dashboard/Statistics/UserGrowthChart'
import RecentActivity from '@/Components/Dashboard/Statistics/RecentActivity'
import LoadingIcon from '@/Components/LoadingIcon'
import { AdminStatisticsResponse } from '@/Interfaces/Statistics/Types/Statistics'

// Mock data for demonstration - replace with real API data
const mockData: AdminStatisticsResponse = {
	dashboardStats: {
		totalUsers: 1247,
		totalServices: 23,
		totalRevenue: 45678900,
		totalBookings: 892,
		activeConsultants: 15,
		pendingPayments: 34,
		completedPayments: 858,
		testResults: 445,
	},
	revenueData: [
		{ date: '2024-01-01', revenue: 1200000, bookings: 15 },
		{ date: '2024-01-02', revenue: 1800000, bookings: 22 },
		{ date: '2024-01-03', revenue: 1500000, bookings: 18 },
		{ date: '2024-01-04', revenue: 2200000, bookings: 25 },
		{ date: '2024-01-05', revenue: 1900000, bookings: 21 },
		{ date: '2024-01-06', revenue: 2500000, bookings: 28 },
		{ date: '2024-01-07', revenue: 2100000, bookings: 24 },
	],
	userGrowth: [
		{ date: '2024-01-01', newUsers: 12, totalUsers: 1200 },
		{ date: '2024-01-02', newUsers: 18, totalUsers: 1218 },
		{ date: '2024-01-03', newUsers: 15, totalUsers: 1233 },
		{ date: '2024-01-04', newUsers: 22, totalUsers: 1255 },
		{ date: '2024-01-05', newUsers: 19, totalUsers: 1274 },
		{ date: '2024-01-06', newUsers: 25, totalUsers: 1299 },
		{ date: '2024-01-07', newUsers: 21, totalUsers: 1320 },
	],
	topServices: [
		{
			serviceId: '1',
			serviceName: 'Khám tổng quát',
			bookings: 156,
			revenue: 15600000,
			percentage: 35,
		},
		{
			serviceId: '2',
			serviceName: 'Xét nghiệm máu',
			bookings: 134,
			revenue: 13400000,
			percentage: 30,
		},
		{
			serviceId: '3',
			serviceName: 'Siêu âm',
			bookings: 98,
			revenue: 9800000,
			percentage: 22,
		},
		{
			serviceId: '4',
			serviceName: 'Chụp X-quang',
			bookings: 67,
			revenue: 6700000,
			percentage: 13,
		},
	],
	recentActivity: [
		{
			id: '1',
			type: 'payment',
			message: 'Thanh toán thành công cho Nguyễn Thị Anh',
			timestamp: '2024-01-15T10:30:00.000Z',
			status: 'success',
			userName: 'Nguyễn Thị Anh',
		},
		{
			id: '2',
			type: 'booking',
			message: 'Đặt lịch khám mới cho Trần Văn Bình',
			timestamp: '2024-01-15T10:15:00.000Z',
			status: 'success',
			userName: 'Trần Văn Bình',
		},
		{
			id: '3',
			type: 'test',
			message: 'Kết quả xét nghiệm đã sẵn sàng cho Lê Thị Cẩm',
			timestamp: '2024-01-15T10:00:00.000Z',
			status: 'success',
			userName: 'Lê Thị Cẩm',
		},
		{
			id: '4',
			type: 'user',
			message: 'Người dùng mới đăng ký: Phạm Văn Dũng',
			timestamp: '2024-01-15T09:45:00.000Z',
			status: 'info',
			userName: 'Phạm Văn Dũng',
		},
		{
			id: '5',
			type: 'payment',
			message: 'Thanh toán thất bại cho Hoàng Thị Em',
			timestamp: '2024-01-15T09:30:00.000Z',
			status: 'error',
			userName: 'Hoàng Thị Em',
		},
		{
			id: '6',
			type: 'service',
			message: 'Dịch vụ mới được thêm: Khám chuyên khoa tim mạch',
			timestamp: '2024-01-15T09:00:00.000Z',
			status: 'info',
		},
	],
	paymentStats: {
		total: 892,
		pending: 34,
		completed: 858,
		failed: 12,
		monthlyRevenue: [
			{ date: '2024-01-01', revenue: 1200000, bookings: 15 },
			{ date: '2024-01-02', revenue: 1800000, bookings: 22 },
			{ date: '2024-01-03', revenue: 1500000, bookings: 18 },
		],
	},
	userStats: {
		total: 1247,
		active: 1189,
		newThisMonth: 47,
		growthRate: 3.9,
		monthlyGrowth: [
			{ date: '2024-01-01', newUsers: 12, totalUsers: 1200 },
			{ date: '2024-01-02', newUsers: 18, totalUsers: 1218 },
			{ date: '2024-01-03', newUsers: 15, totalUsers: 1233 },
		],
	},
	servicePerformance: [
		{
			id: '1',
			name: 'Khám tổng quát',
			bookings: 156,
			revenue: 15600000,
			rating: 4.8,
		},
		{
			id: '2',
			name: 'Xét nghiệm máu',
			bookings: 134,
			revenue: 13400000,
			rating: 4.6,
		},
		{ id: '3', name: 'Siêu âm', bookings: 98, revenue: 9800000, rating: 4.7 },
	],
}

const AdminStatisticsPage = () => {
	const [selectedPeriod, setSelectedPeriod] = useState<
		'week' | 'month' | 'year'
	>('month')

	// Use real API data when available, fallback to mock data
	const { data, isLoading, isError, refetch } = useAdminStatistics()

	// Use mock data for demonstration
	const statisticsData = data || mockData

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
			minimumFractionDigits: 0,
		}).format(amount)
	}

	const handleExportData = () => {
		// Implement export functionality
		console.log('Exporting data...')
	}

	if (isLoading && !data) {
		return (
			<div className='flex justify-center items-center min-h-[600px]'>
				<div className='text-center'>
					<LoadingIcon className='mx-auto mb-4 size-8' />
					<p className='text-gray-600'>Đang tải dữ liệu thống kê...</p>
				</div>
			</div>
		)
	}

	if (isError) {
		return (
			<div className='flex justify-center items-center min-h-[600px]'>
				<div className='text-center max-w-md mx-auto p-6'>
					<div className='text-red-500 text-6xl mb-4'>⚠️</div>
					<h3 className='text-xl font-semibold text-gray-800 mb-2'>
						Không thể tải dữ liệu thống kê
					</h3>
					<p className='text-gray-600 mb-4'>
						Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
					</p>
					<button
						onClick={() => refetch()}
						className='bg-main hover:bg-main/90 text-white px-6 py-3 rounded-[30px] font-medium transition-colors'
					>
						Thử lại
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className='max-w-7xl mx-auto p-6 space-y-8'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className='flex items-center justify-between'
			>
				<div>
					<h1 className='text-3xl font-bold text-main mb-2'>
						Thống Kê Tổng Quan
					</h1>
					<p className='text-gray-600'>
						Theo dõi hiệu suất và tăng trưởng của hệ thống
					</p>
				</div>
				<div className='flex items-center gap-3'>
					<button
						onClick={() => refetch()}
						className='flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors'
					>
						<RefreshCw className='size-4' />
						Làm mới
					</button>
					<button
						onClick={handleExportData}
						className='flex items-center gap-2 px-4 py-2 bg-main text-white rounded-lg hover:bg-main/90 transition-colors'
					>
						<Download className='size-4' />
						Xuất dữ liệu
					</button>
				</div>
			</motion.div>

			{/* Stats Cards */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className='overflow-x-auto'
			>
				<div className='grid grid-cols-1 min-w-[320px] sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6'>
					<StatsCard
						title='Tổng Người Dùng'
						value={statisticsData.dashboardStats.totalUsers.toLocaleString(
							'en-US'
						)}
						subtitle='Tài khoản đã đăng ký'
						icon={Users}
						color='blue'
						trend={{
							value: 12.5,
							isPositive: true,
							label: 'so với tháng trước',
						}}
						delay={0.1}
					/>
					<StatsCard
						title='Doanh Thu'
						value={formatCurrency(statisticsData.dashboardStats.totalRevenue)}
						subtitle='Tổng doanh thu'
						icon={DollarSign}
						color='green'
						trend={{
							value: 8.3,
							isPositive: true,
							label: 'so với tháng trước',
						}}
						delay={0.2}
					/>
					<StatsCard
						title='Đặt Lịch'
						value={statisticsData.dashboardStats.totalBookings.toLocaleString(
							'en-US'
						)}
						subtitle='Lượt đặt lịch'
						icon={Calendar}
						color='purple'
						trend={{
							value: 15.2,
							isPositive: true,
							label: 'so với tháng trước',
						}}
						delay={0.3}
					/>
					<StatsCard
						title='Dịch Vụ'
						value={statisticsData.dashboardStats.totalServices}
						subtitle='Dịch vụ đang hoạt động'
						icon={Package}
						color='indigo'
						delay={0.4}
					/>
				</div>
			</motion.div>

			{/* Charts Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className='grid grid-cols-1 lg:grid-cols-2 gap-6'
			>
				<RevenueChart
					data={statisticsData.revenueData}
					period={selectedPeriod}
				/>
				<UserGrowthChart
					data={statisticsData.userGrowth}
					period={selectedPeriod}
				/>
			</motion.div>

			{/* Period Selector */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className='flex justify-center'
			>
				<div className='flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200'>
					{(['week', 'month', 'year'] as const).map(period => (
						<button
							key={period}
							onClick={() => setSelectedPeriod(period)}
							className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
								selectedPeriod === period
									? 'bg-main text-white'
									: 'text-gray-600 hover:text-gray-800'
							}`}
						>
							{period === 'week' && 'Tuần'}
							{period === 'month' && 'Tháng'}
							{period === 'year' && 'Năm'}
						</button>
					))}
				</div>
			</motion.div>

			{/* Additional Stats and Activity */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className='grid grid-cols-1 lg:grid-cols-3 gap-6'
			>
				{/* Top Services */}
				<div className='lg:col-span-2 bg-white rounded-[20px] p-6 shadow-sm border border-gray-100'>
					<h3 className='text-lg font-semibold text-gray-800 mb-4'>
						Dịch Vụ Nổi Bật
					</h3>
					<div className='space-y-4'>
						{statisticsData.topServices.map((service, index) => (
							<motion.div
								key={service.serviceId}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.1 }}
								className='flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors'
							>
								<div className='flex-1'>
									<p className='font-medium text-gray-800'>
										{service.serviceName}
									</p>
									<p className='text-sm text-gray-600'>
										{service.bookings} lượt đặt •{' '}
										{formatCurrency(service.revenue)}
									</p>
								</div>
								<div className='flex items-center gap-4'>
									<div className='w-24 bg-gray-200 rounded-full h-2'>
										<div
											className='bg-main h-2 rounded-full'
											style={{ width: `${service.percentage}%` }}
										></div>
									</div>
									<span className='text-sm font-medium text-gray-600 w-12 text-right'>
										{service.percentage}%
									</span>
								</div>
							</motion.div>
						))}
					</div>
				</div>

				{/* Recent Activity */}
				<RecentActivity activities={statisticsData.recentActivity} />
			</motion.div>

			{/* Additional Stats Cards */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
				className='grid grid-cols-1 md:grid-cols-3 gap-6'
			>
				<StatsCard
					title='Tư Vấn Viên'
					value={statisticsData.dashboardStats.activeConsultants}
					subtitle='Đang hoạt động'
					icon={Users}
					color='yellow'
				/>
				<StatsCard
					title='Thanh Toán Chờ'
					value={statisticsData.dashboardStats.pendingPayments}
					subtitle='Cần xử lý'
					icon={Activity}
					color='red'
				/>
				<StatsCard
					title='Kết Quả Xét Nghiệm'
					value={statisticsData.dashboardStats.testResults}
					subtitle='Đã hoàn thành'
					icon={TrendingUp}
					color='green'
				/>
			</motion.div>
		</div>
	)
}

export default AdminStatisticsPage
