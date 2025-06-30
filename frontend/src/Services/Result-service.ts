import axios from 'axios'
import { DEFAULT_API_URL } from '@/Constants/API'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Result } from '@/Interfaces/Tests/Types/Tests'

const Result_URL = `${DEFAULT_API_URL}/result`

const ResultAPI = {
	GetTest: (header: string, orderDetailId: string) => {
		return axios
			.get<Omit<Result, 'OrderDetailId'>>(`${Result_URL}/${orderDetailId}`, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
	UpdateTest: (header: string, id: string, data: Partial<Result>) => {
		return axios
			.patch<Omit<Result, 'OrderDetailId'>>(`${Result_URL}/${id}`, data, {
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
}

export const useGetResult = (orderDetailId: string) => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['result', orderDetailId],
		queryFn: () => ResultAPI.GetTest(header, orderDetailId),
	})
}

export const useUpdateResult = () => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Result> }) =>
			ResultAPI.UpdateTest(header, id, data),
	})
}

export const useDeleteResult = () => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: ({ id }: { id: string }) => ResultAPI.DeleteTest(header, id),
	})
}
