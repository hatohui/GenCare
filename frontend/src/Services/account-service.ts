import { DEFAULT_API_URL } from '@/Constants/API'
import {
	DeleteAccountResponse,
	GetAccountByIdResponse,
	GetAccountByPageResponse,
	PostAccountRequest,
	PostAccountResponse,
	PutAccountRequest,
	PutAccountResponse,
} from '@/Interfaces/Account/Schema/account'
import { GetConsultantsResponse } from '@/Interfaces/Account/Schema/consultant'
import axiosInstance from '@/Utils/axios'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { Role } from '@/Utils/Permissions/isAllowedRole'

const ACCOUNT_URL = `${DEFAULT_API_URL}/accounts`

const accountApi = {
	getMe: () => {
		console.log('queried')

		const queryUrl = `${ACCOUNT_URL}/me`
		return axiosInstance.get<GetAccountByIdResponse>(queryUrl).then(res => {
			return res.data
		})
	},
	/**
	 * Retrieves a paginated list of user accounts.
	 * @param count The number of items to retrieve per page
	 * @param page The page index
	 * @returns A promise that resolves with a paginated list of user accounts
	 */
	getByPage: (
		count: number,
		page: number,
		search: string | null,
		role?: Role | null,
		active?: boolean | null
	) => {
		const queryUrl = `${ACCOUNT_URL}?page=${page}&count=${count}${
			search ? `&search=${search}` : ''
		}${role ? `&role=${role}` : ''}${
			active !== null && active !== undefined ? `&active=${active}` : ''
		}`

		return axiosInstance
			.get<GetAccountByPageResponse>(queryUrl)
			.then(res => res.data)
	},

	/**
	 * Retrieves a paginated list of consultants with optional search filtering.
	 * @param count The number of consultants per page (must be positive)
	 * @param page The page number (starts from 1)
	 * @param search Optional keyword to filter consultants
	 * @returns A promise that resolves with a paginated list of consultants
	 */
	getConsultants: (count: number, page: number, search: string | null) => {
		const queryUrl = `${ACCOUNT_URL}/consultants?page=${page}&count=${count}${
			search ? `&search=${search}` : ''
		}`

		return axiosInstance
			.get<GetConsultantsResponse>(queryUrl)
			.then(res => res.data)
	},

	getById: (id: string) => {
		const queryUrl = `${ACCOUNT_URL}/${id}`
		return axiosInstance
			.get<GetAccountByIdResponse>(queryUrl)
			.then(res => res.data)
	},
	create: (data: PostAccountRequest) => {
		// Transform frontend structure to backend structure
		const transformedData: any = {
			AccountRequest: {
				email: data.account.email,
				firstName: data.account.firstName,
				lastName: data.account.lastName,
				gender: data.account.gender,
				phoneNumber: data.account.phoneNumber,
				dateOfBirth: data.account.dateOfBirth,
				password: data.account.password,
				roleId: (data.account as any).roleId, // roleId added in form
				avatarUrl: (data.account as any).avatarUrl || '', // Default if not provided
			},
		}

		// Only add StaffInfoRequest if all required fields are present
		if (data.staffInfo && data.department) {
			transformedData.StaffInfoRequest = {
				degree: data.staffInfo.degree,
				yearOfExperience: data.staffInfo.yearOfExperience,
				biography: data.staffInfo.biography || '',
				departmentId: data.department, // Map department to departmentId
			}
		}

		return axiosInstance
			.post<PostAccountResponse>(ACCOUNT_URL, transformedData)
			.then(res => res.data)
	},

	updateAccount: (id: string, data: PutAccountRequest) => {
		const queryUrl = `${ACCOUNT_URL}/${id}`
		console.log('🌐 Account Service - Sending PUT request:', {
			url: queryUrl,
			data: data,
			phoneNumber: data.account?.phoneNumber,
		})
		return axiosInstance
			.put<PutAccountResponse>(queryUrl, data)
			.then(res => {
				console.log('✅ Account Service - PUT response:', res.data)
				return res.data
			})
			.catch(err => {
				console.error(
					'❌ Account Service - PUT error:',
					err.response?.data || err.message
				)
				throw err
			})
	},

	delete: (id: string) => {
		const queryUrl = `${ACCOUNT_URL}/${id}`
		return axiosInstance
			.delete<DeleteAccountResponse>(queryUrl)
			.then(res => res.data)
	},

	getConsultantById: (id: string) => {
		const queryUrl = `${ACCOUNT_URL}/consultants/${id}`
		return axiosInstance.get(queryUrl).then(res => res.data)
	},
}

export const useGetMe = () => {
	return useQuery({
		queryKey: ['me'],
		queryFn: () => accountApi.getMe(),
		refetchOnMount: true,
		refetchOnWindowFocus: true,
	})
}

export const useGetAccountsByPage = (
	count: number,
	page: number,
	search: string | null,
	role?: Role | null
) => {
	return useQuery({
		queryKey: ['accounts', page, count, search],
		queryFn: () => accountApi.getByPage(count, page, search, role),
		placeholderData: keepPreviousData,
	})
}

export const useGetAccountsByPageStaff = (
	count: number,
	page: number,
	search: string | null
) => {
	return useQuery({
		queryKey: ['accounts-staff', page, count, search],
		queryFn: () => accountApi.getByPage(count, page, search, 'member', true),
		placeholderData: keepPreviousData,
	})
}

export const useGetAccountById = (id: string) => {
	return useQuery({
		queryKey: ['account', id],
		queryFn: () => accountApi.getById(id),
	})
}

export const useCreateAccount = () => {
	return useMutation({
		mutationFn: (data: PostAccountRequest) => accountApi.create(data),
	})
}

export const useUpdateAccount = () => {
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: PutAccountRequest }) =>
			accountApi.updateAccount(id, data),
	})
}

export const useDeleteAccount = () => {
	return useMutation({
		mutationFn: (id: string) => accountApi.delete(id),
	})
}

/**
 * Hook to fetch a paginated list of consultants with optional search filtering.
 * @param count The number of consultants per page (must be positive)
 * @param page The page number (starts from 1)
 * @param search Optional keyword to filter consultants
 * @returns React Query result with consultants data
 */
export const useGetConsultants = (
	count: number,
	page: number,
	search: string | null
) => {
	return useQuery({
		queryKey: ['consultants', page, count, search],
		queryFn: () => accountApi.getConsultants(count, page, search),
		placeholderData: keepPreviousData,
	})
}
