import { DEFAULT_API_URL } from '@/Constants/API'
import {
	BookedServicesResponse,
	OrderDetailResponse,
} from '@/Interfaces/Payment/Types/BookService'
import { MomoServiceResponse } from '@/Interfaces/Payment/Types/MomoService'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

const BOOKING_URL = `${DEFAULT_API_URL}/purchases`
const PAY_URL = `${DEFAULT_API_URL}/payments`
const ORDER_URL = `${DEFAULT_API_URL}/orderDetails`
const MANUAL_PAY_URL = `${DEFAULT_API_URL}/manual-payment`

// Retry configuration
const retryConfig = {
	retry: 3,
	retryDelay: (attemptIndex: number) =>
		Math.min(1000 * 2 ** attemptIndex, 30000),
}

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
			.post<MomoServiceResponse>(
				`${PAY_URL}/momo?purchaseId=${purchaseId}`,
				{},
				{
					headers: { Authorization: header },
				}
			)
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

// Error handler utility
const handleApiError = (error: unknown) => {
	if (axios.isAxiosError(error)) {
		const axiosError = error as AxiosError
		const status = axiosError.response?.status
		if (status === 401) {
			throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
		} else if (status === 403) {
			throw new Error('Bạn không có quyền thực hiện hành động này.')
		} else if (status === 404) {
			throw new Error('Không tìm thấy dữ liệu yêu cầu.')
		} else if (status && status >= 500) {
			throw new Error('Lỗi máy chủ. Vui lòng thử lại sau.')
		} else {
			const errorData = axiosError.response?.data as any
			throw new Error(errorData?.message || 'Đã xảy ra lỗi không xác định.')
		}
	}
	throw new Error('Đã xảy ra lỗi kết nối. Vui lòng kiểm tra kết nối mạng.')
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
		onError: handleApiError,
		...retryConfig,
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
		staleTime: 5 * 60 * 1000, // 5 minutes
		...retryConfig,
	})
}

export const useBookServices = () => {
	const header = useAccessTokenHeader()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: any) => bookingApi.BookServices(data, header),
		onSuccess: () => {
			// Optimistically update the booking list
			queryClient.invalidateQueries({ queryKey: ['getOrder'] })
		},
		onError: handleApiError,
		...retryConfig,
	})
}

export const useGetOrder = () => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['getOrder'],
		queryFn: () => bookingApi.GetOrder(header),
		staleTime: 2 * 60 * 1000, // 2 minutes
		...retryConfig,
	})
}

export const useMomoPay = (purchaseId: string) => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: () => bookingApi.MomoPay(header, purchaseId),
		onError: handleApiError,
		...retryConfig,
	})
}

export const useDeleteOrderDetail = (id: string) => {
	const header = useAccessTokenHeader()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: () => bookingApi.DeleteOrderDetail(header, id),
		onSuccess: () => {
			// Optimistically update the booking list
			queryClient.invalidateQueries({ queryKey: ['getOrder'] })
		},
		onError: handleApiError,
		...retryConfig,
	})
}
