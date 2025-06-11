import { DEFAULT_API_URL } from '@/Constants/API'
import {
	GetAccountByIdResponse,
	GetAccountByPageResponse,
} from '@/Interfaces/Account/Schema/account'
import { useAccessTokenHeader } from '@/Utils/getAccessTokenHeader'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'

const ACCOUNT_URL = `${DEFAULT_API_URL}/account`

const accountApi = {
	getByPage: (header: string, count: number, page: number) => {
		const queryUrl = `${ACCOUNT_URL}s?page=${page - 1}&count=${count}`

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
