import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ITEMS_PER_PAGE_COUNT } from '@/Constants/Management'
import {
	useDeleteAccount,
	useGetAccountsByPage,
	useUpdateAccount,
} from '@/Services/account-service'
import { Account } from '@/Interfaces/Auth/Types/Account'
import { PutAccountRequest } from '@/Interfaces/Account/Schema/account'
import { toast } from 'react-hot-toast'

export const useAccountManagement = () => {
	const [page, setPage] = useState<number>(1)
	const itemsPerPage = ITEMS_PER_PAGE_COUNT
	const searchParams = useSearchParams()
	const search = searchParams?.get('search')

	const accountDeleteMutate = useDeleteAccount()
	const updateAccountMutation = useUpdateAccount()
	const query = useGetAccountsByPage(
		itemsPerPage,
		page ? page : 1,
		search ?? null
	)

	const { isLoading, isError, isFetching, data } = query

	useEffect(() => {
		setPage(1)
	}, [search])

	const handleDelete = (id: string) => {
		accountDeleteMutate.mutate(id, {
			onSuccess: () => {
				query.refetch()
				toast.success('Account deleted successfully')
			},
			onError: error => {
				console.error('Failed to delete account:', error)
				toast.error('Failed to delete account')
			},
		})
	}

	const handleRestore = (id: string, data: Account) => {
		updateAccountMutation.mutate(
			{ id, data: { account: { ...data, isDeleted: false } } },
			{
				onSuccess: () => {
					query.refetch()
					toast.success('Account restored successfully')
				},
				onError: error => {
					console.error('Failed to restore account:', error)
					toast.error('Failed to restore account')
				},
			}
		)
	}

	const handleUpdate = (id: string, data: PutAccountRequest) => {
		updateAccountMutation.mutate(
			{ id, data },
			{
				onSuccess: () => {
					query.refetch()
					toast.success('Account updated successfully')
				},
				onError: error => {
					console.error('Failed to update account:', error)
					toast.error('Failed to update account')
				},
			}
		)
	}

	return {
		// Data
		accounts: data?.accounts || [],
		totalCount: data?.totalCount || 0,

		// State
		page,
		setPage,
		itemsPerPage,
		isLoading,
		isError,
		isFetching,

		// Actions
		handleDelete,
		handleRestore,
		handleUpdate,
		refetch: query.refetch,
	}
}
