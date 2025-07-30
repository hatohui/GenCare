import { DEFAULT_API_URL } from '@/Constants/API'
import {
	AdminStatisticsResponse,
	DashboardStatistic,
	RevenueData,
	UserGrowthData,
	TopService,
	PaymentStatistic,
	UserStatistic,
} from '@/Interfaces/Statistics/Types/Statistics'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const statisticsApi = {
	// Dashboard statistics - main overview
	getDashboardStatistics: (header: string) => {
		return axios
			.get<DashboardStatistic>(`${DEFAULT_API_URL}/statistics/dashboard`, {
				headers: { Authorization: header },
				timeout: 10000,
			})
			.then(res => res.data)
			.catch(error => {
				if (error.response?.status === 401) {
					console.warn('Unauthorized access to dashboard statistics')
				} else {
					console.error('Error fetching dashboard statistics:', error)
				}
				throw error
			})
	},

	// Revenue data for charts
	getRevenueData: (
		header: string,
		period: 'week' | 'month' | 'year' = 'month'
	) => {
		return axios
			.get<RevenueData[]>(`${DEFAULT_API_URL}/statistics/revenue-data`, {
				headers: { Authorization: header },
				params: { period },
				timeout: 10000,
			})
			.then(res => res.data)
			.catch(error => {
				console.error('Error fetching revenue data:', error)
				throw error
			})
	},

	// User growth data for charts
	getUserGrowth: (
		header: string,
		period: 'week' | 'month' | 'year' = 'month'
	) => {
		return axios
			.get<UserGrowthData[]>(`${DEFAULT_API_URL}/statistics/user-growth`, {
				headers: { Authorization: header },
				params: { period },
				timeout: 10000,
			})
			.then(res => res.data)
			.catch(error => {
				console.error('Error fetching user growth data:', error)
				throw error
			})
	},

	// Top services data
	getTopServices: (header: string) => {
		return axios
			.get<TopService[]>(`${DEFAULT_API_URL}/statistics/top-services`, {
				headers: { Authorization: header },
				timeout: 10000,
			})
			.then(res => res.data)
			.catch(error => {
				console.error('Error fetching top services:', error)
				throw error
			})
	},

	// Payment statistics
	getPaymentStatistics: (header: string) => {
		return axios
			.get<PaymentStatistic>(`${DEFAULT_API_URL}/statistics/payment`, {
				headers: { Authorization: header },
				timeout: 10000,
			})
			.then(res => res.data)
			.catch(error => {
				console.error('Error fetching payment statistics:', error)
				throw error
			})
	},

	// User statistics
	getUserStatistics: (header: string) => {
		return axios
			.get<UserStatistic>(`${DEFAULT_API_URL}/statistics/users`, {
				headers: { Authorization: header },
				timeout: 10000,
			})
			.then(res => res.data)
			.catch(error => {
				console.error('Error fetching user statistics:', error)
				throw error
			})
	},

	// Legacy method for backward compatibility
	getAdminStatistics: (header: string) => {
		return axios
			.get<AdminStatisticsResponse>(`${DEFAULT_API_URL}/statistics/admin`, {
				headers: { Authorization: header },
				timeout: 10000,
			})
			.then(res => res.data)
			.catch(error => {
				if (error.response?.status === 401) {
					console.warn('Unauthorized access to admin statistics')
				} else {
					console.error('Error fetching admin statistics:', error)
				}
				throw error
			})
	},
}

/**
 * Get comprehensive admin statistics
 * Requires admin access token
 */
export const useAdminStatistics = () => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['admin-statistics'],
		queryFn: async () => {
			const result = await statisticsApi.getAdminStatistics(header)
			if (!result) {
				throw new Error('No data received from statistics API')
			}
			return result
		},
		enabled: !!header,
		retry: 3,
		retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	})
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
			const result = await statisticsApi.getRevenueData(header, period)
			if (!result) {
				throw new Error('No revenue data received from API')
			}
			return result
		},
		enabled: !!header,
		retry: 2,
		retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 15000),
		staleTime: 5 * 60 * 1000, // 5 minutes
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
			const result = await statisticsApi.getUserGrowth(header, period)
			if (!result) {
				throw new Error('No user growth data received from API')
			}
			return result
		},
		enabled: !!header,
		retry: 2,
		retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 15000),
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}

/**
 * Get top services data
 * Requires admin access token
 */
export const useTopServices = () => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['top-services'],
		queryFn: async () => {
			const result = await statisticsApi.getTopServices(header)
			if (!result) {
				throw new Error('No top services data received from API')
			}
			return result
		},
		enabled: !!header,
		retry: 2,
		retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 15000),
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}

/**
 * Get payment statistics
 * Requires admin access token
 */
export const usePaymentStatistics = () => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['payment-statistics'],
		queryFn: async () => {
			const result = await statisticsApi.getPaymentStatistics(header)
			if (!result) {
				throw new Error('No payment statistics received from API')
			}
			return result
		},
		enabled: !!header,
		retry: 2,
		retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 15000),
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}

/**
 * Get user statistics
 * Requires admin access token
 */
export const useUserStatistics = () => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['user-statistics'],
		queryFn: async () => {
			const result = await statisticsApi.getUserStatistics(header)
			if (!result) {
				throw new Error('No user statistics received from API')
			}
			return result
		},
		enabled: !!header,
		retry: 2,
		retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 15000),
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}

/**
 * Get dashboard statistics
 * Requires admin access token
 */
export const useDashboardStatistics = () => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['dashboard-statistics'],
		queryFn: async () => {
			const result = await statisticsApi.getDashboardStatistics(header)
			if (!result) {
				throw new Error('No dashboard data received from API')
			}
			return result
		},
		enabled: !!header,
		retry: 3,
		retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	})
}
