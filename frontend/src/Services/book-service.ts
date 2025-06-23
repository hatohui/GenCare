import { DEFAULT_API_URL } from '@/Constants/API'
import { OrderDetailResponse } from '@/Interfaces/Payment/Types/BookService'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'

const BOOKING_URL = `${DEFAULT_API_URL}/purchases`

const bookingApi = {
	GetOrder: (header: string) => {
		return axios
			.get<OrderDetailResponse>(`${BOOKING_URL}`, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
	BookServices: (data: any, header: string) => {
		return axios
			.post(`${BOOKING_URL}`, data, { headers: { Authorization: header } })
			.then(res => res.data)
			.catch(error => {
				console.error('Error booking services:', error)
				throw error
			})
	},
}

export const useBookServices = () => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: (data: any) => bookingApi.BookServices(data, header),
	})
}

export const useGetOrder = () => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['getOrder'],
		queryFn: () => bookingApi.GetOrder(header),
	})
}
