import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ServiceDTO } from '@/Interfaces/Service/Schemas/service'
import { ITEMS_PER_PAGE_COUNT } from '@/Constants/Management'
import {
	useDeleteService,
	useServiceByPageAdmin,
	useUpdateService,
} from '@/Services/service-services'

export const useServiceManagement = () => {
	const [currentPage, setCurrentPage] = useState(1)
	const [orderByPrice, setOrderByPrice] = useState<boolean | null>(null)
	const [includeDeleted, setIncludeDeleted] = useState<boolean | null>(null)
	const [sortByAlphabetical, setSortByAlphabetical] = useState<boolean>(false)

	const deleteMutation = useDeleteService()
	const updateMutation = useUpdateService()
	const itemsPerPage = ITEMS_PER_PAGE_COUNT
	const searchParams = useSearchParams()
	const search = searchParams?.get('search') ?? ''

	useEffect(() => {
		setCurrentPage(1)
	}, [search])

	const query = useServiceByPageAdmin(
		currentPage,
		itemsPerPage,
		search,
		includeDeleted,
		orderByPrice,
		sortByAlphabetical
	)

	const { isError, isFetching, data, isLoading } = query

	const handleDelete = (id: string) => {
		if (window.confirm('Bạn có muốn xóa mục này không?'))
			deleteMutation.mutate(id, {
				onSuccess: () => {
					query.refetch()
				},
				onError: () => {},
			})
	}

	const handleRestore = (id: string, data: ServiceDTO) => {
		if (window.confirm('Bạn có muốn khôi phục mục này không?'))
			updateMutation.mutate(
				{ id, data: { ...data, isDeleted: false } },
				{
					onSuccess: () => {
						query.refetch()
					},
					onError: () => {},
				}
			)
	}

	const handleUpdate = (id: string, data: any) => {
		updateMutation.mutate(
			{ id, data },
			{
				onSuccess: () => {
					query.refetch()
				},
				onError: () => {},
			}
		)
	}

	const handlePriceSorting = () => {
		if (orderByPrice === null) {
			setOrderByPrice(true)
			setSortByAlphabetical(false)
		} else if (orderByPrice === true) {
			setOrderByPrice(false)
			setSortByAlphabetical(false)
		} else {
			setOrderByPrice(null)
		}
	}

	const handleAlphabeticalSorting = () => {
		setSortByAlphabetical(prev => {
			const newState = !prev
			if (newState) setOrderByPrice(null)
			return newState
		})
	}

	return {
		services: data?.services ?? [],
		totalCount: data?.totalCount ?? 0,
		currentPage,
		setCurrentPage,
		itemsPerPage,
		isLoading,
		isError,
		isFetching,
		handleDelete,
		handleRestore,
		handleUpdate,

		// Filter states
		orderByPrice,
		includeDeleted,
		sortByAlphabetical,
		setIncludeDeleted,
		handlePriceSorting,
		handleAlphabeticalSorting,

		// Query refetch
		refetch: query.refetch,
	}
}
