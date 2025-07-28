import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/Utils/axios'

export interface ConsultantAccount {
	id: string
	email: string
	firstName: string
	lastName: string
	phone: string
	roleId: string
	role?: {
		id: string
		name: string
	}
	isDeleted: boolean
	avatarUrl?: string
}

export interface GetConsultantsResponse {
	totalCount: number
	consultants: ConsultantAccount[]
}

const consultantApi = {
	getConsultants: (page: number = 1, count: number = 50, search?: string) => {
		const params = new URLSearchParams()
		params.append('page', page.toString())
		params.append('count', count.toString())
		if (search) {
			params.append('search', search)
		}

		return axiosInstance
			.get<GetConsultantsResponse>(`/accounts/consultants?${params.toString()}`)
			.then(res => res.data)
	},

	getConsultantById: (id: string) => {
		return axiosInstance
			.get<ConsultantAccount>(`/accounts/${id}`)
			.then(res => res.data)
	},
}

/**
 * Get all consultants for assignment
 */
export const useConsultants = (
	page: number = 1,
	count: number = 50,
	search?: string
) => {
	return useQuery({
		queryKey: ['consultants', page, count, search],
		queryFn: () => consultantApi.getConsultants(page, count, search),
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}

/**
 * Get consultant by ID
 */
export const useConsultantById = (id: string) => {
	return useQuery({
		queryKey: ['consultant', id],
		queryFn: () => consultantApi.getConsultantById(id),
		enabled: !!id,
	})
}
