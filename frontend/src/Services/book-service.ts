import { DEFAULT_API_URL } from '@/Constants/API'
import {
	BookedServicesResponse,
	OrderDetailResponse,
} from '@/Interfaces/Payment/Types/BookService'
import { MomoServiceResponse } from '@/Interfaces/Payment/Types/MomoService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/Utils/axios'
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
	GetOrder: () => {
		return axiosInstance
			.get<OrderDetailResponse>(`${BOOKING_URL}`)
			.then(res => res.data)
	},
	BookServices: (data: any) => {
		return axiosInstance.post(`${BOOKING_URL}`, data).then(res => res.data)
	},
	MomoPay: (purchaseId: string) => {
		return axiosInstance
			.post<MomoServiceResponse>(`${PAY_URL}/momo?purchaseId=${purchaseId}`, {})
			.then(res => {
				console.log(res.data)
				return res.data
			})
	},
	DeleteOrderDetail: (id: string) => {
		return axiosInstance.delete(`${ORDER_URL}/${id}`).then(res => res.data)
	},
	ViewPurchaseById: (
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

		return axiosInstance.get<BookedServicesResponse>(url).then(res => res.data)
	},
	ManualPay: (data: { purchaseId: string }) => {
		return axiosInstance.post(`${MANUAL_PAY_URL}`, data).then(res => res.data)
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
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: { purchaseId: string }) => bookingApi.ManualPay(data),
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
	return useQuery({
		queryKey: ['viewPurchaseById', id, search, isPaid],
		queryFn: () => bookingApi.ViewPurchaseById(id, search, isPaid),
		staleTime: 5 * 60 * 1000, // 5 minutes
		...retryConfig,
	})
}

export const useBookServices = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: any) => bookingApi.BookServices(data),
		onSuccess: () => {
			// Optimistically update the booking list
			queryClient.invalidateQueries({ queryKey: ['getOrder'] })
		},
		onError: handleApiError,
		...retryConfig,
	})
}

export const useGetOrder = () => {
	return useQuery({
		queryKey: ['getOrder'],
		queryFn: () => bookingApi.GetOrder(),
		staleTime: 2 * 60 * 1000, // 2 minutes
		retry: false, // Do not retry on error for faster feedback
	})
}

export const useMomoPay = () => {
	return useMutation({
		mutationFn: (purchaseId: string) => bookingApi.MomoPay(purchaseId),
		onError: handleApiError,
		...retryConfig,
	})
}

export const useDeleteOrderDetail = (id: string) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: () => bookingApi.DeleteOrderDetail(id),
		onSuccess: () => {
			// Optimistically update the booking list
			queryClient.invalidateQueries({ queryKey: ['getOrder'] })
		},
		onError: handleApiError,
		...retryConfig,
	})
}
