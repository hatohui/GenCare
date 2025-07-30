'use client'

import { RevenueData } from '@/Interfaces/Statistics/Types/Statistics'
import { motion } from 'motion/react'
import React from 'react'
import FormatCurrency from '@/Components/FormatCurrency'
import { useLocale } from '@/Hooks/useLocale'
import {
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	ComposedChart,
	Bar,
	Line,
} from 'recharts'

interface RevenueChartProps {
	data: RevenueData[]
	period: 'week' | 'month' | 'year'
}

// Custom Tooltip Component
type CustomTooltipProps = {
	active?: boolean
	payload?: any[]
	label?: string
	period: RevenueChartProps['period']
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
	active,
	payload,
	label,
	period,
}) => {
	const { t, locale } = useLocale()

	if (!active || !payload?.length) return null

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const localeCode = locale === 'vi' ? 'vi-VN' : 'en-US'

		switch (period) {
			case 'week':
				return date.toLocaleDateString(localeCode, { weekday: 'long' })
			case 'month':
				return date.toLocaleDateString(localeCode, {
					day: 'numeric',
					month: 'long',
				})
			case 'year':
				return date.toLocaleDateString(localeCode, {
					month: 'long',
					year: 'numeric',
				})
			default:
				return date.toLocaleDateString(localeCode)
		}
	}

	return (
		<div className='bg-white p-3 border border-gray-200 rounded-lg shadow-lg'>
			<p className='text-sm font-medium text-gray-800 mb-2'>
				{formatDate(label ?? '')}
			</p>
			{payload.map((entry, index) => (
				<p key={index} className='text-sm' style={{ color: entry.color }}>
					{entry.dataKey === 'revenue' ? (
						<>
							{t('statistics.revenue')}:{' '}
							<span className='font-semibold'>
								<FormatCurrency amount={entry.value} />
							</span>
						</>
					) : (
						<>
							{t('statistics.bookings')}:{' '}
							<span className='font-semibold'>{entry.value}</span>
						</>
					)}
				</p>
			))}
		</div>
	)
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, period }) => {
	const { t, locale } = useLocale()

	if (!data || data.length === 0) {
		return (
			<div className='flex items-center justify-center h-64 bg-gray-50 rounded-[20px]'>
				<p className='text-gray-500'>{t('statistics.noRevenueData')}</p>
			</div>
		)
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const localeCode = locale === 'vi' ? 'vi-VN' : 'en-US'

		switch (period) {
			case 'week':
				return date.toLocaleDateString(localeCode, { weekday: 'short' })
			case 'month':
				return date.toLocaleDateString(localeCode, {
					day: 'numeric',
					month: 'short',
				})
			case 'year':
				return date.toLocaleDateString(localeCode, { month: 'short' })
			default:
				return date.toLocaleDateString(localeCode)
		}
	}

	// Format data for the chart
	const chartData = data.map(item => ({
		...item,
		formattedDate: formatDate(item.date),
	}))

	const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
	const totalBookings = data.reduce((sum, item) => sum + item.bookings, 0)

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className='bg-white rounded-[20px] p-6 shadow-sm border border-gray-100'
		>
			<div className='flex items-center justify-between mb-6'>
				<div>
					<h3 className='text-lg font-semibold text-gray-800'>
						{t('statistics.revenue')}
					</h3>
					<p className='text-sm text-gray-600'>
						{period === 'week' && t('statistics.thisWeek')}
						{period === 'month' && t('statistics.thisMonth')}
						{period === 'year' && t('statistics.thisYear')}
					</p>
				</div>
				<div className='text-right'>
					<p className='text-2xl font-bold text-main'>
						<FormatCurrency amount={totalRevenue} />
					</p>
					<p className='text-sm text-gray-600'>
						{t('statistics.totalRevenue')}
					</p>
				</div>
			</div>

			{/* Chart */}
			<div className='h-80'>
				<ResponsiveContainer width='100%' height='100%'>
					<ComposedChart
						data={chartData}
						margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
					>
						<CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
						<XAxis
							dataKey='formattedDate'
							tick={{ fontSize: 12, fill: '#6b7280' }}
							axisLine={false}
						/>
						<YAxis
							yAxisId='revenue'
							orientation='left'
							tick={{ fontSize: 12, fill: '#6b7280' }}
							axisLine={false}
							tickLine={false}
							tickFormatter={value => {
								if (value >= 1000000) {
									return `${(value / 1000000).toFixed(1)}M`
								} else if (value >= 1000) {
									return `${(value / 1000).toFixed(0)}K`
								}
								return value.toString()
							}}
						/>
						<YAxis
							yAxisId='bookings'
							orientation='right'
							tick={{ fontSize: 12, fill: '#6b7280' }}
							axisLine={false}
							tickLine={false}
						/>
						<Tooltip content={<CustomTooltip period={period} />} />
						<Bar
							yAxisId='revenue'
							dataKey='revenue'
							fill='#0ea5e9'
							radius={[4, 4, 0, 0]}
							opacity={0.8}
						/>
						<Line
							yAxisId='bookings'
							type='monotone'
							dataKey='bookings'
							stroke='#f97316'
							strokeWidth={3}
							dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
							activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2 }}
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</div>

			{/* Summary Stats */}
			<div className='grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100'>
				<div className='text-center'>
					<p className='text-2xl font-bold text-blue-600'>
						<FormatCurrency amount={totalRevenue} />
					</p>
					<p className='text-sm text-gray-600'>
						{t('statistics.totalRevenue')}
					</p>
				</div>
				<div className='text-center'>
					<p className='text-2xl font-bold text-orange-600'>{totalBookings}</p>
					<p className='text-sm text-gray-600'>
						{t('statistics.totalBookings')}
					</p>
				</div>
			</div>

			{/* Legend */}
			<div className='flex items-center justify-center gap-6 mt-4'>
				<div className='flex items-center gap-2'>
					<div className='w-3 h-3 bg-blue-500 rounded'></div>
					<span className='text-xs text-gray-600'>
						{t('statistics.revenue')}
					</span>
				</div>
				<div className='flex items-center gap-2'>
					<div className='w-3 h-3 bg-orange-500 rounded'></div>
					<span className='text-xs text-gray-600'>
						{t('statistics.bookings')}
					</span>
				</div>
			</div>
		</motion.div>
	)
}

export default RevenueChart
