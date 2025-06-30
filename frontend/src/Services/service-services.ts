import { DEFAULT_API_URL } from '@/Constants/API'
import {
	CreateServiceApiResponse,
	DeleteServiceApiResponse,
	UpdateServiceApiResponse,
	GetServiceByPageResponse,
	GetServiceWithIdResponse,
	GetServiceByPageAdminResponse,
	CreateServiceApiRequest,
} from '@/Interfaces/Service/Schemas/service'
import { UpdateServiceApiRequest } from '@/Interfaces/Service/Types/Service'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'

const SERVICE_URL = `${DEFAULT_API_URL}/services`

const serviceApi = {
	//false = sort giam dan true = sort tang dan
	getByPage: (
		page: number,
		count: number,
		order: boolean | null,
		search: string
	) => {
		return axios
			.get<GetServiceByPageResponse>(
				`${SERVICE_URL}?Page=${page}&Count=${count}` +
					(order !== null ? `&sortByPrice=${order}` : '') +
					(search ? `&search=${search}` : '')
			)
			.then(res => {
				return res.data
			})
	},
	getByPageAdmin: (
		header: string,
		page: number,
		count: number,
		orderByPrice: boolean | null,
		includeDeleted: boolean | null,
		sortByAlphabetical: boolean,
		search?: string
	) => {
		const params = new URLSearchParams({
			page: page.toString(),
			count: count.toString(),
		})

		if (search) params.append('search', search)
		if (orderByPrice !== null)
			params.append('sortByPrice', orderByPrice.toString())
		if (includeDeleted !== null)
			params.append('includeDeleted', includeDeleted.toString())
		if (sortByAlphabetical) params.append('sortByAlphabetical', 'true')

		const query = `${SERVICE_URL}/all?${params.toString()}`

		return axios
			.get<GetServiceByPageAdminResponse>(query, {
				headers: { Authorization: header },
			})
			.then(res => {
				console.log(res.data)
				return res.data
			})
	},

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

/**
 * Get a page of services, filtered by search and sorted by price.
 * If order is true, services are sorted by price.
 * Requires an access token with the role of user or higher.
 *
 * @param page Page number
 * @param count Number of items per page
 * @param order Whether to sort by price
 * @param search Search query
 * @returns The result of the query, or the previous result if the query is
 *          still loading.
 */

export const useServiceByPage = (
	page: number,
	count: number,
	order: boolean | null,
	search: string = ''
) => {
	return useQuery({
		queryKey: ['services', page, count, order, search],
		queryFn: () => serviceApi.getByPage(page, count, order, search),
		placeholderData: keepPreviousData,
	})
}

/**
 * Get a page of services, filtered by search and sorted by price.
 * If includeDeleted is true, include deleted services in the result.
 * If orderByPrice is true, sort services by price.
 * Requires an access token with the role of admin or manager.
 *
 * @param page Page number
 * @param count Number of items per page
 * @param search Search query
 * @param orderByPrice Whether to sort by price
 * @param includeDeleted Whether to include deleted services
 * @returns The result of the query, or the previous result if the query is
 *          still loading.
 */

export const useServiceByPageAdmin = (
	page: number,
	count: number,
	search: string | null,
	includeDeleted: boolean | null,
	orderByPrice: boolean | null,
	sortByAlphabetical: boolean
) => {
	const header = useAccessTokenHeader()

	return useQuery({
		queryKey: [
			'services',
			page,
			count,
			search,
			orderByPrice,
			includeDeleted,
			sortByAlphabetical,
		],
		queryFn: async () => {
			return serviceApi.getByPageAdmin(
				header,
				page,
				count,
				orderByPrice,
				includeDeleted,
				sortByAlphabetical,
				search ?? ''
			)
		},
		placeholderData: keepPreviousData,
		enabled: !!header,
	})
}

/**
 * Fetch a service by its ID.
 *
 * This hook uses the `useQuery` hook from `react-query` to fetch a service by its ID.
 * The hook will only fetch the data if the `id` parameter is not empty.
 *
 * The hook returns the result of the query, which is the service with the given ID.
 *
 * @param id The ID of the service to fetch.
 * @returns The service with the given ID.
 */
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

/**
 * Create a new service.
 *
 * This hook utilizes the `useMutation` hook from `react-query` to perform
 * a mutation that creates a new service. The creation request is sent
 * with an authorization header.
 *
 * The hook returns the mutation result, which is the response from the
 * service creation API call.
 *
 * @returns The result of the service creation mutation.
 */

export const useCreateService = () => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: (data: CreateServiceApiRequest) =>
			serviceApi.create(header, data),
	})
}
/**
 * Update a service by its ID.
 *
 * This hook uses the `useMutation` hook from `react-query` to update a service.
 * The hook will only update the data if the `id` parameter is not empty.
 *
 * The hook returns the result of the mutation, which is the updated service.
 *
 * @param id The ID of the service to update.
 * @returns The updated service.
 */

export const useUpdateService = () => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateServiceApiRequest }) =>
			serviceApi.update(header, id, data),
	})
}

/**
 * Delete a service by its ID.
 *
 * This hook uses the `useMutation` hook from `react-query` to delete a service.
 * The hook will only perform the deletion if the `id` parameter is provided.
 *
 * The hook returns the result of the mutation, which is the response from the
 * service deletion API call.
 *
 * @returns The result of the service deletion mutation.
 */

export const useDeleteService = () => {
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: (id: string) => serviceApi.delete(header, id),
	})
}
