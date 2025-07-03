'use client'
import AccountListContent from '@/Components/Management/AccountListContent'
import AddNewButton from '@/Components/Management/AddNewButton'
import AddNewAccountForm from '@/Components/Management/AddNewAccountForm'
import SearchBar from '@/Components/Management/SearchBar'
import Pagination from '@/Components/Management/Pagination'
import clsx from 'clsx'
import React, { useState } from 'react'
import AccountListHeader from '@/Components/Management/ItemCardHeader'
import { motion, useReducedMotion } from 'motion/react'
import { useAccountManagement } from '@/Hooks/useAccountManagement'

const AccountPage = () => {
	const shouldReduceMotion = useReducedMotion()
	const [isAddModalOpen, setIsAddModalOpen] = useState(false)

	const handleAddNew = () => {
		setIsAddModalOpen(true)
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
		refetch,
	} = useAccountManagement()

	const handleAddSuccess = () => {
		refetch()
	}

	const handleCloseModal = () => {
		setIsAddModalOpen(false)
	}

	// Optimized animation props that respect motion preferences
	const getAnimationProps = (delay = 0) =>
		shouldReduceMotion
			? {}
			: {
					initial: { opacity: 0, y: 20 },
					animate: { opacity: 1, y: 0 },
					transition: { duration: 0.3, delay: delay * 0.05, ease: 'easeOut' },
			  }

	const getSlideAnimationProps = (
		direction: 'left' | 'right' | 'up' | 'down' = 'up',
		delay = 0
	) => {
		if (shouldReduceMotion) return {}

		const initialValues = {
			left: { opacity: 0, x: -20 },
			right: { opacity: 0, x: 20 },
			up: { opacity: 0, y: 20 },
			down: { opacity: 0, y: -20 },
		}

		const animateValues = {
			left: { opacity: 1, x: 0 },
			right: { opacity: 1, x: 0 },
			up: { opacity: 1, y: 0 },
			down: { opacity: 1, y: 0 },
		}

		return {
			initial: initialValues[direction],
			animate: animateValues[direction],
			transition: { duration: 0.3, delay: delay * 0.05, ease: 'easeOut' },
		}
	}

	return (
		<motion.section
			className={clsx('flex h-full flex-col px-0 py-4 min-h-0')}
			aria-label='Account Management'
			{...getAnimationProps(0)}
		>
			{/* Header with Search and Add Button */}
			<motion.div
				className='flex items-center justify-between gap-4 px-4 mb-4'
				{...getSlideAnimationProps('down', 1)}
			>
				<div className='flex-1'>
					<motion.h1
						className='text-xl font-semibold text-slate-800 mb-1'
						{...getSlideAnimationProps('left', 2)}
					>
						Quản lý tài khoản
					</motion.h1>
					<motion.p
						className='text-xs text-text'
						{...getSlideAnimationProps('left', 3)}
					>
						Tìm kiếm và quản lý tài khoản người dùng
					</motion.p>
				</div>
				<motion.div
					className='flex items-center gap-3'
					{...getSlideAnimationProps('right', 4)}
				>
					<SearchBar waitTime={500} />
					<AddNewButton handleAddNew={handleAddNew} />
				</motion.div>
			</motion.div>

			{/* Content Area */}
			<motion.div
				className='flex-1 flex flex-col overflow-hidden min-h-0'
				{...getAnimationProps(3)}
			>
				{/* Table Header */}
				<motion.div {...getAnimationProps(5)}>
					<AccountListHeader
						label='Họ và Tên'
						secondaryLabel='Email'
						thirdLabel='Vai trò'
						fourthLabel='Ngày sinh'
						fifthLabel='Tác vụ'
					/>
				</motion.div>

				{/* Account List */}
				<motion.div className='flex-1 min-h-0' {...getAnimationProps(6)}>
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
			<motion.div className='center-all py-3 mt-auto' {...getAnimationProps(8)}>
				<Pagination
					currentPage={page}
					isFetching={isFetching}
					setCurrentPage={setPage}
					totalCount={totalCount}
					itemsPerPage={itemsPerPage}
				/>
			</motion.div>

			{/* Add New Account Modal */}
			{isAddModalOpen && (
				<AddNewAccountForm
					onSuccess={handleAddSuccess}
					onClose={handleCloseModal}
				/>
			)}
		</motion.section>
	)
}

export default AccountPage
