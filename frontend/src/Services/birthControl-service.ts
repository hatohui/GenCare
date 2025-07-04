import { DEFAULT_API_URL } from '@/Constants/API'
import { BirthControlDates } from '@/Interfaces/BirthControl/Types/BirthControl'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/Utils/axios'

const BOOKING_URL = `${DEFAULT_API_URL}/birthControl`

type BirthControlRequest = {
	accountId: string
	startDate: string
}

const birthControlApi = {
	get: async (id: string) => {
		return axiosInstance
			.get<BirthControlDates>(`${BOOKING_URL}/${id}`)
			.then(res => res.data)
	},
	update: async (data: BirthControlRequest) =>
		axiosInstance.put<BirthControlDates>(`${BOOKING_URL}`, data).then(res => {
			return res.data
		}),
	create: async (data: BirthControlRequest) =>
		axiosInstance.post<BirthControlDates>(`${BOOKING_URL}`, data).then(res => {
			return res.data
		}),
}

export const useGetBirthControl = (id: string) => {
	return useQuery({
		queryKey: ['getBirthControl', id],
		queryFn: () => birthControlApi.get(id),
		staleTime: 0,
	})
}

export const useCreateBirthControl = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: BirthControlRequest) => birthControlApi.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getBirthControl'] })
		},
	})
}

export const useUpdateBirthControl = () => {
	return useMutation({
		mutationFn: (data: BirthControlRequest) => birthControlApi.update(data),
		mutationKey: ['updateBirthControl'],
	})
}
