import { DEFAULT_API_URL } from '@/Constants/API'
import { RoleResponse } from '@/Interfaces/Role/schema/role'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const roleApi = {
	getAll: () =>
		axios
			.get<RoleResponse>(`${DEFAULT_API_URL}/api/roles`)
			.then(res => res.data),
}

export const useGetAllRoles = () => {
	return useQuery<RoleResponse>({
		queryKey: ['roles'],
		queryFn: () => roleApi.getAll(),
	})
}
