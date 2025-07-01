import { DEFAULT_API_URL } from '@/Constants/API'
import {
	CreateScheduleRequest,
	UpdateScheduleRequest,
	ScheduleByConsultantResponse,
	ScheduleListResponse,
} from '@/Interfaces/Schedule/Schema/schedule'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'

const SCHEDULE_URL = `${DEFAULT_API_URL}/schedules`

const scheduleApi = {
	getAll: (header: string, startAt?: string, endAt?: string) => {
		const params = new URLSearchParams()
		if (startAt) params.append('startAt', startAt)
		if (endAt) params.append('endAt', endAt)

		const query = params.toString()
			? `${SCHEDULE_URL}?${params.toString()}`
			: SCHEDULE_URL

		return axios
			.get<ScheduleListResponse>(query, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},

	getByConsultant: (
		header: string,
		consultantId: string,
		startAt?: string,
		endAt?: string
	) => {
		const params = new URLSearchParams()
		if (startAt) params.append('startAt', startAt)
		if (endAt) params.append('endAt', endAt)

		const query = params.toString()
			? `${SCHEDULE_URL}/${consultantId}?${params.toString()}`
			: `${SCHEDULE_URL}/${consultantId}`

		return axios
			.get<ScheduleByConsultantResponse>(query, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},

	create: (header: string, data: CreateScheduleRequest) =>
		axios
			.post(SCHEDULE_URL, data, {
				headers: { Authorization: header },
			})
			.then(res => res.status), // Return status code (201)

	update: (header: string, scheduleId: string, data: UpdateScheduleRequest) => {
		return axios
			.put(`${SCHEDULE_URL}/${scheduleId}`, data, {
				headers: { Authorization: header },
			})
			.then(res => res.status) // Return status code (204)
	},

	delete: (header: string, scheduleId: string) =>
		axios
			.delete(`${SCHEDULE_URL}/${scheduleId}`, {
				headers: { Authorization: header },
			})
			.then(res => res.status), // Return status code
}

/**
 * Get all schedules with optional date range
 */
export const useAllSchedules = (startAt?: string, endAt?: string) => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['schedules-all', startAt, endAt],
		queryFn: async () => {
			return scheduleApi.getAll(header, startAt, endAt)
		},
		enabled: !!header,
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
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['schedules-consultant', consultantId, startAt, endAt],
		queryFn: async () => {
			return scheduleApi.getByConsultant(header, consultantId, startAt, endAt)
		},
		enabled: !!header && !!consultantId,
	})
}

/**
 * Create a new schedule
 */
export const useCreateSchedule = () => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: (data: CreateScheduleRequest) =>
			scheduleApi.create(header, data),
	})
}

/**
 * Update a schedule by its ID
 */
export const useUpdateSchedule = () => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: ({
			scheduleId,
			data,
		}: {
			scheduleId: string
			data: UpdateScheduleRequest
		}) => scheduleApi.update(header, scheduleId, data),
	})
}

/**
 * Delete a schedule by its ID
 */
export const useDeleteSchedule = () => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: (scheduleId: string) => scheduleApi.delete(header, scheduleId),
	})
}
