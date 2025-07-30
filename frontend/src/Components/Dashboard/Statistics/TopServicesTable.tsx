'use client'

import React from 'react'
import { motion } from 'motion/react'
import { BarChart3 } from 'lucide-react'
import FormatCurrency from '@/Components/FormatCurrency'
import { TopService } from '@/Interfaces/Statistics/Types/Statistics'
import { useLocale } from '@/Hooks/useLocale'

interface TopServicesTableProps {
	services: TopService[]
	title?: string
	className?: string
}

const TopServicesTable: React.FC<TopServicesTableProps> = ({
	services,
	title = 'Top Services',
	className = '',
}) => {
	const { t } = useLocale()

	if (!services || services.length === 0) {
		return (
			<div
				className={`bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 ${className}`}
			>
				<div className='flex items-center gap-2 mb-4'>
					<BarChart3 className='size-5 text-main' />
					<h3 className='text-lg font-semibold text-gray-800'>{title}</h3>
				</div>
				<div className='text-center py-8 text-gray-500'>
					{t('statistics.noServiceData')}
				</div>
			</div>
		)
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 ${className}`}
		>
			<div className='flex items-center gap-2 mb-4'>
				<BarChart3 className='size-5 text-main' />
				<h3 className='text-lg font-semibold text-gray-800'>{title}</h3>
			</div>

			<div className='overflow-x-auto'>
				<table className='w-full'>
					<thead>
						<tr className='border-b border-gray-200'>
							<th className='text-left py-3 px-2 text-sm font-medium text-gray-600'>
								{t('statistics.serviceName')}
							</th>
							<th className='text-center py-3 px-2 text-sm font-medium text-gray-600'>
								{t('statistics.bookings')}
							</th>
							<th className='text-center py-3 px-2 text-sm font-medium text-gray-600'>
								{t('statistics.revenue')}
							</th>
							<th className='text-center py-3 px-2 text-sm font-medium text-gray-600'>
								{t('statistics.rating')}
							</th>
							<th className='text-center py-3 px-2 text-sm font-medium text-gray-600'>
								{t('statistics.performance')}
							</th>
						</tr>
					</thead>
					<tbody>
						{services.map((service, index) => (
							<motion.tr
								key={service.serviceId}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.1 }}
								className='border-b border-gray-100 hover:bg-gray-50 transition-colors'
							>
								<td className='py-3 px-2'>
									<div className='max-w-[200px]'>
										<p className='font-medium text-gray-800 truncate'>
											{service.serviceName}
										</p>
										<p className='text-xs text-gray-500'>
											ID: {service.serviceId}
										</p>
									</div>
								</td>
								<td className='py-3 px-2 text-center'>
									<span className='font-medium text-gray-800'>
										{service.bookings.toLocaleString('en-US')}
									</span>
								</td>
								<td className='py-3 px-2 text-center'>
									<span className='font-medium text-green-600'>
										<FormatCurrency amount={service.revenue} />
									</span>
								</td>
								<td className='py-3 px-2 text-center'>
									<span className='font-medium text-gray-800'>
										{service.rating !== null && service.rating !== undefined
											? service.rating.toFixed(1)
											: 'N/A'}
									</span>
								</td>
								<td className='py-3 px-2 text-center'>
									<div className='flex items-center justify-center gap-2'>
										<div className='w-16 bg-gray-200 rounded-full h-2'>
											<div
												className='bg-main h-2 rounded-full'
												style={{
													width: `${service.rating ? service.rating * 20 : 0}%`,
												}}
											></div>
										</div>
										<span className='text-xs text-gray-500 w-8 text-left'>
											{service.rating ? Math.round(service.rating * 20) : 0}%
										</span>
									</div>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Summary Stats */}
			<div className='mt-6 pt-4 border-t border-gray-200'>
				<div className='grid grid-cols-3 gap-4 text-center'>
					<div>
						<p className='text-sm text-gray-600'>
							{t('statistics.totalBookings')}
						</p>
						<p className='text-lg font-semibold text-gray-800'>
							{services
								.reduce((sum, service) => sum + service.bookings, 0)
								.toLocaleString('en-US')}
						</p>
					</div>
					<div>
						<p className='text-sm text-gray-600'>
							{t('statistics.totalRevenue')}
						</p>
						<p className='text-lg font-semibold text-green-600'>
							<FormatCurrency
								amount={services.reduce(
									(sum, service) => sum + service.revenue,
									0
								)}
							/>
						</p>
					</div>
					<div>
						<p className='text-sm text-gray-600'>{t('statistics.avgRating')}</p>
						<p className='text-lg font-semibold text-gray-800'>
							{(
								services.reduce(
									(sum, service) => sum + (service.rating || 0),
									0
								) /
								services.filter(
									s => s.rating !== null && s.rating !== undefined
								).length
							).toFixed(1)}
						</p>
					</div>
				</div>
			</div>
		</motion.div>
	)
}

export default TopServicesTable
