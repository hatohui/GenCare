'use client'

import React from 'react'
import { motion } from 'motion/react'
import { LucideIcon } from 'lucide-react'
import FormatCurrency from '@/Components/FormatCurrency'

interface StatisticsTableProps {
	title: string
	icon: LucideIcon
	data: Array<{
		label: string
		value: string | number | React.ReactNode
		type?: 'currency' | 'number' | 'percentage' | 'text'
		color?: 'default' | 'success' | 'warning' | 'error' | 'info'
	}>
	className?: string
}

const StatisticsTable: React.FC<StatisticsTableProps> = ({
	title,
	icon: Icon,
	data,
	className = '',
}) => {
	const getValueColor = (color?: string) => {
		switch (color) {
			case 'success':
				return 'text-green-600'
			case 'warning':
				return 'text-yellow-600'
			case 'error':
				return 'text-red-600'
			case 'info':
				return 'text-blue-600'
			default:
				return 'text-gray-800'
		}
	}

	const formatValue = (
		value: string | number | React.ReactNode,
		type?: string
	) => {
		if (typeof value === 'number') {
			switch (type) {
				case 'currency':
					return <FormatCurrency amount={value} />
				case 'percentage':
					return `${value}%`
				case 'number':
					return value.toLocaleString('en-US')
				default:
					return value
			}
		}
		return value
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 ${className}`}
		>
			<div className='flex items-center gap-2 mb-4'>
				<Icon className='size-5 text-main' />
				<h3 className='text-lg font-semibold text-gray-800'>{title}</h3>
			</div>

			<div className='overflow-x-auto'>
				<table className='w-full'>
					<thead>
						<tr className='border-b border-gray-200'>
							<th className='text-left py-3 px-2 text-sm font-medium text-gray-600'>
								Metric
							</th>
							<th className='text-right py-3 px-2 text-sm font-medium text-gray-600'>
								Value
							</th>
						</tr>
					</thead>
					<tbody>
						{data.map((item, index) => (
							<motion.tr
								key={index}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.05 }}
								className='border-b border-gray-100 hover:bg-gray-50 transition-colors'
							>
								<td className='py-3 px-2 text-sm text-gray-600'>
									{item.label}
								</td>
								<td
									className={`py-3 px-2 text-sm font-medium text-right ${getValueColor(
										item.color
									)}`}
								>
									{formatValue(item.value, item.type)}
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
	)
}

export default StatisticsTable
