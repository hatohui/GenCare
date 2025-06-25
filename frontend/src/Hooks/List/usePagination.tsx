import { useEffect, useState, useMemo } from 'react'

export const usePagination = (
	totalCount: number | undefined,
	itemsPerPage: number
) => {
	const [page, setPage] = useState(1)

	const totalPages = useMemo(() => {
		return totalCount ? Math.ceil(totalCount / itemsPerPage) : 1
	}, [totalCount, itemsPerPage])

	useEffect(() => {
		if (page > totalPages) {
			setPage(1)
		}
	}, [totalPages])

	return {
		page,
		setPage,
		totalPages,
	}
}
