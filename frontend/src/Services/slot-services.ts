import {
	CreateSlotRequest,
	CreateSlotResponse,
	GetSlotResponse,
	UpdateSlotRequest,
	UpdateSlotResponse,
} from '@/Interfaces/Slot/Schema/slot'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import { useMutation, useQuery } from '@tanstack/react-query'
import axiosInstance from '@/Utils/axios'

const slotApi = {
	getAllAdmin: (header: string) => {
		return axiosInstance
			.get<GetSlotResponse>('/slots', {
				headers: { Authorization: header },
			})
			.then(res => {
				console.log(res.data)
				return res.data
			})
	},

	create: (header: string, data: CreateSlotRequest) =>
		axiosInstance
			.post<CreateSlotResponse>('/slots', data, {
				headers: { Authorization: header },
			})
			.then(res => res.data),

	update: (header: string, id: string, data: UpdateSlotRequest) => {
		return axiosInstance
			.put<UpdateSlotResponse>(`/slots/${id}`, data, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},

	delete: (header: string, id: string) =>
		axiosInstance
			.delete<UpdateSlotResponse>(`/slots/${id}`, {
				headers: { Authorization: header },
			})
			.then(res => res.data),
}

/**
 * Get all slots for admin users.
 */
export const useAllSlotsAdmin = () => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['slots-all'],
		queryFn: async () => {
			return slotApi.getAllAdmin(header)
		},
		enabled: !!header,
	})
}

/**
 * Create a new slot.
 */
export const useCreateSlot = () => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: (data: CreateSlotRequest) => slotApi.create(header, data),
	})
}

/**
 * Update a slot by its ID.
 */
export const useUpdateSlot = () => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateSlotRequest }) =>
			slotApi.update(header, id, data),
	})
}

/**
 * Delete a slot by its ID.
 */
export const useDeleteSlot = () => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: (id: string) => slotApi.delete(header, id),
	})
}
