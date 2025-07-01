import { DEFAULT_API_URL } from '@/Constants/API'
import { AdminStatisticsResponse } from '@/Interfaces/Statistics/Types/Statistics'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const STATISTICS_URL = `${DEFAULT_API_URL}/statistics`

const statisticsApi = {
	getAdminStatistics: (header: string) => {
		return axios
			.get<AdminStatisticsResponse>(`${STATISTICS_URL}/admin`, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},

	getRevenueData: (
		header: string,
		period: 'week' | 'month' | 'year' = 'month'
	) => {
		return axios
			.get<AdminStatisticsResponse['revenueData']>(
				`${STATISTICS_URL}/revenue`,
				{
					headers: { Authorization: header },
					params: { period },
				}
			)
			.then(res => res.data)
	},

	getUserGrowth: (
		header: string,
		period: 'week' | 'month' | 'year' = 'month'
	) => {
		return axios
			.get<AdminStatisticsResponse['userGrowth']>(
				`${STATISTICS_URL}/users/growth`,
				{
					headers: { Authorization: header },
					params: { period },
				}
			)
			.then(res => res.data)
	},
}

// Mock data for demonstration - replace with real API data
const mockData: AdminStatisticsResponse = {
	dashboardStats: {
		totalUsers: 3247,
		totalServices: 35,
		totalRevenue: 125678900,
		totalBookings: 1892,
		activeConsultants: 22,
		pendingPayments: 12,
		completedPayments: 1870,
		testResults: 1045,
	},
	revenueData: Array.from({ length: 30 }, (_, i) => ({
		date: `2024-01-${(i + 1).toString().padStart(2, '0')}`,
		revenue: Math.floor(1000000 + Math.random() * 2000000),
		bookings: Math.floor(10 + Math.random() * 30),
	})),
	userGrowth: Array.from({ length: 30 }, (_, i) => ({
		date: `2024-01-${(i + 1).toString().padStart(2, '0')}`,
		newUsers: Math.floor(10 + Math.random() * 20),
		totalUsers: 1200 + i * 15 + Math.floor(Math.random() * 10),
	})),
	topServices: [
		{
			serviceId: '1',
			serviceName: 'Khám tổng quát',
			bookings: 356,
			revenue: 35600000,
			percentage: 28,
		},
		{
			serviceId: '2',
			serviceName: 'Xét nghiệm máu',
			bookings: 334,
			revenue: 33400000,
			percentage: 26,
		},
		{
			serviceId: '3',
			serviceName: 'Siêu âm',
			bookings: 298,
			revenue: 29800000,
			percentage: 22,
		},
		{
			serviceId: '4',
			serviceName: 'Chụp X-quang',
			bookings: 167,
			revenue: 16700000,
			percentage: 13,
		},
		{
			serviceId: '5',
			serviceName: 'Khám chuyên khoa tim mạch',
			bookings: 137,
			revenue: 13700000,
			percentage: 11,
		},
	],
	recentActivity: [
		{
			id: '1',
			type: 'payment',
			message: 'Thanh toán thành công cho Nguyễn Thị Anh',
			timestamp: '2024-01-15T10:30:00.000Z',
			status: 'success',
			userName: 'Nguyễn Thị Anh',
		},
		{
			id: '2',
			type: 'booking',
			message: 'Đặt lịch khám mới cho Trần Văn Bình',
			timestamp: '2024-01-15T10:15:00.000Z',
			status: 'success',
			userName: 'Trần Văn Bình',
		},
		{
			id: '3',
			type: 'test',
			message: 'Kết quả xét nghiệm đã sẵn sàng cho Lê Thị Cẩm',
			timestamp: '2024-01-15T10:00:00.000Z',
			status: 'success',
			userName: 'Lê Thị Cẩm',
		},
		{
			id: '4',
			type: 'user',
			message: 'Người dùng mới đăng ký: Phạm Văn Dũng',
			timestamp: '2024-01-15T09:45:00.000Z',
			status: 'info',
			userName: 'Phạm Văn Dũng',
		},
		{
			id: '5',
			type: 'payment',
			message: 'Thanh toán thất bại cho Hoàng Thị Em',
			timestamp: '2024-01-15T09:30:00.000Z',
			status: 'error',
			userName: 'Hoàng Thị Em',
		},
		{
			id: '6',
			type: 'service',
			message: 'Dịch vụ mới được thêm: Khám chuyên khoa tim mạch',
			timestamp: '2024-01-15T09:00:00.000Z',
			status: 'info',
		},
		{
			id: '7',
			type: 'payment',
			message: 'Thanh toán thành công cho Lê Văn A',
			timestamp: '2024-01-14T16:30:00.000Z',
			status: 'success',
			userName: 'Lê Văn A',
		},
		{
			id: '8',
			type: 'booking',
			message: 'Đặt lịch khám mới cho Nguyễn Văn B',
			timestamp: '2024-01-14T15:15:00.000Z',
			status: 'success',
			userName: 'Nguyễn Văn B',
		},
		{
			id: '9',
			type: 'test',
			message: 'Kết quả xét nghiệm đã sẵn sàng cho Trần Thị C',
			timestamp: '2024-01-14T14:00:00.000Z',
			status: 'success',
			userName: 'Trần Thị C',
		},
		{
			id: '10',
			type: 'user',
			message: 'Người dùng mới đăng ký: Đỗ Thị D',
			timestamp: '2024-01-14T13:45:00.000Z',
			status: 'info',
			userName: 'Đỗ Thị D',
		},
	],
	paymentStats: {
		total: 1892,
		pending: 12,
		completed: 1870,
		failed: 10,
		monthlyRevenue: Array.from({ length: 12 }, (_, i) => ({
			date: `2024-${(i + 1).toString().padStart(2, '0')}-01`,
			revenue: Math.floor(10000000 + Math.random() * 10000000),
			bookings: Math.floor(100 + Math.random() * 100),
		})),
	},
	userStats: {
		total: 3247,
		active: 3120,
		newThisMonth: 147,
		growthRate: 4.9,
		monthlyGrowth: Array.from({ length: 12 }, (_, i) => ({
			date: `2024-${(i + 1).toString().padStart(2, '0')}-01`,
			newUsers: Math.floor(40 + Math.random() * 30),
			totalUsers: 1200 + i * 200 + Math.floor(Math.random() * 50),
		})),
	},
	servicePerformance: [
		{
			id: '1',
			name: 'Khám tổng quát',
			bookings: 356,
			revenue: 35600000,
			rating: 4.8,
		},
		{
			id: '2',
			name: 'Xét nghiệm máu',
			bookings: 334,
			revenue: 33400000,
			rating: 4.6,
		},
		{
			id: '3',
			name: 'Siêu âm',
			bookings: 298,
			revenue: 29800000,
			rating: 4.7,
		},
		{
			id: '4',
			name: 'Chụp X-quang',
			bookings: 167,
			revenue: 16700000,
			rating: 4.5,
		},
		{
			id: '5',
			name: 'Khám chuyên khoa tim mạch',
			bookings: 137,
			revenue: 13700000,
			rating: 4.9,
		},
	],
}

/**
 * Get comprehensive admin statistics
 * Requires admin access token
 */
export const useAdminStatistics = () => {
	return {
		data: mockData,
		isLoading: false,
		isError: false,
		refetch: () => {},
	}
}

/**
 * Get revenue data for charts
 * Requires admin access token
 */
export const useRevenueData = (period: 'week' | 'month' | 'year' = 'month') => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['revenue-data', period],
		queryFn: async () => {
			return statisticsApi.getRevenueData(header, period)
		},
		enabled: !!header,
	})
}

/**
 * Get user growth data for charts
 * Requires admin access token
 */
export const useUserGrowth = (period: 'week' | 'month' | 'year' = 'month') => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['user-growth', period],
		queryFn: async () => {
			return statisticsApi.getUserGrowth(header, period)
		},
		enabled: !!header,
	})
}
