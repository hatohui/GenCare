import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { DEFAULT_API_URL } from '@/Constants/API'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import { DeleteMediaResponse } from '@/Interfaces/Media/Types/Media'

const MEDIA_URL = `${DEFAULT_API_URL}/media`

const mediaApi = {
	deleteMedia: (header: string, id: string) => {
		return axios
			.delete<DeleteMediaResponse>(`${MEDIA_URL}/${id}`, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
}

/**
 * Hook to delete a media file by its ID
 */
export const useDeleteMedia = () => {
	const header = useAccessTokenHeader()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => mediaApi.deleteMedia(header, id),
		onSuccess: () => {
			// Invalidate related queries to refresh data
			queryClient.invalidateQueries({ queryKey: ['services'] })
			queryClient.invalidateQueries({ queryKey: ['service'] })
		},
		onError: error => {
			console.error('Failed to delete media:', error)
		},
	})
}
