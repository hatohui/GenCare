import { UseQueryResult } from '@tanstack/react-query'
import React from 'react'
import { useLocale } from '@/Hooks/useLocale'

interface UseQueryUIStateOptions<T> {
	query: UseQueryResult<T>
	loadingNode?: React.ReactNode
	errorNode?: React.ReactNode
	emptyNode?: React.ReactNode
}

const defaultWrapper =
	'flex justify-center items-center h-full text-center text-lg p-4 text-gray-600'

/**
 * A hook that returns a React node based on the state of a TanStack Query result.
 *
 * If the query is loading, it returns the `loadingNode` or a default loading animation.
 *
 * If the query has an error, it returns the `errorNode` or a default error message.
 *
 * If the query is successful but the data is empty, it returns the `emptyNode` or a default empty message.
 *
 * If the query is successful and the data is not empty, it returns `null`.
 *
 * This hook is useful for displaying a loading animation, error message, or empty message
 * when using TanStack Query to fetch data.
 *
 * @param {{ query: UseQueryResult<T>, loadingNode?: React.ReactNode, errorNode?: React.ReactNode, emptyNode?: React.ReactNode }} options
 * @returns {React.ReactNode | null}
 */
export const useQueryUIState = <T,>({
	query,
	loadingNode,
	errorNode,
	emptyNode,
}: UseQueryUIStateOptions<T>): React.ReactNode | null => {
	const { t } = useLocale()
	const { isFetching, isError, isSuccess, data } = query

	if (isFetching) {
		return (
			loadingNode ?? (
				<div className={defaultWrapper}>
					<div className='animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 mr-2' />
					<span>{t('loading.default')}</span>
				</div>
			)
		)
	}

	if (isError) {
		return (
			errorNode ?? (
				<div className={`${defaultWrapper} text-red-500`}>
					⚠️ {t('error.loading_data')}
				</div>
			)
		)
	}

	if (isSuccess && !data) {
		return (
			emptyNode ?? (
				<div className={defaultWrapper}>🚫 {t('error.no_data_found')}</div>
			)
		)
	}

	return null
}
