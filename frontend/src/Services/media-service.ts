import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/Utils/axios'
import { DeleteMediaResponse } from '@/Interfaces/Media/Types/Media'

const mediaApi = {
	// Private API - requires authentication
	deleteMedia: (id: string) => {
		return axiosInstance
			.delete<DeleteMediaResponse>(`/media/${id}`)
			.then(res => res.data)
	},
}

/**
 * Hook to delete a media file by its ID
 */
export const useDeleteMedia = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => mediaApi.deleteMedia(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['services'] })
			queryClient.invalidateQueries({ queryKey: ['service'] })
		},
		onError: error => {
			console.error('Failed to delete media:', error)
		},
	})
}
