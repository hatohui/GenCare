'use client'

import { useGetAccountsByPageStaff } from '@/Services/account-service'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Pagination from '../Management/Pagination'
import AccountItem from './AccountItem'
import LoadingIcon from '../LoadingIcon'
import { UserSVG } from '../SVGs'
import { useLocale } from '@/Hooks/useLocale'

const AccountList = () => {
	const { t } = useLocale()
	const searchParams = useSearchParams()
	const [page, setPage] = useState<number>(1)
	const [search, setSearch] = useState<string>('')
	const itemsPerPage = 6

	useEffect(() => {
		setSearch(searchParams?.get('search') || '')
		// Reset to first page when search changes
		setPage(1)
	}, [searchParams])

	const { isFetching, data, error } = useGetAccountsByPageStaff(
		itemsPerPage,
		page ? page : 0,
		search
	)

	const pageCount = data?.totalCount
		? Math.ceil(data.totalCount / itemsPerPage)
		: 0

	// Loading state
	if (isFetching && !data) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='text-center'>
					<LoadingIcon className='mx-auto mb-4 size-8' />
					<p className='text-gray-600'>{t('staff.loading_accounts')}</p>
				</div>
			</div>
		)
	}

	// Error state
	if (error) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='text-center max-w-md mx-auto p-6'>
					<div className='text-red-500 text-6xl mb-4'>⚠️</div>
					<h3 className='text-xl font-semibold text-gray-800 mb-2'>
						{t('staff.load_accounts_failed')}
					</h3>
					<p className='text-gray-600 mb-4'>
						{t('staff.load_accounts_error_description')}
					</p>
					<button
						onClick={() => window.location.reload()}
						className='bg-main hover:bg-main/90 text-white px-6 py-3 rounded-[30px] font-medium transition-colors'
					>
						{t('common.try_again')}
					</button>
				</div>
			</div>
		)
	}

	// Empty state
	if (!data?.accounts || data.accounts.length === 0) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='text-center max-w-md mx-auto p-6'>
					<div className='text-gray-400 text-6xl mb-4'>
						<UserSVG className='mx-auto size-16' />
					</div>
					<h3 className='text-xl font-semibold text-gray-800 mb-2'>
						{t('staff.no_accounts_found')}
					</h3>
					<p className='text-gray-600 mb-6'>
						{search
							? t('staff.no_accounts_search', { search })
							: t('staff.no_accounts')}
					</p>
					{search && (
						<button
							onClick={() => {
								const url = new URL(window.location.href)
								url.searchParams.delete('search')
								window.history.replaceState({}, '', url.toString())
							}}
							className='bg-main hover:bg-main/90 text-white px-6 py-3 rounded-[30px] font-medium transition-colors'
						>
							{t('staff.clear_search_filter')}
						</button>
					)}
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			{/* Stats */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className='grid grid-cols-1 md:grid-cols-3 gap-4'
			>
				<div className='bg-white border border-gray-200 rounded-[20px] p-4 text-center'>
					<div className='text-2xl font-bold text-main'>{data.totalCount}</div>
					<div className='text-sm text-gray-600'>
						{t('staff.total_accounts')}
					</div>
				</div>
				<div className='bg-white border border-gray-200 rounded-[20px] p-4 text-center'>
					<div className='text-2xl font-bold text-blue-600'>
						{data.accounts.length}
					</div>
					<div className='text-sm text-gray-600'>{t('staff.current_page')}</div>
				</div>
				<div className='bg-white border border-gray-200 rounded-[20px] p-4 text-center'>
					<div className='text-2xl font-bold text-green-600'>{pageCount}</div>
					<div className='text-sm text-gray-600'>{t('staff.total_pages')}</div>
				</div>
			</motion.div>

			{/* Account Grid */}
			<div className='relative'>
				{isFetching && (
					<div className='absolute inset-0 bg-white/50 flex items-center justify-center rounded-[20px] z-10'>
						<LoadingIcon className='size-6' />
					</div>
				)}

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					<AnimatePresence mode='wait'>
						{data.accounts.map((item, index) => (
							<motion.div
								key={item.id}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								transition={{
									duration: 0.3,
									delay: index * 0.1,
								}}
							>
								<AccountItem item={item} />
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			</div>

			{/* Pagination */}
			{pageCount > 1 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className='flex justify-center'
				>
					<Pagination
						currentPage={page}
						isFetching={isFetching}
						setCurrentPage={setPage}
						totalCount={data?.totalCount ?? 0}
						itemsPerPage={itemsPerPage}
					/>
				</motion.div>
			)}
		</div>
	)
}

export default AccountList
