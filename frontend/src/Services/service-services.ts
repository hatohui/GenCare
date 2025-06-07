import { DEFAULT_API_URL } from '@/Constants/API'
import {
	CreateServiceApiResponse,
	DeleteServiceApiResponse,
	UpdateServiceApiResponse,
	GetServiceByPageResponse,
	GetServiceWithIdResponse,
	UpdateServiceApiRequest,
} from '@/Interfaces/Service/Schemas/service'
import { Service } from '@/Interfaces/Service/Types/Service'
import { useAccessTokenHeader } from '@/Utils/getAccessTokenHeader'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'

const SERVICE_URL = `${DEFAULT_API_URL}/services`

export const samplePayload: Omit<
	Service,
	'createdAt' | 'updatedAt' | 'isDeleted'
>[] = [
	{
		id: '1',
		name: 'Basic Health Checkup',
		description:
			'A standard package for routine health screening. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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
			.get<GetServiceByPageResponse>(
				`${SERVICE_URL}?Page=${page}&Count=${count}`
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
	// const header = useAccessTokenHeader()

	return useQuery({
		queryKey: ['services', page, count],
		queryFn: () => serviceApi.getByPage(page, count),
		placeholderData: keepPreviousData,
	})
}

export const useServiceById = (id: string) => {
	return useQuery({
		queryKey: ['service', id],
		queryFn: () => serviceApi.getById(id),
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
