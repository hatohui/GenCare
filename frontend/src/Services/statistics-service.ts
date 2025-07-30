import { AdminStatisticsResponse } from '@/Interfaces/Statistics/Types/Statistics'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import axiosInstance from '@/Utils/axios'
import { useQuery } from '@tanstack/react-query'

const statisticsApi = {
	getAdminStatistics: (header: string) => {
		return axiosInstance
			.get<AdminStatisticsResponse>('/statistics/admin', {
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
			})
	},

	getRevenueData: (
		header: string,
		period: 'week' | 'month' | 'year' = 'month'
	) => {
		return axiosInstance
			.get<AdminStatisticsResponse['revenueData']>('/statistics/revenue', {
				headers: { Authorization: header },
				params: { period },
			})
			.then(res => res.data)
	},

	getUserGrowth: (
		header: string,
		period: 'week' | 'month' | 'year' = 'month'
	) => {
		return axiosInstance
			.get<AdminStatisticsResponse['userGrowth']>('/statistics/users/growth', {
				headers: { Authorization: header },
				params: { period },
			})
			.then(res => res.data)
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
			return statisticsApi.getAdminStatistics(header)
		},
		enabled: !!header,
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
