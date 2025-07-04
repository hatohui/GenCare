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
				timeout: 10000,
			})
			.then(res => res.data)
			.catch(error => {
				if (error.response?.status === 401) {
					throw new Error('Unauthorized access to admin statistics')
				}
				throw error
			})
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
