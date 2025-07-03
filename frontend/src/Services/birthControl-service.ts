import { DEFAULT_API_URL } from '@/Constants/API'
import { BirthControlDates } from '@/Interfaces/BirthControl/Types/BirthControl'
import { useMutation, useQuery } from '@tanstack/react-query'
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
			console.log('start date end ate', data)

			console.log(res.data)
			return res.data
		}),
	create: async (data: BirthControlRequest) =>
		axiosInstance.post<BirthControlDates>(`${BOOKING_URL}`, data).then(res => {
			console.log(res.data)
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
	return useMutation({
		mutationFn: (data: BirthControlRequest) => birthControlApi.create(data),
	})
}

export const useUpdateBirthControl = () => {
	return useMutation({
		mutationFn: (data: BirthControlRequest) => birthControlApi.update(data),
		mutationKey: ['updateBirthControl'],
	})
}
