'use client'

import { UserGrowthData } from '@/Interfaces/Statistics/Types/Statistics'
import { motion } from 'motion/react'
import React from 'react'
import {
	LineChart,
	Line,
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

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data, period }) => {
	if (!data || data.length === 0) {
		return (
			<div className='flex items-center justify-center h-64 bg-gray-50 rounded-[20px]'>
				<p className='text-gray-500'>Không có dữ liệu tăng trưởng người dùng</p>
			</div>
		)
	}

	const formatDate = (dateString: string) => {
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

	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className='bg-white p-3 border border-gray-200 rounded-lg shadow-lg'>
					<p className='text-sm font-medium text-gray-800'>
						{formatDate(label)}
					</p>
					<p className='text-sm text-blue-600'>
						Người dùng mới:{' '}
						<span className='font-semibold'>{payload[0].value}</span>
					</p>
					<p className='text-sm text-green-600'>
						Tổng người dùng:{' '}
						<span className='font-semibold'>{payload[1].value}</span>
					</p>
				</div>
			)
		}
		return null
	}

	const totalGrowth = data.reduce((sum, item) => sum + item.newUsers, 0)
	const currentTotal = data[data.length - 1]?.totalUsers || 0

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className='bg-white rounded-[20px] p-6 shadow-sm border border-gray-100'
		>
			<div className='flex items-center justify-between mb-6'>
				<div>
					<h3 className='text-lg font-semibold text-gray-800'>
						Tăng Trưởng Người Dùng
					</h3>
					<p className='text-sm text-gray-600'>
						{period === 'week' && 'Tuần này'}
						{period === 'month' && 'Tháng này'}
						{period === 'year' && 'Năm nay'}
					</p>
				</div>
				<div className='text-right'>
					<p className='text-2xl font-bold text-main'>+{totalGrowth}</p>
					<p className='text-sm text-gray-600'>Người dùng mới</p>
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
							tickFormatter={formatDate}
							tick={{ fontSize: 12, fill: '#6b7280' }}
						/>
						<YAxis
							tick={{ fontSize: 12, fill: '#6b7280' }}
							axisLine={false}
							tickLine={false}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Area
							type='monotone'
							dataKey='newUsers'
							stackId='1'
							stroke='#3b82f6'
							fill='#3b82f6'
							fillOpacity={0.3}
							strokeWidth={2}
						/>
						<Area
							type='monotone'
							dataKey='totalUsers'
							stackId='2'
							stroke='#10b981'
							fill='#10b981'
							fillOpacity={0.1}
							strokeWidth={2}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>

			{/* Summary Stats */}
			<div className='grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100'>
				<div className='text-center'>
					<p className='text-2xl font-bold text-blue-600'>{totalGrowth}</p>
					<p className='text-sm text-gray-600'>Người dùng mới</p>
				</div>
				<div className='text-center'>
					<p className='text-2xl font-bold text-green-600'>{currentTotal}</p>
					<p className='text-sm text-gray-600'>Tổng người dùng</p>
				</div>
			</div>

			{/* Legend */}
			<div className='flex items-center justify-center gap-6 mt-4'>
				<div className='flex items-center gap-2'>
					<div className='w-3 h-3 bg-blue-500 rounded'></div>
					<span className='text-xs text-gray-600'>Người dùng mới</span>
				</div>
				<div className='flex items-center gap-2'>
					<div className='w-3 h-3 bg-green-500 rounded'></div>
					<span className='text-xs text-gray-600'>Tổng người dùng</span>
				</div>
			</div>
		</motion.div>
	)
}

export default UserGrowthChart
