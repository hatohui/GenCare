'use client'

import { useAccountStore } from '@/Hooks/useAccount'
import { motion } from 'motion/react'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/Hooks/useLocale'
import {
	MoneySVG,
	UserSVG,
	DocumentSVG,
	CheckCircleSVG,
	XCircleSVG,
	ArrowRightSVG,
} from '@/Components/SVGs'
import LoadingIcon from '@/Components/LoadingIcon'

const StaffDashboard = () => {
	const { data, isLoading } = useAccountStore()
	const router = useRouter()
	const { t } = useLocale()

	if (isLoading) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<LoadingIcon className='size-8' />
			</div>
		)
	}

	// Mock data - replace with real API calls
	const stats = {
		totalAccounts: 156,
		pendingPayments: 23,
		completedPayments: 89,
		testResults: 45,
	}

	const recentActivity = [
		{
			id: 1,
			type: 'payment',
			message: t('dashboard.payment_success_for', { name: 'Nguyễn Thị A' }),
			time: t('dashboard.minutes_ago', { count: '2' }),
			status: 'success',
		},
		{
			id: 2,
			type: 'test',
			message: t('dashboard.test_result_ready', { name: 'Trần Văn B' }),
			time: t('dashboard.minutes_ago', { count: '15' }),
			status: 'success',
		},
		{
			id: 3,
			type: 'payment',
			message: t('dashboard.payment_failed_for', { name: 'Lê Thị C' }),
			time: t('dashboard.hour_ago', { count: '1' }),
			status: 'error',
		},
	]

	const quickActions = [
		{
			title: t('dashboard.payment_management'),
			description: t('dashboard.payment_management_desc'),
			icon: <MoneySVG className='size-6' />,
			path: '/dashboard/payments',
			color: 'bg-blue-500',
		},
		{
			title: t('dashboard.test_results'),
			description: t('dashboard.test_results_desc'),
			icon: <DocumentSVG className='size-6' />,
			path: '/dashboard/tests',
			color: 'bg-green-500',
		},
	]

	return (
		<div className='max-w-7xl mx-auto p-6'>
			{/* Welcome Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className='mb-8'
			>
				<h1 className='text-3xl font-bold text-main mb-2'>
					{t('dashboard.welcome_back', { name: data?.firstName || 'User' })}!
				</h1>
				<p className='text-gray-600'>{t('dashboard.overview_today')}</p>
			</motion.div>

			{/* Stats Cards */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'
			>
				<div className='bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-gray-600'>
								{t('dashboard.total_accounts')}
							</p>
							<p className='text-2xl font-bold text-main'>
								{stats.totalAccounts}
							</p>
						</div>
						<div className='p-3 bg-blue-100 rounded-full'>
							<UserSVG className='size-6 text-blue-600' />
						</div>
					</div>
				</div>

				<div className='bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-gray-600'>
								{t('dashboard.pending_payments')}
							</p>
							<p className='text-2xl font-bold text-yellow-600'>
								{stats.pendingPayments}
							</p>
						</div>
						<div className='p-3 bg-yellow-100 rounded-full'>
							<MoneySVG className='size-6 text-yellow-600' />
						</div>
					</div>
				</div>

				<div className='bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-gray-600'>
								{t('dashboard.completed_payments')}
							</p>
							<p className='text-2xl font-bold text-green-600'>
								{stats.completedPayments}
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
							<p className='text-sm text-gray-600'>
								{t('dashboard.test_results')}
							</p>
							<p className='text-2xl font-bold text-purple-600'>
								{stats.testResults}
							</p>
						</div>
						<div className='p-3 bg-purple-100 rounded-full'>
							<DocumentSVG className='size-6 text-purple-600' />
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
						{t('dashboard.quick_actions')}
					</h2>
					<div className='space-y-4'>
						{quickActions.map((action, index) => (
							<motion.button
								key={action.title}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.3 + index * 0.1 }}
								onClick={() => router.push(action.path)}
								className='w-full p-4 border border-gray-200 rounded-[15px] hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 text-left group'
							>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-4'>
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
									<ArrowRightSVG className='size-5 text-gray-400 group-hover:text-main transition-colors' />
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
						{t('dashboard.recent_activity')}
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
										activity.status === 'success'
											? 'bg-green-100 text-green-600'
											: 'bg-red-100 text-red-600'
									}`}
								>
									{activity.status === 'success' ? (
										<CheckCircleSVG className='size-4' />
									) : (
										<XCircleSVG className='size-4' />
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
		</div>
	)
}

export default StaffDashboard
