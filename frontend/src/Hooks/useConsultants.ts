import { useState, useCallback } from 'react'
import { Consultant } from '@/Interfaces/Account/Types/Consultant'
import { useGetConsultants } from '@/Services/account-service'

interface UseConsultantsOptions {
	itemsPerPage?: number
	initialPage?: number
	initialSearch?: string
}

interface UseConsultantsReturn {
	consultants: Consultant[]
	totalCount: number
	currentPage: number
	searchTerm: string
	isLoading: boolean
	error: any
	totalPages: number
	setPage: (page: number) => void
	setSearch: (search: string) => void
	clearSearch: () => void
	refresh: () => void
}

export const useConsultants = ({
	itemsPerPage = 12,
	initialPage = 1,
	initialSearch = '',
}: UseConsultantsOptions = {}): UseConsultantsReturn => {
	const [currentPage, setCurrentPage] = useState(initialPage)
	const [searchTerm, setSearchTerm] = useState(initialSearch)

	const { data, isLoading, error, refetch } = useGetConsultants(
		itemsPerPage,
		currentPage,
		searchTerm || null
	)

	const totalPages = data ? Math.ceil(data.totalCount / itemsPerPage) : 0

	const setPage = useCallback((page: number) => {
		setCurrentPage(page)
	}, [])

	const setSearch = useCallback((search: string) => {
		setSearchTerm(search)
		setCurrentPage(1) // Reset to first page when searching
	}, [])

	const clearSearch = useCallback(() => {
		setSearchTerm('')
		setCurrentPage(1)
	}, [])

	const refresh = useCallback(() => {
		refetch()
	}, [refetch])

	return {
		consultants: data?.consultants || [],
		totalCount: data?.totalCount || 0,
		currentPage,
		searchTerm,
		isLoading,
		error,
		totalPages,
		setPage,
		setSearch,
		clearSearch,
		refresh,
	}
}
