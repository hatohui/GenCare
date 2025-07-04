import { DEFAULT_API_URL } from '@/Constants/API'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

const retryConfig = {
	retry: 3,
	retryDelay: (attemptIndex: number) =>
		Math.min(1000 * 2 ** attemptIndex, 30000),
}

type AppointmentCreateRequest = {
	memberId: string
	staffId: string
	scheduleAt: string
}

type AppointmentWithZoomResponse = {
	success: boolean
	message: string
	zoomMeeting: {
		meetingId: number
		topic: string
		startTime: string
		duration: number
		joinUrl: string
		startUrl: string
		password: string
	}
}

const appointmentApi = {
	createAppointment: (data: AppointmentCreateRequest, header: string) => {
		return axios
			.post(`${DEFAULT_API_URL}/appointments`, data, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
	createAppointmentWithZoom: (
		data: AppointmentCreateRequest,
		header: string
	) => {
		return axios
			.post<AppointmentWithZoomResponse>(
				`${DEFAULT_API_URL}/appointments/with-zoom`,
				data,
				{
					headers: { Authorization: header },
				}
			)
			.then(res => res.data)
	},
	getAppointments: (header: string) => {
		return axios
			.get(`${DEFAULT_API_URL}/appointments`, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
}

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

/**
 * Fetch all appointments for the authenticated user.
 *
 * This hook uses the `useQuery` hook from `react-query` to fetch all appointments.
 * The hook will only fetch the data if the user has a valid access token.
 *
 * @returns The appointments data with loading, error, and refetch capabilities.
 */
export const useAppointments = () => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['appointments'],
		queryFn: () => appointmentApi.getAppointments(header),
		enabled: !!header,
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchOnWindowFocus: false,
		...retryConfig,
	})
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

export const useCreateAppointmentWithZoom = () => {
	const header = useAccessTokenHeader()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: AppointmentCreateRequest) =>
			appointmentApi.createAppointmentWithZoom(data, header),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['appointments'] })
		},
		onError: handleApiError,
		...retryConfig,
	})
}
