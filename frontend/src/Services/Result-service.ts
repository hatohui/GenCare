import axiosInstance from '@/Utils/axios'
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import { AllResultArray, Result } from '@/Interfaces/Tests/Types/Tests'

const ResultAPI = {
	// Private API - requires authentication
	GetTest: (orderDetailId: string) => {
		return axiosInstance
			.get<Omit<Result, 'orderDetailId'>>(`/result/${orderDetailId}`)
			.then(res => res.data)
	},
	// Private API - requires authentication
	UpdateTest: (id: string, data: Omit<Result, 'orderDetailId'>) => {
		return axiosInstance.put(`/result/${id}`, data).then(res => res.data)
	},
	// Private API - requires authentication
	DeleteTest: (id: string) => {
		return axiosInstance.delete(`/result/${id}`).then(res => res.data)
	},
	// Private API - requires authentication
	getAllOrderDetail: (page: number, count: number, search?: string) => {
		const params = new URLSearchParams({
			page: page.toString(),
			count: count.toString(),
		})

		if (search) {
			params.append('search', search)
		}

		return axiosInstance
			.get<AllResultArray>(`/result/all?${params.toString()}`)
			.then(res => res.data)
	},
}

export const useGetAllOrderDetail = (
	page: number,
	count: number,
	search?: string
) => {
	return useQuery({
		queryKey: ['all-order-detail', page, count, search],
		queryFn: () => ResultAPI.getAllOrderDetail(page, count, search),
		placeholderData: keepPreviousData,
	})
}

export const useGetResult = (
	orderDetailId: string,
	options?: { enabled?: boolean }
) => {
	return useQuery({
		queryKey: ['result', orderDetailId],
		queryFn: () => ResultAPI.GetTest(orderDetailId),
		enabled: options?.enabled !== false && !!orderDetailId,
	})
}

export const useUpdateResult = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string
			data: Omit<Result, 'orderDetailId'>
		}) => ResultAPI.UpdateTest(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['result'] })
		},
	})
}

export const useDeleteResult = () => {
	return useMutation({
		mutationFn: ({ id }: { id: string }) => ResultAPI.DeleteTest(id),
	})
}
