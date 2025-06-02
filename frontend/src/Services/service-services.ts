import { DEFAULT_API_URL } from '@/Constants/API'
import {
	CreateServiceApiResponse,
	DeleteServiceApiResponse,
	UpdateServiceApiResponse,
	GetServiceApiByPageResponse,
	GetServiceWithIdResponse,
} from '@/Interfaces/Service/Schemas/service'
import { getAccessTokenHeader } from '@/Utils/getAccessTokenHeader'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'

const SERVICE_URL = `${DEFAULT_API_URL}/services`

const serviceApi = {
	getByPage: (page: number, count: number) =>
		axios
			.get<GetServiceApiByPageResponse>(
				`${SERVICE_URL}?page=${page}&count=${count}`,
				{ headers: { Authorization: getAccessTokenHeader() } }
			)
			.then(res => res.data),

	getById: (id: string) =>
		axios
			.get<GetServiceWithIdResponse>(`${SERVICE_URL}/${id}`, {
				headers: { Authorization: getAccessTokenHeader() },
			})
			.then(res => res.data),

	create: (data: any) =>
		axios
			.post<CreateServiceApiResponse>(SERVICE_URL, data, {
				headers: { Authorization: getAccessTokenHeader() },
			})
			.then(res => res.data),

	update: (id: string, data: any) =>
		axios
			.put<UpdateServiceApiResponse>(`${SERVICE_URL}/${id}`, data, {
				headers: { Authorization: getAccessTokenHeader() },
			})
			.then(res => res.data),

	delete: (id: string) =>
		axios
			.delete<DeleteServiceApiResponse>(`${SERVICE_URL}/${id}`, {
				headers: { Authorization: getAccessTokenHeader() },
			})
			.then(res => res.data),
}

export const useServiceByPage = (page: number, count: number) => {
	return useQuery({
		queryKey: ['services', page, count],
		queryFn: () => serviceApi.getByPage(page, count),
	})
}

export const useServiceById = (id: string) => {
	return useQuery({
		queryKey: ['service', id],
		queryFn: () => serviceApi.getById(id),
	})
}

export const useCreateService = () => {
	return useMutation({
		mutationFn: (data: any) => serviceApi.create(data),
	})
}

export const useUpdateService = () => {
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: any }) =>
			serviceApi.update(id, data),
	})
}

export const useDeleteService = () => {
	return useMutation({
		mutationFn: (id: string) => serviceApi.delete(id),
	})
}
