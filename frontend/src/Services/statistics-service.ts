import { DEFAULT_API_URL } from '@/Constants/API'
import { AdminStatisticsResponse } from '@/Interfaces/Statistics/Types/Statistics'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const statisticsApi = {
	// Private API - requires authentication (admin only)
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
			})
	},

	// Private API - requires authentication (admin only)
	getRevenueData: (
		header: string,
		period: 'week' | 'month' | 'year' = 'month'
	) => {
		return axios
			.get<AdminStatisticsResponse['revenueData']>(
				`${DEFAULT_API_URL}/statistics/revenue`,
				{
					headers: { Authorization: header },
					params: { period },
				}
			)
			.then(res => res.data)
	},

	// Private API - requires authentication (admin only)
	getUserGrowth: (
		header: string,
		period: 'week' | 'month' | 'year' = 'month'
	) => {
		return axios
			.get<AdminStatisticsResponse['userGrowth']>(
				`${DEFAULT_API_URL}/statistics/users/growth`,
				{
					headers: { Authorization: header },
					params: { period },
				}
			)
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
