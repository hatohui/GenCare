import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/Utils/axios'
import { DEFAULT_API_URL } from '@/Constants/API'
import { DeleteMediaResponse } from '@/Interfaces/Media/Types/Media'

const MEDIA_URL = `${DEFAULT_API_URL}/media`

const mediaApi = {
	deleteMedia: (id: string) => {
		return axiosInstance
			.delete<DeleteMediaResponse>(`${MEDIA_URL}/${id}`)
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
