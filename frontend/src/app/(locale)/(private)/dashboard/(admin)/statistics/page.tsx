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

const getStatsCards = (t: any) => [
	{
		title: t('statistics.totalUsers'),
		value: (stat: any) => stat.totalActiveUsers.toLocaleString('en-US'),
		subtitle: t('statistics.registeredAccounts'),
		icon: Users,
		color: 'blue' as const,
		trend: {
			value: 12.5,
			isPositive: true,
			label: t('statistics.comparedToLastMonth'),
		},
		delay: 0.1,
	},
	{
		title: t('statistics.revenue'),
		value: (stat: any) => <FormatCurrency amount={stat.totalRevenue} />,
		subtitle: t('statistics.totalRevenue'),
		icon: DollarSign,
		color: 'green' as const,
		trend: {
			value: 8.3,
			isPositive: true,
			label: t('statistics.comparedToLastMonth'),
		},
		delay: 0.2,
	},
	{
		title: t('statistics.bookings'),
		value: (stat: any) => stat.totalBookings.toLocaleString('en-US'),
		subtitle: t('statistics.bookingCount'),
		icon: Calendar,
		color: 'purple' as const,
		trend: {
			value: 15.2,
			isPositive: true,
			label: t('statistics.comparedToLastMonth'),
		},
		delay: 0.3,
	},
	{
		title: t('statistics.services'),
		value: (stat: any) => stat.totalServices,
		subtitle: t('statistics.activeServices'),
		icon: Package,
		color: 'indigo' as const,
		delay: 0.4,
	},
]

const AdminStatisticsPage = () => {
	const { t } = useLocale()
	const [selectedPeriod, setSelectedPeriod] = useState<
		'week' | 'month' | 'year'
	>('month')
	const {
		data: statisticsData,
		isLoading,
		isError,
		refetch,
	} = useAdminStatistics()

	const statsCards = getStatsCards(t)

	const handleExportData = () => {
		// Implement export functionality
		console.log('Exporting data...')
	}

	if (isLoading && !statisticsData) return <LoadingStatistics />
	if (isError || !statisticsData) return <ErrorStatistics refetch={refetch} />

	const { dashboardStatistic } = statisticsData

	const filteredAndSortedTopServices = statisticsData.topServices
		.filter(service => service.bookings > 0)
		.sort((a, b) => b.bookings - a.bookings)

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
						onClick={() => refetch()}
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
							{period === 'week' && t('statistics.week')}
							{period === 'month' && t('statistics.month')}
							{period === 'year' && t('statistics.year')}
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
						{t('statistics.topServices')}
					</h3>
					<div className='space-y-4'>
						{filteredAndSortedTopServices.map((service, index) => (
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
										{service.bookings} {t('statistics.bookings')} •{' '}
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
					activities={filteredAndSortedTopServices.map(service => ({
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
					title={t('statistics.consultants')}
					value={statisticsData.dashboardStatistic.totalActiveConsultants}
					subtitle={t('statistics.activeConsultants')}
					icon={Users}
					color='yellow'
				/>
				<StatsCard
					title={t('statistics.pendingPayments')}
					value={statisticsData.dashboardStatistic.pendingPayments}
					subtitle={t('statistics.needsProcessing')}
					icon={Activity}
					color='red'
				/>
				<StatsCard
					title={t('statistics.testResults')}
					value={statisticsData.dashboardStatistic.testResults}
					subtitle={t('statistics.completed')}
					icon={TrendingUp}
					color='green'
				/>
			</motion.div>
		</div>
	)
}

export default AdminStatisticsPage
