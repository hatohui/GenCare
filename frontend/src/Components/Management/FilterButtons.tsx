'use client'

import React from 'react'
import clsx from 'clsx'
import { motion } from 'motion/react'

interface FilterButtonsProps {
	includeDeleted: boolean | null
	orderByPrice: boolean | null
	sortByAlphabetical: boolean
	setIncludeDeleted: (value: boolean | null) => void
	handlePriceSorting: () => void
	handleAlphabeticalSorting: () => void
}

const FilterButtons = ({
	includeDeleted,
	orderByPrice,
	sortByAlphabetical,
	setIncludeDeleted,
	handlePriceSorting,
	handleAlphabeticalSorting,
}: FilterButtonsProps) => {
	const filterButtons = [
		{
			label: 'Tất cả',
			active: includeDeleted === null,
			onClick: () => setIncludeDeleted(null),
		},
		{
			label: 'Đang hoạt động',
			active: includeDeleted === false,
			onClick: () => setIncludeDeleted(false),
		},
		{
			label: 'Ngừng hoạt động',
			active: includeDeleted === true,
			onClick: () => setIncludeDeleted(true),
		},
	]

	const getPriceSortLabel = () => {
		if (orderByPrice === null) return 'Sắp xếp giá (Tắt)'
		return orderByPrice ? 'Giá tăng dần ↑' : 'Giá giảm dần ↓'
	}

	return (
		<motion.div
			className='flex flex-wrap gap-3 px-4'
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			{/* Status filters */}
			{filterButtons.map((button, index) => (
				<motion.button
					key={button.label}
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.3, delay: 0.1 * index }}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={button.onClick}
					className={clsx(
						'flex items-center px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md',
						button.active
							? 'bg-main text-white shadow-main/30'
							: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
					)}
				>
					{button.label}
				</motion.button>
			))}

			{/* Price sorting */}
			<motion.button
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3, delay: 0.3 }}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={handlePriceSorting}
				className={clsx(
					'flex items-center px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md',
					orderByPrice !== null
						? 'bg-secondary text-white shadow-secondary/30'
						: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
				)}
			>
				{getPriceSortLabel()}
			</motion.button>

			{/* Alphabetical sorting */}
			<motion.button
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3, delay: 0.4 }}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={handleAlphabeticalSorting}
				className={clsx(
					'flex items-center px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md',
					sortByAlphabetical
						? 'bg-accent text-white shadow-accent/30'
						: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
				)}
			>
				{sortByAlphabetical ? 'A → Z' : 'Sắp xếp ABC'}
			</motion.button>
		</motion.div>
	)
}

export default FilterButtons
