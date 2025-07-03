import axiosInstance from '@/Utils/axios'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AllResultArray, Result } from '@/Interfaces/Tests/Types/Tests'

const ResultAPI = {
	GetTest: (header: string, orderDetailId: string) => {
		return axiosInstance
			.get<Omit<Result, 'orderDetailId'>>(`/result/${orderDetailId}`, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
	UpdateTest: (
		header: string,
		id: string,
		data: Omit<Result, 'orderDetailId'>
	) => {
		return axiosInstance
			.put(`/result/${id}`, data, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
	DeleteTest: (header: string, id: string) => {
		return axiosInstance
			.delete(`/result/${id}`, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
	getAllOrderDetail: (header: string) => {
		return axiosInstance
			.get<AllResultArray>('/result/all', {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
}

export const useGetAllOrderDetail = () => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['all-order-detail'],
		queryFn: () => ResultAPI.getAllOrderDetail(header),
	})
}

export const useGetResult = (
	orderDetailId: string,
	options?: { enabled?: boolean }
) => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['result', orderDetailId],
		queryFn: () => ResultAPI.GetTest(header, orderDetailId),
		enabled: options?.enabled !== false && !!orderDetailId,
	})
}

export const useUpdateResult = () => {
	const header = useAccessTokenHeader()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string
			data: Omit<Result, 'orderDetailId'>
		}) => ResultAPI.UpdateTest(header, id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['result'] })
		},
	})
}

export const useDeleteResult = () => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: ({ id }: { id: string }) => ResultAPI.DeleteTest(header, id),
	})
}
