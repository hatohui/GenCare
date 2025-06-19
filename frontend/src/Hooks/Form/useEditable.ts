import { useEffect, useState } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'

interface UseEditableFieldOptions<T> {
	query: UseQueryResult<T>
	onSave?: (updatedData: T) => void | T | Promise<void> | Promise<T>
}

export function useEditableField<T extends Record<string, any>>({
	query,
	onSave,
}: UseEditableFieldOptions<T>) {
	const { data, isFetching, isSuccess, isError, refetch } = query

	const [localData, setLocalData] = useState<T | null>(null)
	const [editingField, setEditingField] = useState<keyof T | null>(null)

	useEffect(() => {
		if (isSuccess && data) setLocalData(data)
	}, [isSuccess, data])

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		if (!localData) return
		const { name, value } = event.target
		setLocalData(prev => (prev ? { ...prev, [name]: value } : prev))
	}

	const toggleFieldEdit = (field: keyof T) => {
		if (editingField === field) {
			if (data)
				setLocalData(prev => (prev ? { ...prev, [field]: data[field] } : prev))
			setEditingField(null)
		} else {
			setEditingField(field)
		}
	}

	const handleFieldSave = async (field: keyof T) => {
		if (!localData || !data) return

		const isChanged = localData[field] !== data[field]
		if (!isChanged) {
			setEditingField(null)
			return
		}

		const confirm = window.confirm(`Save changes to "${String(field)}"?`)
		if (!confirm) return

		if (onSave) await onSave(localData)
		await refetch()
		setEditingField(null)
	}

	return {
		data,
		localData,
		isFetching,
		isSuccess,
		isError,
		editingField,
		handleChange,
		toggleFieldEdit,
		handleFieldSave,
	}
}
