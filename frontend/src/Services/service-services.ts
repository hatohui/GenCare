import { DEFAULT_API_URL } from '@/Constants/API'
import {
	CreateServiceApiResponse,
	DeleteServiceApiResponse,
	UpdateServiceApiResponse,
	GetServiceByPageResponse,
	GetServiceWithIdResponse,
	UpdateServiceApiRequest,
	GetServiceByPageAdminResponse,
} from '@/Interfaces/Service/Schemas/service'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import clsx from 'clsx'

const SERVICE_URL = `${DEFAULT_API_URL}/services`

const serviceApi = {
	getByPage: (page: number, count: number, order: boolean, search: string) =>
		axios
			.get<GetServiceByPageResponse>(
				`${SERVICE_URL}?Page=${page}&Count=${count}` +
					(order ? '&sortByPrice=true' : '') +
					(search ? `&search=${search}` : '')
			)
			.then(res => {
				console.log('getByPage', res.data)

				return res.data
			}),
	getByPageAdmin: (header: string, page: number, count: number) =>
		axios
			.get<GetServiceByPageAdminResponse>(
				`${SERVICE_URL}?Page=${page}&Count=${count}`,
				{
					headers: { Authorization: header },
				}
			)
			.then(res => {
				console.log(res.data)

				return res.data
			}),

	getById: (id: string) =>
		axios
			.get<GetServiceWithIdResponse>(`${SERVICE_URL}/${id}`)
			.then(res => res.data),

	create: (header: string, data: any) =>
		axios
			.post<CreateServiceApiResponse>(SERVICE_URL, data, {
				headers: { Authorization: header },
			})
			.then(res => res.data),

	update: (header: string, id: string, data: UpdateServiceApiRequest) => {
		console.log(`${SERVICE_URL}/${id}`)

		return axios
			.put<UpdateServiceApiResponse>(`${SERVICE_URL}/${id}`, data, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},

	delete: (header: string, id: string) =>
		axios
			.delete<DeleteServiceApiResponse>(`${SERVICE_URL}/${id}`, {
				headers: { Authorization: header },
			})
			.then(res => res.data),
}

export const useServiceByPage = (
	page: number,
	count: number,
	order: boolean,
	search: string = ''
) => {
	return useQuery({
		queryKey: ['services', page, count, order, search],
		queryFn: () => serviceApi.getByPage(page, count, order || false, search),
		placeholderData: keepPreviousData,
	})
}

export const useServiceByPageAdmin = (page: number, count: number) => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['services', page, count],
		queryFn: () => serviceApi.getByPageAdmin(header, page, count),
		placeholderData: keepPreviousData,
	})
}

export const useServiceById = (id: string) => {
	return useQuery({
		queryKey: ['service', id],
		queryFn: () => serviceApi.getById(id),
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		enabled: !!id,
	})
}

export const useCreateService = () => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: (data: any) => serviceApi.create(header, data),
	})
}

export const useUpdateService = (id: string) => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: (data: UpdateServiceApiRequest) =>
			serviceApi.update(header, id, data),
	})
}

export const useDeleteService = (id: string) => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: () => serviceApi.delete(header, id),
	})
}
