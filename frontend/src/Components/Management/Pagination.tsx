import clsx from 'clsx'
import { motion } from 'motion/react'
import React, { Fragment } from 'react'
import { PreviousSVG, NextSVG } from '../SVGs'
import { getPageNumbers } from '@/Utils/getPageNumbers'

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
		<nav
			aria-label='Pagination'
			className='flex justify-around px-2 py-2 w-md gap-4'
		>
			<motion.button
				onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
				disabled={currentPage <= 1 || isFetching}
				aria-label='Previous page'
				whileHover={{ scale: currentPage !== 1 ? 1.05 : 1 }}
				transition={{ duration: 0.2 }}
				className={`px-1 rounded-md border ${
					currentPage <= 1
						? 'text-gray-400 cursor-default'
						: 'text-gray-800 hover:bg-gray-200'
				}`}
			>
				<PreviousSVG />
			</motion.button>

			<div className='flex gap-2 select-none'>
				{getPageNumbers(totalPages, currentPage).map((page, idx) => (
					<Fragment key={idx}>
						{typeof page === 'number' ? (
							<motion.button
								onClick={() => setCurrentPage(page)}
								className={clsx(
									'rounded-md border w-8 h-7 transition-all z-10 duration-200',
									currentPage === page
										? 'bg-accent text-white'
										: 'text-gray-800'
								)}
								aria-current={currentPage === page ? 'page' : undefined}
								whileHover={{ opacity: 0.7 }}
								transition={{ duration: 0.2 }}
								disabled={currentPage === page}
							>
								{page}
							</motion.button>
						) : (
							<span className='px-2 text-gray-500'>…</span>
						)}
					</Fragment>
				))}
			</div>

			<motion.button
				onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
				disabled={currentPage >= totalPages || isFetching}
				aria-label='Next page'
				whileHover={{ scale: currentPage !== totalPages ? 1.05 : 1 }}
				transition={{ duration: 0.2 }}
				className={`px-1 rounded-md border ${
					currentPage >= totalPages
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
