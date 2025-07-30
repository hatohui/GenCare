'use client'

import { UserGrowthData } from '@/Interfaces/Statistics/Types/Statistics'
import { motion } from 'motion/react'
import React from 'react'
import { useLocale } from '@/Hooks/useLocale'
import {
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Area,
	AreaChart,
} from 'recharts'

interface UserGrowthChartProps {
	data: UserGrowthData[]
	period: 'week' | 'month' | 'year'
}

// Extend UserGrowthData locally to allow optional totalUsers for chart compatibility
interface UserGrowthChartData extends UserGrowthData {
	totalUsers?: number
}

const formatDate = (
	dateString: string,
	period: UserGrowthChartProps['period']
) => {
	const date = new Date(dateString)
	switch (period) {
		case 'week':
			return date.toLocaleDateString('en-US', { weekday: 'short' })
		case 'month':
			return date.toLocaleDateString('en-US', {
				day: 'numeric',
				month: 'short',
			})
		case 'year':
			return date.toLocaleDateString('en-US', { month: 'short' })
		default:
			return date.toLocaleDateString('en-US')
	}
}

type CustomTooltipProps = {
	active?: boolean
	payload?: any[]
	label?: string
	period: UserGrowthChartProps['period']
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
	active,
	payload,
	label,
	period,
}) => {
	const { t } = useLocale()

	if (!active || !payload?.length) return null
	return (
		<div className='bg-white p-3 border border-gray-200 rounded-lg shadow-lg'>
			<p className='text-sm font-medium text-gray-800'>
				{formatDate(label ?? '', period)}
			</p>
			<p className='text-sm text-blue-600'>
				{t('statistics.newUsers')}:{' '}
				<span className='font-semibold'>{payload[0]?.value ?? 'N/A'}</span>
			</p>
			{payload[1]?.value !== undefined && (
				<p className='text-sm text-green-600'>
					{t('statistics.totalUsers')}:{' '}
					<span className='font-semibold'>{payload[1].value}</span>
				</p>
			)}
		</div>
	)
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data, period }) => {
	const { t } = useLocale()
	const chartData = data as UserGrowthChartData[]

	const totalGrowth = React.useMemo(
		() => data.reduce((sum, item) => sum + item.newUsers, 0),
		[data]
	)
	const currentTotal = React.useMemo(
		() => chartData[chartData.length - 1]?.totalUsers ?? 0,
		[chartData]
	)

	if (!data || data.length === 0) {
		return (
			<div className='flex items-center justify-center h-64 bg-gray-50 rounded-[20px]'>
				<p className='text-gray-500'>{t('statistics.noUserGrowthData')}</p>
			</div>
		)
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className='bg-white rounded-[20px] p-6 shadow-sm border border-gray-100'
		>
			<div className='flex items-center justify-between mb-6'>
				<div>
					<h3 className='text-lg font-semibold text-gray-800'>
						{t('statistics.userGrowth')}
					</h3>
					<p className='text-sm text-gray-600'>
						{period === 'week' && t('statistics.thisWeek')}
						{period === 'month' && t('statistics.thisMonth')}
						{period === 'year' && t('statistics.thisYear')}
					</p>
				</div>
				<div className='text-right'>
					<p className='text-2xl font-bold text-main'>+{totalGrowth}</p>
					<p className='text-sm text-gray-600'>{t('statistics.newUsers')}</p>
				</div>
			</div>

			<div className='h-64'>
				<ResponsiveContainer width='100%' height='100%'>
					<AreaChart
						data={data}
						margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
					>
						<CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
						<XAxis
							dataKey='date'
							tickFormatter={d => formatDate(d, period)}
							tick={{ fontSize: 12, fill: '#6b7280' }}
						/>
						<YAxis
							tick={{ fontSize: 12, fill: '#6b7280' }}
							axisLine={false}
							tickLine={false}
						/>
						<Tooltip content={<CustomTooltip period={period} />} />
						<Area
							type='monotone'
							dataKey='newUsers'
							stackId='1'
							stroke='#3b82f6'
							fill='#3b82f6'
							fillOpacity={0.3}
							strokeWidth={2}
						/>
						{chartData.some(d => d.totalUsers !== undefined) && (
							<Area
								type='monotone'
								dataKey='totalUsers'
								stackId='2'
								stroke='#10b981'
								fill='#10b981'
								fillOpacity={0.1}
								strokeWidth={2}
							/>
						)}
					</AreaChart>
				</ResponsiveContainer>
			</div>

			{/* Summary Stats */}
			<div className='grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100'>
				<div className='text-center'>
					<p className='text-2xl font-bold text-blue-600'>{totalGrowth}</p>
					<p className='text-sm text-gray-600'>{t('statistics.newUsers')}</p>
				</div>
				<div className='text-center'>
					<p className='text-2xl font-bold text-green-600'>{currentTotal}</p>
					<p className='text-sm text-gray-600'>{t('statistics.totalUsers')}</p>
				</div>
			</div>

			{/* Legend */}
			<div className='flex items-center justify-center gap-6 mt-4'>
				<div className='flex items-center gap-2'>
					<div className='w-3 h-3 bg-blue-500 rounded'></div>
					<span className='text-xs text-gray-600'>
						{t('statistics.newUsers')}
					</span>
				</div>
				<div className='flex items-center gap-2'>
					<div className='w-3 h-3 bg-green-500 rounded'></div>
					<span className='text-xs text-gray-600'>
						{t('statistics.totalUsers')}
					</span>
				</div>
			</div>
		</motion.div>
	)
}

export default UserGrowthChart
