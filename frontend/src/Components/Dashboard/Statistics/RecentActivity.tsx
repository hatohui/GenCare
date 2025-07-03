'use client'

import type { RecentActivity as RecentActivityType } from '@/Interfaces/Statistics/Types/Statistics'
import { motion } from 'motion/react'
import React from 'react'
import {
	Calendar,
	CreditCard,
	FileText,
	User,
	Package,
	CheckCircle,
	XCircle,
	AlertCircle,
	Info,
} from 'lucide-react'

interface RecentActivityProps {
	activities: RecentActivityType[]
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
	const getActivityIcon = (type: RecentActivityType['type']) => {
		switch (type) {
			case 'booking':
				return Calendar
			case 'payment':
				return CreditCard
			case 'test':
				return FileText
			case 'user':
				return User
			case 'service':
				return Package
			default:
				return Info
		}
	}

	const getStatusIcon = (status: RecentActivityType['status']) => {
		switch (status) {
			case 'success':
				return CheckCircle
			case 'error':
				return XCircle
			case 'warning':
				return AlertCircle
			case 'info':
				return Info
			default:
				return Info
		}
	}

	const getStatusColor = (status: RecentActivityType['status']) => {
		switch (status) {
			case 'success':
				return 'text-green-600 bg-green-100'
			case 'error':
				return 'text-red-600 bg-red-100'
			case 'warning':
				return 'text-yellow-600 bg-yellow-100'
			case 'info':
				return 'text-blue-600 bg-blue-100'
			default:
				return 'text-gray-600 bg-gray-100'
		}
	}

	const formatTime = (timestamp: string) => {
		try {
			const date = new Date(timestamp)
			if (isNaN(date.getTime())) {
				return 'Thời gian không hợp lệ'
			}
			const now = new Date()
			const diffInMinutes = Math.floor(
				(now.getTime() - date.getTime()) / (1000 * 60)
			)

			if (diffInMinutes < 1) return 'Vừa xong'
			if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
			if (diffInMinutes < 1440)
				return `${Math.floor(diffInMinutes / 60)} giờ trước`
			return date.toLocaleDateString('en-US')
		} catch (error) {
			console.error('Error formatting time:', error)
			return 'Thời gian không hợp lệ'
		}
	}

	if (!activities || activities.length === 0) {
		return (
			<div className='flex items-center justify-center h-64 bg-gray-50 rounded-[20px]'>
				<p className='text-gray-500'>Không có hoạt động gần đây</p>
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
				<h3 className='text-lg font-semibold text-gray-800'>
					Hoạt Động Gần Đây
				</h3>
				<button className='text-sm text-main hover:text-main/80 transition-colors'>
					Xem tất cả
				</button>
			</div>

			<div className='space-y-4'>
				{activities.slice(0, 8).map((activity, index) => {
					const ActivityIcon = getActivityIcon(activity.type)
					const StatusIcon = getStatusIcon(activity.status)
					const statusColor = getStatusColor(activity.status)

					return (
						<motion.div
							key={activity.id}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.1 }}
							className='flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'
						>
							<div className={`p-2 rounded-full ${statusColor}`}>
								<ActivityIcon className='size-4' />
							</div>

							<div className='flex-1 min-w-0'>
								<p className='text-sm text-gray-800 mb-1'>{activity.message}</p>
								<div className='flex items-center gap-2 text-xs text-gray-500'>
									<span>{formatTime(activity.timestamp)}</span>
									{activity.userName && (
										<>
											<span>•</span>
											<span>{activity.userName}</span>
										</>
									)}
								</div>
							</div>

							<div className={`p-1 rounded-full ${statusColor}`}>
								<StatusIcon className='size-3' />
							</div>
						</motion.div>
					)
				})}
			</div>

			{activities.length > 8 && (
				<div className='mt-4 pt-4 border-t border-gray-100'>
					<button className='w-full text-sm text-main hover:text-main/80 transition-colors'>
						Xem thêm {activities.length - 8} hoạt động khác
					</button>
				</div>
			)}
		</motion.div>
	)
}

export default RecentActivity
