import { DEFAULT_API_URL } from '@/Constants/API'
import { BirthControlDates } from '@/Interfaces/BirthControl/Types/BirthControl'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'

const BOOKING_URL = `${DEFAULT_API_URL}/birthControl`

type BirthControlRequest = {
	accountId: string
	startDate: string
	endDate?: string
}

const birthControlApi = {
	get: async ({ header, id }: { header: string; id: string }) => {
		return axios
			.get<BirthControlDates>(`${BOOKING_URL}/${id}`, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
	update: async ({
		header,
		data,
	}: {
		header: string
		data: BirthControlRequest
	}) =>
		axios
			.put<BirthControlDates>(`${BOOKING_URL}`, data, {
				headers: { Authorization: header },
			})
			.then(res => {
				console.log(res.data)
				return res.data
			}),
	create: async ({
		header,
		data,
	}: {
		header: string
		data: BirthControlRequest
	}) =>
		axios
			.post<BirthControlDates>(`${BOOKING_URL}`, data, {
				headers: { Authorization: header },
			})
			.then(res => {
				console.log(res.data)
				return res.data
			}),
}

export const useGetBirthControl = (id: string) => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['getBirthControl', id],
		queryFn: () => birthControlApi.get({ header, id }),
		staleTime: 0,
	})
}

export const useCreateBirthControl = () => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: (data: BirthControlRequest) =>
			birthControlApi.create({ header, data }),
	})
}

export const useUpdateBirthControl = () => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: (data: BirthControlRequest) =>
			birthControlApi.update({ header, data }),
	})
}
