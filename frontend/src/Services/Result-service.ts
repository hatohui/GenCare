import axios from 'axios'
import { DEFAULT_API_URL } from '@/Constants/API'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AllResultArray, Result } from '@/Interfaces/Tests/Types/Tests'

const Result_URL = `${DEFAULT_API_URL}/result`

const ResultAPI = {
	GetTest: (header: string, orderDetailId: string) => {
		return axios
			.get<Omit<Result, 'orderDetailId'>>(`${Result_URL}/${orderDetailId}`, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
	UpdateTest: (
		header: string,
		id: string,
		data: Omit<Result, 'orderDetailId'>
	) => {
		return axios
			.put(`${Result_URL}/${id}`, data, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
	DeleteTest: (header: string, id: string) => {
		return axios
			.delete(`${Result_URL}/${id}`, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
	getAllOrderDetail: (header: string) => {
		return axios
			.get<AllResultArray>(`${Result_URL}/all`, {
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
