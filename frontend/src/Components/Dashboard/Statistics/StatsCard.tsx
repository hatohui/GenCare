'use client'

import { motion } from 'motion/react'
import React, { useState } from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
	title: string
	value: string | number
	subtitle?: string
	icon: LucideIcon
	trend?: {
		value: number
		isPositive: boolean
		label: string
	}
	color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'indigo'
	delay?: number
}

const StatsCard: React.FC<StatsCardProps> = ({
	title,
	value,
	subtitle,
	icon: Icon,
	trend,
	color = 'blue',
	delay = 0,
}) => {
	const colorClasses = {
		blue: {
			bg: 'bg-blue-100',
			text: 'text-blue-600',
			icon: 'text-blue-600',
		},
		green: {
			bg: 'bg-green-100',
			text: 'text-green-600',
			icon: 'text-green-600',
		},
		yellow: {
			bg: 'bg-yellow-100',
			text: 'text-yellow-600',
			icon: 'text-yellow-600',
		},
		purple: {
			bg: 'bg-purple-100',
			text: 'text-purple-600',
			icon: 'text-purple-600',
		},
		red: {
			bg: 'bg-red-100',
			text: 'text-red-600',
			icon: 'text-red-600',
		},
		indigo: {
			bg: 'bg-indigo-100',
			text: 'text-indigo-600',
			icon: 'text-indigo-600',
		},
	}

	const classes = colorClasses[color]
	const [showModal, setShowModal] = useState(false)

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay }}
				className='bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-all duration-300 group min-w-0 cursor-pointer'
				onClick={() => setShowModal(true)}
			>
				<div className='flex items-center justify-between min-w-0'>
					<div className='flex-1 min-w-0'>
						<p className='text-sm text-gray-600 mb-1 truncate'>{title}</p>
						<div className='flex items-baseline gap-2 min-w-0'>
							<p
								className={`text-2xl font-bold ${classes.text} truncate break-words max-w-full`}
								style={{ wordBreak: 'break-word' }}
							>
								{value}
							</p>
							{trend && (
								<div className='flex items-center gap-1'>
									<span
										className={`text-xs font-medium ${
											trend.isPositive ? 'text-green-600' : 'text-red-600'
										}`}
									>
										{trend.isPositive ? '+' : ''}
										{trend.value}%
									</span>
									<span className='text-xs text-gray-500'>{trend.label}</span>
								</div>
							)}
						</div>
						{subtitle && (
							<p className='text-sm text-gray-500 mt-1 truncate'>{subtitle}</p>
						)}
					</div>
					<div
						className={`p-3 rounded-full ${classes.bg} group-hover:scale-110 transition-transform duration-300`}
					>
						<Icon className={`size-6 ${classes.icon}`} />
					</div>
				</div>
			</motion.div>
			{showModal && (
				<div
					className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-40'
					onClick={() => setShowModal(false)}
				>
					<div
						className='bg-white rounded-xl shadow-lg p-6 min-w-[280px] max-w-[90vw]'
						onClick={e => e.stopPropagation()}
					>
						<h2 className='text-lg font-semibold mb-2 text-gray-800'>
							{title}
						</h2>
						<p className={`text-2xl font-bold ${classes.text} break-words`}>
							{value}
						</p>
						{subtitle && (
							<p className='text-sm text-gray-500 mt-2'>{subtitle}</p>
						)}
						<button
							className='mt-4 px-4 py-2 bg-main text-white rounded-lg hover:bg-main/90 transition-colors'
							onClick={() => setShowModal(false)}
						>
							Đóng
						</button>
					</div>
				</div>
			)}
		</>
	)
}

export default StatsCard
