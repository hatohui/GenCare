import { DEFAULT_API_URL } from '@/Constants/API'
import {
	CreateServiceApiResponse,
	DeleteServiceApiResponse,
	UpdateServiceApiResponse,
	GetServiceApiByPageResponse,
	GetServiceWithIdResponse,
	UpdateServiceApiRequest,
} from '@/Interfaces/Service/Schemas/service'
import { useAccessTokenHeader } from '@/Utils/getAccessTokenHeader'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'

const SERVICE_URL = `${DEFAULT_API_URL}/services`

const serviceApi = {
	getByPage: (header: string, page: number, count: number) =>
		axios
			.get<GetServiceApiByPageResponse>(
				`${SERVICE_URL}?page=${page}&count=${count}`,
				{ headers: { Authorization: header } }
			)
			.then(res => res.data),

	getById: (header: string, id: string) =>
		axios
			.get<GetServiceWithIdResponse>(`${SERVICE_URL}/${id}`, {
				headers: { Authorization: header },
			})
			.then(res => res.data),

	create: (header: string, data: any) =>
		axios
			.post<CreateServiceApiResponse>(SERVICE_URL, data, {
				headers: { Authorization: header },
			})
			.then(res => res.data),

	update: (header: string, id: string, data: UpdateServiceApiRequest) =>
		axios
			.put<UpdateServiceApiResponse>(`${SERVICE_URL}/${id}`, data, {
				headers: { Authorization: header },
			})
			.then(res => res.data),

	delete: (header: string, id: string) =>
		axios
			.delete<DeleteServiceApiResponse>(`${SERVICE_URL}/${id}`, {
				headers: { Authorization: header },
			})
			.then(res => res.data),
}

export const useServiceByPage = (page: number, count: number) => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['services', page, count],
		queryFn: () => serviceApi.getByPage(header, page, count),
	})
}

export const useServiceById = (id: string) => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['service', id],
		queryFn: () => serviceApi.getById(header, id),
	})
}

export const useCreateService = () => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: (data: any) => serviceApi.create(header, data),
	})
}

export const useUpdateService = (id: string, data: UpdateServiceApiRequest) => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: () => serviceApi.update(header, id, data),
	})
}

export const useDeleteService = (id: string) => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: () => serviceApi.delete(header, id),
	})
}
