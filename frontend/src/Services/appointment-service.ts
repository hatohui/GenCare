import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Appointment } from '@/Interfaces/Appointment/Types/Appointment'
import axiosInstance from '@/Utils/axios'

type AppointmentCreateRequest = {
	memberId: string
	staffId: string
	scheduleAt: string
}

const createAppointment = async (data: AppointmentCreateRequest) => {
	const response = await axiosInstance.post('/appointments', data)
	return response.data
}

const createAppointmentWithZoom = async (data: AppointmentCreateRequest) => {
	const response = await axiosInstance.post('/appointments/with-zoom', data)
	return response.data
}

const getAppointments = async () => {
	const response = await axiosInstance.get('/appointments')
	return response.data
}

const deleteAppointment = async (appointmentId: string) => {
	const response = await axiosInstance.delete(`/appointments/${appointmentId}`)
	return response.data
}

const updateAppointment = async (appointmentId: string, data: any) => {
	const response = await axiosInstance.put(
		`/appointments/${appointmentId}`,
		data
	)
	return response.data
}

export const useAppointments = () => {
	return useQuery({
		queryKey: ['appointments'],
		queryFn: () => getAppointments(),
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}

export const useConsultantAppointments = (consultantId?: string) => {
	const appointmentsQuery = useAppointments()

	return useMemo(
		() => ({
			...appointmentsQuery,
			data:
				appointmentsQuery.data?.filter(
					(appointment: Appointment) =>
						consultantId &&
						appointment.staffId === consultantId &&
						!appointment.isDeleted
				) || [],
		}),
		[appointmentsQuery, consultantId]
	)
}

export const useCreateAppointment = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: AppointmentCreateRequest) => createAppointment(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['appointments'] })
		},
	})
}

export const useCreateAppointmentWithZoom = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: AppointmentCreateRequest) =>
			createAppointmentWithZoom(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['appointments'] })
		},
	})
}

export const useDeleteAppointment = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (appointmentId: string) => deleteAppointment(appointmentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['appointments'] })
		},
	})
}

export const useUpdateAppointment = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			appointmentId,
			data,
		}: {
			appointmentId: string
			data: any
		}) => updateAppointment(appointmentId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['appointments'] })
		},
	})
}
