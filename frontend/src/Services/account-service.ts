import {
	DeleteAccountResponse,
	GetAccountByIdResponse,
	GetAccountByPageResponse,
	CreateAccountRequest,
	CreateAccountResponse,
	PutAccountRequest,
} from '@/Interfaces/Account/Schema/account'
import { GetConsultantsResponse } from '@/Interfaces/Account/Schema/consultant'
import axiosInstance from '@/Utils/axios'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { Role } from '@/Utils/Permissions/isAllowedRole'
import useToken from '@/Hooks/Auth/useToken'
import { isTokenValid } from '@/Utils/Auth/isTokenValid'
import toast from 'react-hot-toast'

const accountApi = {
	getMe: () => {
		return axiosInstance.get<any>('/accounts/me').then(res => {
			const backendData = res.data
			const transformedData: GetAccountByIdResponse = {
				id: backendData.id,
				email: backendData.email,
				firstName: backendData.firstName,
				lastName: backendData.lastName,
				gender: backendData.gender,
				phoneNumber: backendData.phoneNumber,
				dateOfBirth: backendData.dateOfBirth,
				avatarUrl: backendData.avatarUrl,
				isDeleted: backendData.isDeleted,
				deletedAt: backendData.deletedAt,
				deletedBy: backendData.deletedBy,
				role: backendData.role,
				staffInfo:
					backendData.degree ||
					backendData.yearOfExperience ||
					backendData.biography ||
					backendData.departmentName
						? {
								departmentId: '',
								degree: backendData.degree,
								yearOfExperience: backendData.yearOfExperience,
								biography: backendData.biography,
								departmentName: backendData.departmentName || '',
						  }
						: undefined,
			}
			return transformedData
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
		const params = new URLSearchParams({
			page: page.toString(),
			count: count.toString(),
		})

		if (search) params.append('search', search)
		if (role) params.append('role', role)
		if (active !== null && active !== undefined)
			params.append('active', active.toString())

		return axiosInstance
			.get<GetAccountByPageResponse>(`/accounts?${params.toString()}`)
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
		const params = new URLSearchParams({
			page: page.toString(),
			count: count.toString(),
		})

		if (search) params.append('search', search)

		return axiosInstance
			.get<GetConsultantsResponse>(`/accounts/consultants?${params.toString()}`)
			.then(res => res.data)
	},

	getById: (id: string) => {
		return axiosInstance.get<any>(`/accounts/${id}`).then(res => {
			// Transform backend AccountViewModel to frontend StaffAccount format
			const backendData = res.data
			const transformedData: GetAccountByIdResponse = {
				id: backendData.id,
				email: backendData.email,
				firstName: backendData.firstName,
				lastName: backendData.lastName,
				gender: backendData.gender,
				phoneNumber: backendData.phone, // Note: backend uses 'phone', frontend expects 'phoneNumber'
				dateOfBirth: backendData.dateOfBirth,
				avatarUrl: backendData.avatarUrl,
				isDeleted: backendData.isDeleted,
				deletedAt: backendData.deletedAt,
				deletedBy: backendData.deletedBy,
				role: backendData.role,
				staffInfo: backendData.staffInfo
					? {
							departmentId: backendData.staffInfo.departmentId,
							degree: backendData.staffInfo.degree,
							yearOfExperience: backendData.staffInfo.yearOfExperience,
							biography: backendData.staffInfo.biography,
							departmentName: backendData.staffInfo.departmentName,
					  }
					: undefined,
			}
			return transformedData
		})
	},
	create: (data: CreateAccountRequest) => {
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
		if (data.staffInfo && data.staffInfo.departmentId) {
			transformedData.StaffInfoRequest = {
				degree: data.staffInfo.degree,
				yearOfExperience: data.staffInfo.yearOfExperience,
				biography: data.staffInfo.biography || '',
				departmentId: data.staffInfo.departmentId, // Use departmentId from staffInfo
			}
		}

		return axiosInstance.post<any>('/accounts', transformedData).then(res => {
			// Transform backend StaffAccountCreateResponse to frontend StaffAccount format
			const backendData = res.data
			const transformedResponse: CreateAccountResponse = {
				id: backendData.id,
				email: backendData.email,
				firstName: backendData.firstName,
				lastName: backendData.lastName,
				gender: backendData.gender,
				phoneNumber: backendData.phoneNumber,
				dateOfBirth: backendData.dateOfBirth,
				avatarUrl: backendData.avatarUrl,
				isDeleted: false, // New accounts are not deleted
				role: { name: backendData.role, description: '' }, // Backend only returns role name
				staffInfo: {
					departmentId: '', // Backend doesn't return this in create response
					degree: backendData.degree,
					yearOfExperience: backendData.yearOfExperience,
					biography: backendData.biography,
					departmentName: backendData.departmentName,
				},
			}
			return transformedResponse
		})
	},

	updateAccount: (id: string, data: PutAccountRequest) => {
		// Transform frontend request to match backend UpdateAccountRequest structure
		const transformedData = {
			Account: {
				FirstName: data.account?.firstName,
				LastName: data.account?.lastName,
				PhoneNumber: data.account?.phoneNumber || null, // Convert empty string to null
				Email: data.account?.email,
				RoleId: data.account?.roleId,
				Gender: data.account?.gender,
				DateOfBirth: data.account?.dateOfBirth
					? new Date(data.account.dateOfBirth).toISOString().split('T')[0]
					: null,
				AvatarUrl: data.account?.avatarUrl,
				IsDeleted: data.account?.isDeleted,
			},
			StaffInfo: data.staffInfo
				? {
						DepartmentId: data.staffInfo.departmentId,
						Degree: data.staffInfo.degree,
						YearOfExperience: data.staffInfo.yearOfExperience,
						Biography: data.staffInfo.biography,
				  }
				: null,
		}

		return axiosInstance
			.put<any>(`/accounts/${id}`, transformedData)
			.then(res => {
				return res.data || {}
			})
			.catch(err => {
				toast.error(
					`Failed to update account: ${
						err.response?.data?.message || err.message
					}`,
					{
						duration: 5000,
						position: 'top-right',
					}
				)
			})
	},

	delete: (id: string) => {
		return axiosInstance
			.delete<DeleteAccountResponse>(`/accounts/${id}`)
			.then(res => res.data)
	},

	getConsultantById: (id: string) => {
		return axiosInstance
			.get(`/accounts/consultants/${id}`)
			.then(res => res.data)
	},
}

export const useGetMe = () => {
	const tokenStore = useToken()

	return useQuery({
		queryKey: ['me'],
		queryFn: () => accountApi.getMe(),
		refetchOnMount: true,
		refetchOnWindowFocus: true,
		enabled:
			!!tokenStore.accessToken && isTokenValid(tokenStore.accessToken).valid,
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
		mutationFn: (data: CreateAccountRequest) => accountApi.create(data),
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
