import {
	CreateSlotRequest,
	CreateSlotResponse,
	GetSlotResponse,
	UpdateSlotRequest,
	UpdateSlotResponse,
} from '@/Interfaces/Slot/Schema/slot'
import { useMutation, useQuery } from '@tanstack/react-query'
import axiosInstance from '@/Utils/axios'

const slotApi = {
	// Private API - requires authentication (admin)
	getAllAdmin: () => {
		return axiosInstance.get<GetSlotResponse>('/slots').then(res => res.data)
	},

	// Private API - requires authentication (admin)
	create: (data: CreateSlotRequest) =>
		axiosInstance
			.post<CreateSlotResponse>('/slots', data)
			.then(res => res.data),

	// Private API - requires authentication (admin)
	update: (data: UpdateSlotRequest) => {
		return axiosInstance
			.put<UpdateSlotResponse>('/slots', data)
			.then(res => res.data)
	},

	// Private API - requires authentication (admin)
	delete: (id: string) =>
		axiosInstance
			.delete<UpdateSlotResponse>(`/slots/${id}`)
			.then(res => res.data),
}

/**
 * Get all slots for admin users.
 */
export const useAllSlotsAdmin = () => {
	return useQuery({
		queryKey: ['slots-all'],
		queryFn: async () => {
			return slotApi.getAllAdmin()
		},
	})
}

/**
 * Create a new slot.
 */
export const useCreateSlot = () => {
	return useMutation({
		mutationFn: (data: CreateSlotRequest) => slotApi.create(data),
	})
}

/**
 * Update a slot by its ID.
 */
export const useUpdateSlot = () => {
	return useMutation({
		mutationFn: (data: UpdateSlotRequest) => slotApi.update(data),
	})
}

/**
 * Delete a slot by its ID.
 */
export const useDeleteSlot = () => {
	return useMutation({
		mutationFn: (id: string) => slotApi.delete(id),
	})
}
