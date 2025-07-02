'use client'
import AccountListContent from '@/Components/Management/AccountListContent'
import AddNewButton from '@/Components/Management/AddNewButton'
import SearchBar from '@/Components/Management/SearchBar'
import Pagination from '@/Components/Management/Pagination'
import clsx from 'clsx'
import React from 'react'
import AccountListHeader from '@/Components/Management/ItemCardHeader'
import { motion } from 'motion/react'
import { useAccountManagement } from '@/Hooks/useAccountManagement'

const AccountPage = () => {
	const handleAddNew = () => {
		// Navigate to account creation page or open a modal
		// For now, let's log to console as placeholder
		console.log('Add new account functionality to be implemented')
		// You could navigate to a new account form:
		// router.push('/dashboard/accounts/new')
		// Or open a modal for creating new accounts
	}

	const {
		accounts,
		totalCount,
		page,
		setPage,
		itemsPerPage,
		isLoading,
		isError,
		isFetching,
		handleDelete,
		handleRestore,
		handleUpdate,
	} = useAccountManagement()

	return (
		<motion.section
			className={clsx('flex h-full flex-col px-0 py-4 min-h-0')}
			aria-label='Account Management'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
		>
			{/* Header with Search and Add Button */}
			<motion.div
				className='flex items-center justify-between gap-4 px-4 mb-4'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
			>
				<div className='flex-1'>
					<motion.h1
						className='text-xl font-semibold text-slate-800 mb-1'
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
					>
						Quản lý tài khoản
					</motion.h1>
					<motion.p
						className='text-xs text-text'
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
					>
						Tìm kiếm và quản lý tài khoản người dùng
					</motion.p>
				</div>
				<motion.div
					className='flex items-center gap-3'
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
				>
					<SearchBar waitTime={1000} />
					<AddNewButton handleAddNew={handleAddNew} />
				</motion.div>
			</motion.div>

			{/* Content Area */}
			<motion.div
				className='flex-1 flex flex-col overflow-hidden min-h-0'
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
			>
				{/* Table Header */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.5 }}
				>
					<AccountListHeader
						label='Họ và Tên'
						secondaryLabel='Email'
						thirdLabel='Vai trò'
						fourthLabel='Ngày sinh'
						fifthLabel='Tác vụ'
					/>
				</motion.div>

				{/* Account List */}
				<motion.div
					className='flex-1 min-h-0'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.6 }}
				>
					<AccountListContent
						accounts={accounts}
						isLoading={isLoading}
						isError={isError}
						isFetching={isFetching}
						handleDelete={handleDelete}
						handleRestore={handleRestore}
						handleUpdate={handleUpdate}
					/>
				</motion.div>
			</motion.div>

			{/* Pagination - Fixed at bottom */}
			<motion.div
				className='center-all py-3 mt-auto'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.8 }}
			>
				<Pagination
					currentPage={page}
					isFetching={isFetching}
					setCurrentPage={setPage}
					totalCount={totalCount}
					itemsPerPage={itemsPerPage}
				/>
			</motion.div>
		</motion.section>
	)
}

export default AccountPage
