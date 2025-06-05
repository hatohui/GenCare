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

export const samplePayload: {
	id: string
	name: string
	description: string
	price: number
	imageUrl?: string
}[] = [
	{
		id: '1',
		name: 'Basic Health Checkup',
		description: 'A standard package for routine health screening.',
		price: 499000,
		imageUrl: 'https://example.com/images/health-basic.jpg',
	},
	{
		id: '2',
		name: 'MRI Brain Scan',
		description: 'High-resolution MRI scan for brain diagnostics.',
		price: 1850000,
		imageUrl: 'https://example.com/images/mri-brain.jpg',
	},
	{
		id: '3',
		name: 'Pediatric Consultation',
		description: 'Consultation with a pediatric specialist for children.',
		price: 250000,
	},
	{
		id: '4',
		name: 'Vaccination Package',
		description: 'Includes all essential vaccines for children under 5.',
		price: 799000,
		imageUrl: 'https://example.com/images/vaccine.jpg',
	},
	{
		id: '5',
		name: 'Dental Cleaning',
		description: 'Professional cleaning and plaque removal service.',
		price: 350000,
	},
]

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
