import { DEFAULT_API_URL } from '@/Constants/API'
import {
	DeleteAccountResponse,
	GetAccountByIdResponse,
	GetAccountByPageResponse,
	PutAccountRequest,
	PutAccountResponse,
} from '@/Interfaces/Account/Schema/account'
import { GetConsultantsResponse } from '@/Interfaces/Account/Schema/consultant'
import axiosInstance from '@/Utils/axios'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { Role } from '@/Utils/Permissions/isAllowedRole'

const ACCOUNT_URL = `${DEFAULT_API_URL}/accounts`

const accountApi = {
	getMe: (header: string) => {
		console.log('queried')

		const queryUrl = `${ACCOUNT_URL}/me`
		return axiosInstance
			.get<GetAccountByIdResponse>(queryUrl, {
				headers: { Authorization: header },
			})
			.then(res => {
				return res.data
			})
	},
	/**
	 * Retrieves a paginated list of user accounts.
	 * @param header The access token header
	 * @param count The number of items to retrieve per page
	 * @param page The page index
	 * @returns A promise that resolves with a paginated list of user accounts
	 */
	getByPage: (
		header: string,
		count: number,
		page: number,
		search: string | null,
		role?: Role | null
	) => {
		const queryUrl = `${ACCOUNT_URL}?page=${page}&count=${count}${
			search ? `&search=${search}` : ''
		}${role ? `&role=${role}` : ''}`

		return axiosInstance
			.get<GetAccountByPageResponse>(queryUrl, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},

	/**
	 * Retrieves a paginated list of consultants with optional search filtering.
	 * @param header The access token header
	 * @param count The number of consultants per page (must be positive)
	 * @param page The page number (starts from 1)
	 * @param search Optional keyword to filter consultants
	 * @returns A promise that resolves with a paginated list of consultants
	 */
	getConsultants: (
		header: string,
		count: number,
		page: number,
		search: string | null
	) => {
		const queryUrl = `${ACCOUNT_URL}/consultants?page=${page}&count=${count}${
			search ? `&search=${search}` : ''
		}`

		return axiosInstance
			.get<GetConsultantsResponse>(queryUrl, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},

	getById: (header: string, id: string) => {
		const queryUrl = `${ACCOUNT_URL}/${id}`
		return axiosInstance
			.get<GetAccountByIdResponse>(queryUrl, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
	updateAccount: (header: string, id: string, data: any) => {
		const queryUrl = `${ACCOUNT_URL}/${id}`
		return axiosInstance
			.put<PutAccountResponse>(queryUrl, data, {
				headers: { Authorization: header },
			})
			.then(res => {
				console.log(res.data)

				return res.data
			})
	},

	delete: (header: string, id: string) => {
		const queryUrl = `${ACCOUNT_URL}/${id}`
		return axiosInstance
			.delete<DeleteAccountResponse>(queryUrl, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},

	getConsultantById: (header: string, id: string) => {
		const queryUrl = `${ACCOUNT_URL}/consultants/${id}`
		return axiosInstance
			.get(queryUrl, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
}

export const useGetMe = () => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['me'],
		queryFn: () => accountApi.getMe(header),
		enabled: !!header,
		refetchOnMount: true,
		refetchOnWindowFocus: true,
	})
}

export const useGetAccountsByPage = (
	count: number,
	page: number,
	search: string | null,
	role?: Role | null
) => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['accounts', page, count, search],
		queryFn: () => accountApi.getByPage(header, count, page, search, role),
		placeholderData: keepPreviousData,
		enabled: !!header,
	})
}

export const useGetAccountById = (id: string) => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['account', id],
		queryFn: () => accountApi.getById(header, id),
	})
}

export const useUpdateAccount = () => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: PutAccountRequest }) =>
			accountApi.updateAccount(header, id, data),
	})
}

export const useDeleteAccount = () => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: (id: string) => accountApi.delete(header, id),
	})
}

/**
 * Hook to fetch a paginated list of consultants with optional search filtering.
 * @param count The number of consultants per page (must be positive)
 * @param page The page number (starts from 1)
 * @param search Optional keyword to filter consultants
 * @returns React Query result with consultants data
 */
export const useGetConsultants = (
	count: number,
	page: number,
	search: string | null
) => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['consultants', page, count, search],
		queryFn: () => accountApi.getConsultants(header, count, page, search),
		placeholderData: keepPreviousData,
		enabled: !!header,
	})
}
