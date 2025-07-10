import { DEFAULT_API_URL } from '@/Constants/API'
import { DepartmentResponse } from '@/Interfaces/Department/schema/department'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const departmentApi = {
	// Public API - no authentication required
	getAll: () =>
		axios
			.get<DepartmentResponse>(`${DEFAULT_API_URL}/departments`)
			.then(res => res.data),
}

export const useGetAllDepartments = () => {
	return useQuery<DepartmentResponse>({
		queryKey: ['departments'],
		queryFn: () => departmentApi.getAll(),
	})
}
