import { DEFAULT_API_URL } from '@/Constants/API'
import { DepartmentResponse } from '@/Interfaces/Department/schema/department'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const DEPARTMENT_API_URL = `${DEFAULT_API_URL}/departments`

const departmentApi = {
	getAll: () =>
		axios.get<DepartmentResponse>(DEPARTMENT_API_URL).then(res => res.data),
}

export const useGetAllDepartments = () => {
	return useQuery<DepartmentResponse>({
		queryKey: ['departments'],
		queryFn: () => departmentApi.getAll(),
	})
}
