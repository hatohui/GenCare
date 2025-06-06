import clsx from 'clsx'
import { motion } from 'motion/react'
import React from 'react'
import { PreviousSVG, NextSVG } from '../SVGs'

export type PaginationProps = {
	currentPage: number
	isFetching: boolean
	setCurrentPage: React.Dispatch<React.SetStateAction<number>>
	totalPages: number
}

const Pagination = ({
	currentPage,
	isFetching,
	setCurrentPage,
	totalPages,
}: PaginationProps) => {
	return (
		<nav aria-label='Pagination' className='flex justify-center mx-6 gap-4'>
			<motion.button
				onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
				disabled={currentPage === 1 || isFetching}
				aria-label='Previous page'
				whileHover={{ scale: currentPage !== 1 ? 1.05 : 1 }}
				transition={{ duration: 0.2 }}
				className={`p-2 rounded-md ${
					currentPage === 1
						? 'text-gray-400 cursor-default'
						: 'text-gray-800 hover:bg-gray-200'
				}`}
			>
				<PreviousSVG />
			</motion.button>

			{/* Page Numbers */}
			<div className='flex gap-2'>
				{Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
					<motion.button
						key={pageNumber}
						onClick={() => setCurrentPage(pageNumber)}
						className={clsx(
							'px-3 py-1 rounded-md transition-all z-10 duration-200',
							currentPage === pageNumber ? 'bg-accent' : 'text-gray-800'
						)}
						aria-current={currentPage === pageNumber ? 'page' : undefined}
						whileHover={{ opacity: 0.7 }}
						transition={{ duration: 0.2 }}
						disabled={currentPage === pageNumber}
					>
						{pageNumber}c
					</motion.button>
				))}
			</div>

			<motion.button
				onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
				disabled={currentPage === totalPages || isFetching}
				aria-label='Next page'
				whileHover={{ scale: currentPage !== totalPages ? 1.05 : 1 }}
				transition={{ duration: 0.2 }}
				className={`p-2 rounded-md ${
					currentPage === totalPages
						? 'text-gray-400 cursor-default'
						: 'text-gray-800 hover:bg-gray-200'
				}`}
			>
				<NextSVG />
			</motion.button>
		</nav>
	)
}

export default Pagination
