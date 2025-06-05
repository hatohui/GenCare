import { DEFAULT_API_URL } from '@/Constants/API'
import { GetAccountByPageResponse } from '@/Interfaces/Account/Schema/account'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const ACCOUNT_URL = `${DEFAULT_API_URL}/account`

const accountApi = {
	getByPage: (count: number, page: number) => {
		const queryUrl = `${ACCOUNT_URL}s?page=${page}&count=${count}`
		console.log('query in account api: ' + queryUrl)

		return axios.get<GetAccountByPageResponse>(queryUrl).then(res => res.data)
	},
}

export const useGetAccountsByPage = (count: number, page: number) => {
	return useQuery({
		queryKey: ['accounts', count, page],
		queryFn: () => accountApi.getByPage(count, page),
	})
}
