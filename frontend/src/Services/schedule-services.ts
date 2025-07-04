import {
	CreateScheduleRequest,
	UpdateScheduleRequest,
	ScheduleByConsultantResponse,
	ScheduleListResponse,
} from '@/Interfaces/Schedule/Schema/schedule'
import { useMutation, useQuery } from '@tanstack/react-query'
import axiosInstance from '@/Utils/axios'

const scheduleApi = {
	// Private API - requires authentication
	getAll: (startAt?: string, endAt?: string) => {
		const params = new URLSearchParams()
		if (startAt) params.append('startAt', startAt)
		if (endAt) params.append('endAt', endAt)

		const query = params.toString()
			? `/schedules?${params.toString()}`
			: '/schedules'

		return axiosInstance.get<ScheduleListResponse>(query).then(res => res.data)
	},

	// Private API - requires authentication
	getByConsultant: (consultantId: string, startAt?: string, endAt?: string) => {
		const params = new URLSearchParams()
		if (startAt) params.append('startAt', startAt)
		if (endAt) params.append('endAt', endAt)

		const query = params.toString()
			? `/schedules/${consultantId}?${params.toString()}`
			: `/schedules/${consultantId}`

		return axiosInstance
			.get<ScheduleByConsultantResponse>(query)
			.then(res => res.data)
	},

	// Private API - requires authentication
	create: (data: CreateScheduleRequest) =>
		axiosInstance.post('/schedules', data).then(res => res.status), // Return status code (201)

	// Private API - requires authentication
	update: (scheduleId: string, data: UpdateScheduleRequest) => {
		return axiosInstance
			.put(`/schedules/${scheduleId}`, data)
			.then(res => res.status) // Return status code (204)
	},

	// Private API - requires authentication
	delete: (scheduleId: string) =>
		axiosInstance.delete(`/schedules/${scheduleId}`).then(res => res.status), // Return status code
}

/**
 * Get all schedules with optional date range
 */
export const useAllSchedules = (startAt?: string, endAt?: string) => {
	return useQuery({
		queryKey: ['schedules-all', startAt, endAt],
		queryFn: async () => {
			return scheduleApi.getAll(startAt, endAt)
		},
	})
}

/**
 * Get schedules for a specific consultant
 */
export const useSchedulesByConsultant = (
	consultantId: string,
	startAt?: string,
	endAt?: string
) => {
	return useQuery({
		queryKey: ['schedules-consultant', consultantId, startAt, endAt],
		queryFn: async () => {
			return scheduleApi.getByConsultant(consultantId, startAt, endAt)
		},
		enabled: !!consultantId,
	})
}

/**
 * Create a new schedule
 */
export const useCreateSchedule = () => {
	return useMutation({
		mutationFn: (data: CreateScheduleRequest) => scheduleApi.create(data),
	})
}

/**
 * Update a schedule by its ID
 */
export const useUpdateSchedule = () => {
	return useMutation({
		mutationFn: ({
			scheduleId,
			data,
		}: {
			scheduleId: string
			data: UpdateScheduleRequest
		}) => scheduleApi.update(scheduleId, data),
	})
}

/**
 * Delete a schedule by its ID
 */
export const useDeleteSchedule = () => {
	return useMutation({
		mutationFn: (scheduleId: string) => scheduleApi.delete(scheduleId),
	})
}
