import { DEFAULT_API_URL } from '@/Constants/API'
import {
	GetAccountByIdResponse,
	GetAccountByPageResponse,
} from '@/Interfaces/Account/Schema/account'
import { useAccessTokenHeader } from '@/Utils/getAccessTokenHeader'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'

const ACCOUNT_URL = `${DEFAULT_API_URL}/accounts`

const accountApi = {
	getMe: (header: string) => {
		const queryUrl = `${ACCOUNT_URL}/me`
		return axios
			.get<GetAccountByIdResponse>(queryUrl, {
				headers: { Authorization: header },
			})
			.then(res => {
				return res.data
			})
	},
	getByPage: (header: string, count: number, page: number) => {
		const queryUrl = `${ACCOUNT_URL}?page=${page}&count=${count}`

		return axios
			.get<GetAccountByPageResponse>(queryUrl, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},

	getById: (header: string, id: string) => {
		const queryUrl = `${ACCOUNT_URL}/${id}`
		return axios
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
		queryKey: [id],
		queryFn: () => accountApi.getById(header, id),
	})
}
