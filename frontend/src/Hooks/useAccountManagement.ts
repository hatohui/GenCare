import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ITEMS_PER_PAGE_COUNT } from '@/Constants/Management'
import {
	useDeleteAccount,
	useGetAccountsByPage,
	useUpdateAccount,
} from '@/Services/account-service'
import { Account } from '@/Interfaces/Auth/Types/Account'

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
		if (window.confirm('Are you sure you want to delete this account?')) {
			accountDeleteMutate.mutate(id, {
				onSuccess: () => {
					query.refetch()
				},
				onError: () => {},
			})
		}
	}

	const handleRestore = (id: string, data: Account) => {
		if (window.confirm('Are you sure you want to restore this account?')) {
			updateAccountMutation.mutate(
				{ id, data: { account: { ...data, isDeleted: false } } },
				{
					onSuccess: () => {
						query.refetch()
					},
					onError: () => {},
				}
			)
		}
	}

	const handleUpdate = (id: string, data: any) => {
		updateAccountMutation.mutate(
			{ id, data: { account: data } },
			{
				onSuccess: () => {
					query.refetch()
				},
				onError: () => {},
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
