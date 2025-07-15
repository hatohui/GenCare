import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ServiceDTO } from '@/Interfaces/Service/Schemas/service'
import { ITEMS_PER_PAGE_COUNT } from '@/Constants/Management'
import {
	useDeleteService,
	useServiceByPageAdmin,
	useUpdateService,
} from '@/Services/service-services'
import { toast } from 'react-hot-toast'

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
		deleteMutation.mutate(id, {
			onSuccess: () => {
				query.refetch()
				toast.success('Service deleted successfully')
			},
			onError: error => {
				console.error('Failed to delete service:', error)
				toast.error('Failed to delete service')
			},
		})
	}

	const handleRestore = (id: string, data: ServiceDTO) => {
		// Transform imageUrls from object format to string array format
		const transformedData = {
			...data,
			isDeleted: false,
			imageUrls: data.imageUrls?.map(img => img.url) || [],
		}

		updateMutation.mutate(
			{ id, data: transformedData },
			{
				onSuccess: () => {
					query.refetch()
					toast.success('Service restored successfully')
				},
				onError: error => {
					console.error('Failed to restore service:', error)
					toast.error('Failed to restore service')
				},
			}
		)
	}

	const handleUpdate = (id: string, data: any) => {
		updateMutation.mutate(
			{ id, data },
			{
				onSuccess: () => {
					query.refetch()
					toast.success('Service updated successfully')
				},
				onError: error => {
					console.error('Failed to update service:', error)
					toast.error('Failed to update service')
				},
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
