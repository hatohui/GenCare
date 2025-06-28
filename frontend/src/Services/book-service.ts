import { DEFAULT_API_URL } from '@/Constants/API'
import {
	BookedServicesResponse,
	OrderDetailResponse,
} from '@/Interfaces/Payment/Types/BookService'
import { MomoServiceResponse } from '@/Interfaces/Payment/Types/MomoService'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const BOOKING_URL = `${DEFAULT_API_URL}/purchases`
const PAY_URL = `${DEFAULT_API_URL}/payments`
const ORDER_URL = `${DEFAULT_API_URL}/orderDetails`
const MANUAL_PAY_URL = `${DEFAULT_API_URL}/manual-payment`

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
	},
	MomoPay: (header: string, purchaseId: string) => {
		return axios
			.post<MomoServiceResponse>(`${PAY_URL}/momo?purchaseId=${purchaseId}`, {
				headers: { Authorization: header },
			})
			.then(res => {
				console.log(res.data)

				return res.data
			})
	},
	DeleteOrderDetail: (header: string, id: string) => {
		return axios
			.delete(`${ORDER_URL}/${id}`, { headers: { Authorization: header } })
			.then(res => res.data)
	},
	ViewPurchaseById: (
		header: string,
		id: string,
		search: string | null,
		isPaid: boolean | null
	) => {
		const params = new URLSearchParams()
		if (search) params.append('search', search)
		if (isPaid !== null) params.append('isPaid', isPaid.toString())
		const queryString = params.toString()
		const url = `${BOOKING_URL}/staff/${id}${
			queryString ? `?${queryString}` : ''
		}`

		return axios
			.get<BookedServicesResponse>(url, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
	ManualPay: (data: { purchaseId: string }, header: string) => {
		return axios
			.post(`${MANUAL_PAY_URL}`, data, { headers: { Authorization: header } })
			.then(res => res.data)
	},
}

export const useManualPay = () => {
	const header = useAccessTokenHeader()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: { purchaseId: string }) =>
			bookingApi.ManualPay(data, header),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['viewPurchaseById'] })
		},
	})
}

export const useViewPurchaseById = (
	id: string,
	search: string | null,
	isPaid: boolean | null
) => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['viewPurchaseById', id, search, isPaid],
		queryFn: () => bookingApi.ViewPurchaseById(header, id, search, isPaid),
	})
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
		staleTime: 1000,
	})
}

export const useMomoPay = (purchaseId: string) => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: () => bookingApi.MomoPay(header, purchaseId),
	})
}
export const useDeleteOrderDetail = (id: string) => {
	const header = useAccessTokenHeader()
	const { refetch } = useGetOrder()

	return useMutation({
		mutationFn: () => bookingApi.DeleteOrderDetail(header, id),
		onSuccess: () => {
			refetch()
		},
	})
}
