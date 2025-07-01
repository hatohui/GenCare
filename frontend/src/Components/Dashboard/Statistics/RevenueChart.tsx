'use client'

import { RevenueData } from '@/Interfaces/Statistics/Types/Statistics'
import { motion } from 'motion/react'
import React from 'react'

interface RevenueChartProps {
	data: RevenueData[]
	period: 'week' | 'month' | 'year'
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, period }) => {
	if (!data || data.length === 0) {
		return (
			<div className='flex items-center justify-center h-64 bg-gray-50 rounded-[20px]'>
				<p className='text-gray-500'>Không có dữ liệu doanh thu</p>
			</div>
		)
	}

	const maxRevenue = Math.max(...data.map(d => d.revenue))
	const maxBookings = Math.max(...data.map(d => d.bookings))

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

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
			minimumFractionDigits: 0,
		}).format(amount)
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className='bg-white rounded-[20px] p-6 shadow-sm border border-gray-100'
		>
			<div className='flex items-center justify-between mb-6'>
				<div>
					<h3 className='text-lg font-semibold text-gray-800'>Doanh Thu</h3>
					<p className='text-sm text-gray-600'>
						{period === 'week' && 'Tuần này'}
						{period === 'month' && 'Tháng này'}
						{period === 'year' && 'Năm nay'}
					</p>
				</div>
				<div className='text-right'>
					<p className='text-2xl font-bold text-main'>
						{formatCurrency(data.reduce((sum, item) => sum + item.revenue, 0))}
					</p>
					<p className='text-sm text-gray-600'>Tổng doanh thu</p>
				</div>
			</div>

			<div className='space-y-4'>
				{/* Revenue Bars */}
				<div className='space-y-2'>
					<p className='text-sm font-medium text-gray-700'>Doanh thu</p>
					<div className='overflow-x-auto'>
						<div
							className='flex items-end gap-2 h-32'
							style={{ minWidth: `${data.length * 48}px` }}
						>
							{data.map((item, index) => (
								<div key={index} className='flex-1 flex flex-col items-center'>
									<div className='relative w-full'>
										<motion.div
											initial={{ height: 0 }}
											animate={{
												height: `${(item.revenue / maxRevenue) * 100}%`,
											}}
											transition={{ delay: index * 0.1, duration: 0.5 }}
											className='bg-gradient-to-t from-main to-main/80 rounded-t-lg min-h-[4px]'
										/>
									</div>
									<p className='text-xs text-gray-600 mt-2 text-center'>
										{formatDate(item.date)}
									</p>
									<p className='text-xs font-medium text-gray-800 mt-1'>
										{formatCurrency(item.revenue)}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Bookings Line */}
				<div className='space-y-2'>
					<p className='text-sm font-medium text-gray-700'>Số lượng đặt lịch</p>
					<div className='overflow-x-auto'>
						<div
							className='flex items-end gap-2 h-16'
							style={{ minWidth: `${data.length * 48}px` }}
						>
							{data.map((item, index) => (
								<div key={index} className='flex-1 flex flex-col items-center'>
									<div className='relative w-full'>
										<motion.div
											initial={{ height: 0 }}
											animate={{
												height: `${(item.bookings / maxBookings) * 100}%`,
											}}
											transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
											className='bg-gradient-to-t from-accent to-accent/80 rounded-t-lg min-h-[4px]'
										/>
									</div>
									<p className='text-xs text-gray-600 mt-2 text-center'>
										{item.bookings}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Legend */}
			<div className='flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100'>
				<div className='flex items-center gap-2'>
					<div className='w-3 h-3 bg-main rounded'></div>
					<span className='text-xs text-gray-600'>Doanh thu</span>
				</div>
				<div className='flex items-center gap-2'>
					<div className='w-3 h-3 bg-accent rounded'></div>
					<span className='text-xs text-gray-600'>Đặt lịch</span>
				</div>
			</div>
		</motion.div>
	)
}

export default RevenueChart
