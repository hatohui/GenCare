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
	getAllAdmin: () => {
		return axiosInstance.get<GetSlotResponse>('/slots').then(res => {
			console.log(res.data)
			return res.data
		})
	},

	create: (data: CreateSlotRequest) =>
		axiosInstance
			.post<CreateSlotResponse>('/slots', data)
			.then(res => res.data),

	update: (id: string, data: UpdateSlotRequest) => {
		return axiosInstance
			.put<UpdateSlotResponse>(`/slots/${id}`, data)
			.then(res => res.data)
	},

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
		mutationFn: ({ id, data }: { id: string; data: UpdateSlotRequest }) =>
			slotApi.update(id, data),
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
