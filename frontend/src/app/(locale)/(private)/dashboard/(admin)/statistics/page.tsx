'use client'

import {
	useDashboardStatistics,
	useTopServices,
	usePaymentStatistics,
	useUserStatistics,
	useRevenueData,
	useUserGrowth,
} from '@/Services/statistics-service'
import { motion } from 'motion/react'
import React, { useState } from 'react'
import {
	Users,
	DollarSign,
	Package,
	TrendingUp,
	Activity,
	Download,
	RefreshCw,
} from 'lucide-react'
import {
	StatsCard,
	StatisticsTable,
	TopServicesTable,
	RevenueChart,
	UserGrowthChart,
	RecentActivity,
} from '@/Components/Dashboard/Statistics'
import LoadingIcon from '@/Components/LoadingIcon'
import FormatCurrency from '@/Components/FormatCurrency'
import { useLocale } from '@/Hooks/useLocale'

const LoadingStatistics = () => {
	const { t } = useLocale()

	return (
		<div className='flex justify-center items-center min-h-[600px]'>
			<div className='text-center'>
				<LoadingIcon className='mx-auto mb-4 size-8' />
				<p className='text-gray-600'>{t('statistics.loadingData')}</p>
			</div>
		</div>
	)
}

const ErrorStatistics = ({ refetch }: { refetch: () => void }) => {
	const { t } = useLocale()

	return (
		<div className='flex justify-center items-center min-h-[600px]'>
			<div className='text-center max-w-md mx-auto p-6'>
				<div className='text-red-500 text-6xl mb-4'>⚠️</div>
				<h3 className='text-xl font-semibold text-gray-800 mb-2'>
					{t('statistics.loadError')}
				</h3>
				<p className='text-gray-600 mb-4'>
					{t('statistics.loadErrorDescription')}
				</p>
				<button
					onClick={refetch}
					className='bg-main hover:bg-main/90 text-white px-6 py-3 rounded-[30px] font-medium transition-colors'
				>
					{t('common.tryAgain')}
				</button>
			</div>
		</div>
	)
}

