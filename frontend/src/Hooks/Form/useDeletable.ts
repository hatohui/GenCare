import { useState } from 'react'

/**
 * Hook to create a deletable item.
 *
 * @param onDelete function to be called when the item is deleted
 * @param onSuccess function to be called when the deletion is successful
 * @param onError function to be called when the deletion fails
 *
 * @returns an object with two properties: isDeleting and handleDelete.
 * isDeleting is a boolean indicating if the item is being deleted. handleDelete is a function that calls onDelete, onSuccess and onError accordingly.
 */
export function useDeletable<T>(
	onDelete: (item: T) => Promise<void>,
	onSuccess: () => void,
	onError: (error: unknown) => void
) {
	const [isDeleting, setIsDeleting] = useState(false)

	const handleDelete = async (item: T) => {
		setIsDeleting(true)
		try {
			await onDelete(item)
			onSuccess()
		} catch (error) {
			onError(error)
		} finally {
			setIsDeleting(false)
		}
	}

	return { isDeleting, handleDelete }
}
