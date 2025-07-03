import { DEFAULT_API_URL } from '@/Constants/API'
import { RoleResponse } from '@/Interfaces/Role/schema/role'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const ROLE_API_URL = `${DEFAULT_API_URL}/roles`

const roleApi = {
	getAll: () => axios.get<RoleResponse>(ROLE_API_URL).then(res => res.data),
}

export const useGetAllRoles = () => {
	return useQuery<RoleResponse>({
		queryKey: ['roles'],
		queryFn: () => roleApi.getAll(),
	})
}
