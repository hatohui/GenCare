import { useEffect, useState } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'

interface UseEditableOptions<T> {
	query: UseQueryResult<T>
	onSave?: (updatedData: T) => Promise<void> | void
}

/**
 * A hook to handle editing a data object that is fetched using a TanStack Query.
 *
 * The hook will track changes to the data object and provide an `isEditing` state
 * that can be used to conditionally render a "Save" button. When the user clicks
 * the "Save" button, the hook will call the `onSave` function (if provided) and
 * then re-fetch the data from the server.
 *
 * @param {UseEditableOptions} options
 * @returns {{
 *   data: T,
 *   localData: T | null,
 *   isFetching: boolean,
 *   isSuccess: boolean,
 *   isError: boolean,
 *   isEditing: boolean,
 *   handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
 *   toggleEdit: () => void,
 *   handleSave: () => Promise<void>
 * }}
 */
export function useEditable<T>({ query, onSave }: UseEditableOptions<T>) {
	const { data, isFetching, isSuccess, isError, refetch } = query

	const [localData, setLocalData] = useState<T | null>(null)
	const [isEditing, setIsEditing] = useState(false)

	useEffect(() => {
		if (isSuccess && data) setLocalData(data)
	}, [isSuccess, data])

	const handleChange = (
		event:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
	) => {
		if (!localData) return
		const { name, value } = event.target

		setLocalData(prev => {
			if (!prev) return prev
			return { ...prev, [name]: value }
		})
	}

	const toggleEdit = () => {
		if (isEditing && data) setLocalData(data)
		setIsEditing(prev => !prev)
	}

	const handleSave = async () => {
		if (
			localData &&
			data &&
			JSON.stringify(localData) !== JSON.stringify(data)
		) {
			const confirm = window.confirm('Do you want to save the changes?')
			if (!confirm) return

			if (onSave) await onSave(localData)
			await refetch()
		}
		setIsEditing(false)
	}

	return {
		data,
		localData,
		isFetching,
		isSuccess,
		isError,
		isEditing,
		handleChange,
		toggleEdit,
		handleSave,
	}
}
