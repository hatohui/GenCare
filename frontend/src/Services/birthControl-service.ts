import { BirthControlDates } from '@/Interfaces/BirthControl/Types/BirthControl'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/Utils/axios'

type BirthControlRequest = {
	accountId: string
	startDate: string
}

const birthControlApi = {
	// Private API - requires authentication
	get: async (id: string) => {
		return axiosInstance
			.get<BirthControlDates>(`/birthControl/${id}`)
			.then(res => res.data)
	},
	// Private API - requires authentication
	update: async (data: BirthControlRequest) =>
		axiosInstance.put<BirthControlDates>('/birthControl', data).then(res => {
			return res.data
		}),
	// Private API - requires authentication
	create: async (data: BirthControlRequest) =>
		axiosInstance.post<BirthControlDates>('/birthControl', data).then(res => {
			return res.data
		}),
}

export const useGetBirthControl = (id: string) => {
	return useQuery({
		queryKey: ['getBirthControl', id],
		queryFn: () => birthControlApi.get(id),
		staleTime: 500,
		retry: false,
		enabled: !!id, // Only run query if id is provided
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
