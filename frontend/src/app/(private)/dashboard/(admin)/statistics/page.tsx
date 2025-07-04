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
import FormatCurrency from '@/Components/FormatCurrency'

const LoadingStatistics = () => (
	<div className='flex justify-center items-center min-h-[600px]'>
		<div className='text-center'>
			<LoadingIcon className='mx-auto mb-4 size-8' />
			<p className='text-gray-600'>Đang tải dữ liệu thống kê...</p>
		</div>
	</div>
)

const ErrorStatistics = ({ refetch }: { refetch: () => void }) => (
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
				onClick={refetch}
				className='bg-main hover:bg-main/90 text-white px-6 py-3 rounded-[30px] font-medium transition-colors'
			>
				Thử lại
			</button>
		</div>
	</div>
)

const statsCards = [
	{
		title: 'Tổng Người Dùng',
		value: (stat: any) => stat.totalActiveUsers.toLocaleString('en-US'),
		subtitle: 'Tài khoản đã đăng ký',
		icon: Users,
		color: 'blue' as const,
		trend: { value: 12.5, isPositive: true, label: 'so với tháng trước' },
		delay: 0.1,
	},
	{
		title: 'Doanh Thu',
		value: (stat: any) => <FormatCurrency amount={stat.totalRevenue} />,
		subtitle: 'Tổng doanh thu',
		icon: DollarSign,
		color: 'green' as const,
		trend: { value: 8.3, isPositive: true, label: 'so với tháng trước' },
		delay: 0.2,
	},
	{
		title: 'Đặt Lịch',
		value: (stat: any) => stat.totalBookings.toLocaleString('en-US'),
		subtitle: 'Lượt đặt lịch',
		icon: Calendar,
		color: 'purple' as const,
		trend: { value: 15.2, isPositive: true, label: 'so với tháng trước' },
		delay: 0.3,
	},
	{
		title: 'Dịch Vụ',
		value: (stat: any) => stat.totalServices,
		subtitle: 'Dịch vụ đang hoạt động',
		icon: Package,
		color: 'indigo' as const,
		delay: 0.4,
	},
]

const AdminStatisticsPage = () => {
	const [selectedPeriod, setSelectedPeriod] = useState<
		'week' | 'month' | 'year'
	>('month')
	const {
		data: statisticsData,
		isLoading,
		isError,
		refetch,
	} = useAdminStatistics()

	const handleExportData = () => {
		// Implement export functionality
		console.log('Exporting data...')
	}

	if (isLoading && !statisticsData) return <LoadingStatistics />
	if (isError || !statisticsData) return <ErrorStatistics refetch={refetch} />

	const { dashboardStatistic } = statisticsData

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
					{statsCards.map(card => (
						<StatsCard
							key={card.title}
							title={card.title}
							value={card.value(dashboardStatistic)}
							subtitle={card.subtitle}
							icon={card.icon}
							color={card.color}
							trend={card.trend}
							delay={card.delay}
						/>
					))}
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
										<FormatCurrency amount={service.revenue} />
									</p>
								</div>
								<div className='flex items-center gap-4'>
									<div className='w-24 bg-gray-200 rounded-full h-2'>
										<div
											className='bg-main h-2 rounded-full'
											style={{
												width: `${service.rating ? service.rating * 20 : 0}%`,
											}}
										></div>
									</div>
									<span className='text-sm font-medium text-gray-600 w-12 text-right'>
										{service.rating !== null && service.rating !== undefined
											? service.rating.toFixed(1)
											: 'N/A'}
									</span>
								</div>
							</motion.div>
						))}
					</div>
				</div>

				{/* Recent Activity */}
				<RecentActivity
					activities={statisticsData.topServices.map(service => ({
						id: service.serviceId,
						type: 'service',
						message: service.serviceName,
						timestamp: new Date().toISOString(),
						status: 'info',
						userName: service.serviceName,
					}))}
				/>
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
					value={statisticsData.dashboardStatistic.totalActiveConsultants}
					subtitle='Đang hoạt động'
					icon={Users}
					color='yellow'
				/>
				<StatsCard
					title='Thanh Toán Chờ'
					value={statisticsData.dashboardStatistic.pendingPayments}
					subtitle='Cần xử lý'
					icon={Activity}
					color='red'
				/>
				<StatsCard
					title='Kết Quả Xét Nghiệm'
					value={statisticsData.dashboardStatistic.testResults}
					subtitle='Đã hoàn thành'
					icon={TrendingUp}
					color='green'
				/>
			</motion.div>
		</div>
	)
}

export default AdminStatisticsPage