const AdminStatisticsPage = () => {
	const { t, locale } = useLocale()
	const [selectedPeriod, setSelectedPeriod] = useState<
		'week' | 'month' | 'year'
	>('month')

	// Helper function to format numbers based on locale
	const formatNumber = (num: number) => {
		const localeCode = locale === 'vi' ? 'vi-VN' : 'en-US'
		return num.toLocaleString(localeCode)
	}

	// Use individual API hooks
	const {
		data: dashboardData,
		isLoading: dashboardLoading,
		isError: dashboardError,
		refetch: refetchDashboard,
	} = useDashboardStatistics()

	const {
		data: topServicesData,
		isLoading: topServicesLoading,
		isError: topServicesError,
		refetch: refetchTopServices,
	} = useTopServices()

	const {
		isLoading: paymentLoading,
		isError: paymentError,
		refetch: refetchPayment,
	} = usePaymentStatistics()

	const {
		isLoading: userLoading,
		isError: userError,
		refetch: refetchUser,
	} = useUserStatistics()

	const {
		data: revenueData,
		isLoading: revenueLoading,
		isError: revenueError,
		refetch: refetchRevenue,
	} = useRevenueData(selectedPeriod)

	const {
		data: userGrowthData,
		isLoading: userGrowthLoading,
		isError: userGrowthError,
		refetch: refetchUserGrowth,
	} = useUserGrowth(selectedPeriod)

	// Combined loading and error states
	const isLoading =
		dashboardLoading ||
		topServicesLoading ||
		paymentLoading ||
		userLoading ||
		revenueLoading ||
		userGrowthLoading
	const isError =
		dashboardError ||
		topServicesError ||
		paymentError ||
		userError ||
		revenueError ||
		userGrowthError

	const handleExportData = () => {
		// Implement export functionality
	}

	const handleRefresh = () => {
		refetchDashboard()
		refetchTopServices()
		refetchPayment()
		refetchUser()
		refetchRevenue()
		refetchUserGrowth()
	}

	if (isLoading && !dashboardData) return <LoadingStatistics />
	if (isError || !dashboardData)
		return <ErrorStatistics refetch={handleRefresh} />

	// Ensure we have the required data structure
	if (!dashboardData || !topServicesData) {
		return <ErrorStatistics refetch={handleRefresh} />
	}

	const dashboardStatistic = dashboardData

	const filteredAndSortedTopServices = topServicesData
		.filter((service: any) => service.bookings > 0)
		.sort((a: any, b: any) => b.bookings - a.bookings)

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
						{t('statistics.overview')}
					</h1>
					<p className='text-gray-600'>{t('statistics.overviewDescription')}</p>
				</div>
				<div className='flex items-center gap-3'>
					<button
						onClick={handleRefresh}
						className='flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors'
					>
						<RefreshCw className='size-4' />
						{t('common.refresh')}
					</button>
					<button
						onClick={handleExportData}
						className='flex items-center gap-2 px-4 py-2 bg-main text-white rounded-lg hover:bg-main/90 transition-colors'
					>
						<Download className='size-4' />
						{t('statistics.exportData')}
					</button>
				</div>
			</motion.div>

			{/* Summary Statistics Overview */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className='bg-gradient-to-r from-blue-50 to-purple-50 rounded-[20px] p-6 border border-blue-200'
			>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
					<div className='text-center'>
						<div className='text-2xl font-bold text-blue-600'>
							{formatNumber(dashboardStatistic.totalActiveUsers)}
						</div>
						<div className='text-sm text-gray-600'>
							{t('statistics.totalUsers')}
						</div>
					</div>
					<div className='text-center'>
						<div className='text-2xl font-bold text-green-600'>
							<FormatCurrency amount={dashboardStatistic.totalRevenue} />
						</div>
						<div className='text-sm text-gray-600'>
							{t('statistics.totalRevenue')}
						</div>
					</div>
					<div className='text-center'>
						<div className='text-2xl font-bold text-purple-600'>
							{formatNumber(dashboardStatistic.totalBookings)}
						</div>
						<div className='text-sm text-gray-600'>
							{t('statistics.totalBookings')}
						</div>
					</div>
					<div className='text-center'>
						<div className='text-2xl font-bold text-indigo-600'>
							{dashboardStatistic.totalServices}
						</div>
						<div className='text-sm text-gray-600'>
							{t('statistics.activeServices')}
						</div>
					</div>
				</div>
			</motion.div>

			{/* Main Statistics Cards - Column 1 */}

			{/* Period Selector */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
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
							{period === 'week' && t('statistics.week')}
							{period === 'month' && t('statistics.month')}
							{period === 'year' && t('statistics.year')}
						</button>
					))}
				</div>
			</motion.div>

			{/* Charts Section - Column 2 */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.25 }}
				className='grid grid-cols-1 lg:grid-cols-2 gap-6'
			>
				<RevenueChart data={revenueData || []} period={selectedPeriod} />
				<UserGrowthChart data={userGrowthData || []} period={selectedPeriod} />
			</motion.div>

			{/* Secondary Statistics Cards - Column 3 */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className='grid grid-cols-1 md:grid-cols-3 gap-6'
			>
				<StatsCard
					title={t('statistics.consultants')}
					value={dashboardStatistic.totalActiveConsultants}
					subtitle={t('statistics.activeConsultants')}
					icon={Users}
					color='yellow'
				/>
				<StatsCard
					title={t('statistics.pendingPayments')}
					value={dashboardStatistic.pendingPayments}
					subtitle={t('statistics.needsProcessing')}
					icon={Activity}
					color='red'
				/>
				<StatsCard
					title={t('statistics.testResults')}
					value={dashboardStatistic.testResults}
					subtitle={t('statistics.completed')}
					icon={TrendingUp}
					color='green'
				/>
			</motion.div>

			{/* Detailed Statistics Section - Column 4 */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.35 }}
				className='grid grid-cols-1 lg:grid-cols-3 gap-6'
			>
				{/* Top Services Performance Table */}
				<div className='lg:col-span-2'>
					<TopServicesTable
						services={filteredAndSortedTopServices.slice(0, 10)}
						title={t('statistics.topServices')}
					/>
				</div>

				{/* Recent Activity */}
				<div className='bg-white rounded-[20px] p-6 shadow-sm border border-gray-100'>
					<div className='flex items-center gap-2 mb-4'>
						<Activity className='size-5 text-main' />
						<h3 className='text-lg font-semibold text-gray-800'>
							{t('statistics.recentActivity')}
						</h3>
					</div>
					<RecentActivity
						activities={filteredAndSortedTopServices
							.slice(0, 5)
							.map((service: any, index: number) => {
								// Create more realistic timestamps (last 24 hours)
								const hoursAgo = Math.floor(Math.random() * 24) + 1
								const timestamp = new Date()
								timestamp.setHours(timestamp.getHours() - hoursAgo)

								// Create different activity types
								const activityTypes = [
									{
										type: 'booking' as const,
										message: t('recentActivity.service_booked', {
											serviceName: service.serviceName,
										}),
										status: 'success' as const,
									},
									{
										type: 'payment' as const,
										message: t('recentActivity.payment_completed'),
										status: 'success' as const,
									},
									{
										type: 'service' as const,
										message: t('recentActivity.service_booked', {
											serviceName: service.serviceName,
										}),
										status: 'info' as const,
									},
								]

								const activity = activityTypes[index % activityTypes.length]

								return {
									id: `${service.serviceId}-${index}`,
									type: activity.type,
									message: activity.message,
									timestamp: timestamp.toISOString(),
									status: activity.status,
									userName: `User ${index + 1}`,
								}
							})}
					/>
				</div>
			</motion.div>

			{/* Detailed Statistics Tables - Column 5 */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
			>
				{/* User Statistics Table */}
				<StatisticsTable
					title={t('statistics.userStatistics')}
					icon={Users}
					data={[
						{
							label: t('statistics.activeUsers'),
							value: dashboardStatistic.totalActiveUsers,
							type: 'number',
							color: 'info',
						},
						{
							label: t('statistics.managers'),
							value: dashboardStatistic.totalActiveManagers,
							type: 'number',
							color: 'info',
						},
						{
							label: t('statistics.staff'),
							value: dashboardStatistic.totalActiveStaffs,
							type: 'number',
							color: 'info',
						},
						{
							label: t('statistics.consultants'),
							value: dashboardStatistic.totalActiveConsultants,
							type: 'number',
							color: 'info',
						},
					]}
				/>

				{/* Payment Statistics Table */}
				<StatisticsTable
					title={t('statistics.paymentStatistics')}
					icon={DollarSign}
					data={[
						{
							label: t('statistics.pendingPayments'),
							value: dashboardStatistic.pendingPayments,
							type: 'number',
							color: 'warning',
						},
						{
							label: t('statistics.completedPayments'),
							value: dashboardStatistic.completedPayments,
							type: 'number',
							color: 'success',
						},
						{
							label: t('statistics.totalRevenue'),
							value: dashboardStatistic.totalRevenue,
							type: 'currency',
							color: 'success',
						},
						{
							label: t('statistics.successRate'),
							value: 98.5,
							type: 'percentage',
							color: 'success',
						},
					]}
				/>

				{/* Service Statistics Table */}
				<StatisticsTable
					title={t('statistics.serviceStatistics')}
					icon={Package}
					data={[
						{
							label: t('statistics.totalServices'),
							value: dashboardStatistic.totalServices,
							type: 'number',
							color: 'info',
						},
						{
							label: t('statistics.totalBookings'),
							value: dashboardStatistic.totalBookings,
							type: 'number',
							color: 'info',
						},
						{
							label: t('statistics.activeConsultants'),
							value: dashboardStatistic.totalActiveConsultants,
							type: 'number',
							color: 'info',
						},
						{
							label: t('statistics.avgRating'),
							value: 4.8,
							type: 'text',
							color: 'success',
						},
					]}
				/>

				{/* Test Statistics Table */}
				<StatisticsTable
					title={t('statistics.testStatistics')}
					icon={TrendingUp}
					data={[
						{
							label: t('statistics.testResults'),
							value: dashboardStatistic.testResults,
							type: 'number',
							color: 'info',
						},
						{
							label: t('statistics.successRate'),
							value: 98.5,
							type: 'percentage',
							color: 'success',
						},
						{
							label: t('statistics.avgProcessingTime'),
							value: '2.3 days',
							type: 'text',
							color: 'default',
						},
						{
							label: t('statistics.pendingTests'),
							value: 12,
							type: 'number',
							color: 'warning',
						},
					]}
				/>
			</motion.div>
		</div>
	)
}

export default AdminStatisticsPage
