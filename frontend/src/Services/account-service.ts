import { DEFAULT_API_URL } from '@/Constants/API'
import {
	GetAccountByIdResponse,
	GetAccountByPageResponse,
} from '@/Interfaces/Account/Schema/account'
import axiosInstance from '@/Utils/axios'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

const ACCOUNT_URL = `${DEFAULT_API_URL}/accounts`

const accountApi = {
	getMe: (header: string) => {
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
	getByPage: (header: string, count: number, page: number) => {
		const queryUrl = `${ACCOUNT_URL}?page=${page}&count=${count}`

		return axiosInstance
			.get<GetAccountByPageResponse>(queryUrl, {
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
}

export const useGetMe = () => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['me'],
		queryFn: () => accountApi.getMe(header),
		enabled: !!header,
		staleTime: 0, // data is always considered stale
		refetchOnMount: true,
		refetchOnWindowFocus: true,
	})
}

export const useGetAccountsByPage = (count: number, page: number) => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['accounts', page, count],
		queryFn: () => accountApi.getByPage(header, count, page),
		placeholderData: keepPreviousData,
	})
}

export const useGetAccountById = (id: string) => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['account', id],
		queryFn: () => accountApi.getById(header, id),
	})
}
