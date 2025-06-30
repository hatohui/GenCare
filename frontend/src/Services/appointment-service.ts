import { DEFAULT_API_URL } from '@/Constants/API'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

const APPOINTMENT_URL = `${DEFAULT_API_URL}/appointments`

// Retry configuration
const retryConfig = {
	retry: 3,
	retryDelay: (attemptIndex: number) =>
		Math.min(1000 * 2 ** attemptIndex, 30000),
}

type AppointmentCreateRequest = {
	memberId: string
	staffId: string
	scheduleAt: string // ISO string
}

const appointmentApi = {
	createAppointment: (data: AppointmentCreateRequest, header: string) => {
		return axios
			.post(`${APPOINTMENT_URL}`, data, {
				headers: { Authorization: header },
			})
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

export const useCreateAppointment = () => {
	const header = useAccessTokenHeader()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: AppointmentCreateRequest) =>
			appointmentApi.createAppointment(data, header),
		onSuccess: () => {
			// Invalidate related queries
			queryClient.invalidateQueries({ queryKey: ['appointments'] })
		},
		onError: handleApiError,
		...retryConfig,
	})
}
