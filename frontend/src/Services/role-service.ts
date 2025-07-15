import { DEFAULT_API_URL } from '@/Constants/API'
import { RoleResponse } from '@/Interfaces/Role/schema/role'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const roleApi = {
	// Public API - no authentication required
	getAll: () =>
		axios.get<RoleResponse>(`${DEFAULT_API_URL}/roles`).then(res => res.data),
}

export const useGetAllRoles = () => {
	return useQuery<RoleResponse>({
		queryKey: ['roles'],
		queryFn: () => roleApi.getAll(),
	})
}
