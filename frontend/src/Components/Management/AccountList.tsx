'use client'

import React, { useEffect, useState } from 'react'
import ItemCard from './ItemCard'
import { ITEMS_PER_PAGE_COUNT } from '@/Constants/Management'
import {
	useDeleteAccount,
	useGetAccountsByPage,
	useUpdateAccount,
} from '@/Services/account-service'
import Pagination from './Pagination'
import { useSearchParams } from 'next/navigation'
import { Account } from '@/Interfaces/Auth/Types/Account'
import { toast } from 'react-hot-toast'
import ConfirmDialog from '../ConfirmationDialog'

const AccountList = () => {
	const [page, setPage] = useState<number>(1)
	const itemsPerPage = ITEMS_PER_PAGE_COUNT
	const searchParams = useSearchParams()
	const search = searchParams?.get('search')
	const accountDeleteMutate = useDeleteAccount()
	const query = useGetAccountsByPage(
		itemsPerPage,
		page ? page : 1,
		search ?? null
	)
	const updateAccountMutation = useUpdateAccount()

	// Confirmation dialog states
	const [deleteDialog, setDeleteDialog] = useState<{
		isOpen: boolean
		accountId: string
		accountName: string
	}>({
		isOpen: false,
		accountId: '',
		accountName: '',
	})

	const [restoreDialog, setRestoreDialog] = useState<{
		isOpen: boolean
		accountId: string
		accountName: string
		accountData: Account | null
	}>({
		isOpen: false,
		accountId: '',
		accountName: '',
		accountData: null,
	})

	const { isLoading, isError, isFetching, data } = query

	console.log(data)

	useEffect(() => {
		setPage(1)
	}, [search])

	const handleDelete = (id: string) => {
		// Find the account to get its name for the confirmation dialog
		const account = data?.accounts?.find(acc => acc.id === id)
		const accountName = account
			? `${account.firstName} ${account.lastName}`
			: 'this account'

		setDeleteDialog({
			isOpen: true,
			accountId: id,
			accountName,
		})
	}

	const confirmDelete = () => {
		accountDeleteMutate.mutate(deleteDialog.accountId, {
			onSuccess: () => {
				query.refetch()
				toast.success('Account deleted successfully')
				setDeleteDialog({ isOpen: false, accountId: '', accountName: '' })
			},
			onError: error => {
				console.error('Failed to delete account:', error)
				toast.error('Failed to delete account')
				setDeleteDialog({ isOpen: false, accountId: '', accountName: '' })
			},
		})
	}

	const handleRestore = (id: string, data: Account) => {
		const accountName = `${data.firstName} ${data.lastName}`

		setRestoreDialog({
			isOpen: true,
			accountId: id,
			accountName,
			accountData: data,
		})
	}

	const confirmRestore = () => {
		if (!restoreDialog.accountData) return

		updateAccountMutation.mutate(
			{
				id: restoreDialog.accountId,
				data: { account: { ...restoreDialog.accountData, isDeleted: false } },
			},
			{
				onSuccess: () => {
					query.refetch()
					toast.success('Account restored successfully')
					setRestoreDialog({
						isOpen: false,
						accountId: '',
						accountName: '',
						accountData: null,
					})
				},
				onError: error => {
					console.error('Failed to restore account:', error)
					toast.error('Failed to restore account')
					setRestoreDialog({
						isOpen: false,
						accountId: '',
						accountName: '',
						accountData: null,
					})
				},
			}
		)
	}

	return (
		<>
			{/* Show loading state */}
			{(isFetching || isLoading) && (
				<div className='flex-1 flex items-center justify-center pt-20'>
					<div className='text-center'>
						<div className='animate-pulse text-lg font-medium text-slate-700'>
							Đang tải dữ liệu...
						</div>
					</div>
				</div>
			)}

			{/* Show error state */}
			{isError && !isFetching && !isLoading && (
				<div className='flex-1 flex items-center justify-center pt-20'>
					<div className='text-center text-red-500 font-medium'>
						Internal Server Error.
					</div>
				</div>
			)}

			{/* Show empty state */}
			{data?.accounts &&
				data.accounts.length === 0 &&
				!isLoading &&
				!isFetching &&
				!isError && (
					<div className='flex-1 flex items-center justify-center pt-20'>
						<div className='text-center text-slate-500'>No data found.</div>
					</div>
				)}

			{/* Show content */}
			{!isFetching &&
				!isLoading &&
				!isError &&
				data?.accounts &&
				data.accounts.length > 0 && (
					<div
						className='flex-1 overflow-y-scroll scroll-bar'
						style={{
							maskImage:
								'linear-gradient(to bottom, transparent 0px, black 20px, black calc(100% - 20px), transparent 100%)',
							WebkitMaskImage:
								'linear-gradient(to bottom, transparent 0px, black 20px, black calc(100% - 20px), transparent 100%)',
						}}
					>
						<div className='flex flex-col gap-3 px-2 py-1' role='list'>
							{data.accounts.map((account, key) => (
								<ItemCard<Account>
									id={account.id}
									data={account}
									delay={key}
									key={account.id}
									label={`${account.firstName} ${account.lastName}`}
									secondaryLabel={account.email}
									status={account.isDeleted ? 'FAILED' : 'SUCCESS'}
									thirdLabel={account.dateOfBirth}
									fourthLabel={account.role.name}
									path='/dashboard/accounts/'
									handleDelete={handleDelete}
									handleRestore={handleRestore}
									isActive={account.isDeleted}
								/>
							))}
						</div>
					</div>
				)}

			{/* Pagination - only show when there's content or when not loading */}
			{!isFetching && !isLoading && data && (
				<div className='center-all'>
					<Pagination
						currentPage={page}
						isFetching={isFetching}
						setCurrentPage={setPage}
						totalCount={data?.totalCount || 0}
						itemsPerPage={itemsPerPage}
					/>
				</div>
			)}

			{/* Delete Confirmation Dialog */}
			<ConfirmDialog
				isOpen={deleteDialog.isOpen}
				title='Xác nhận xóa tài khoản'
				message={`Bạn có chắc chắn muốn xóa tài khoản "${deleteDialog.accountName}"? Hành động này có thể được hoàn tác sau.`}
				onConfirm={confirmDelete}
				onCancel={() =>
					setDeleteDialog({ isOpen: false, accountId: '', accountName: '' })
				}
				confirmButtonVariant='danger'
				confirmButtonText='Xóa'
				cancelButtonText='Hủy'
			/>

			{/* Restore Confirmation Dialog */}
			<ConfirmDialog
				isOpen={restoreDialog.isOpen}
				title='Xác nhận khôi phục tài khoản'
				message={`Bạn có chắc chắn muốn khôi phục tài khoản "${restoreDialog.accountName}"?`}
				onConfirm={confirmRestore}
				onCancel={() =>
					setRestoreDialog({
						isOpen: false,
						accountId: '',
						accountName: '',
						accountData: null,
					})
				}
				confirmButtonVariant='primary'
				confirmButtonText='Khôi phục'
				cancelButtonText='Hủy'
			/>
		</>
	)
}

export default AccountList
