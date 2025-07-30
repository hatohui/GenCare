import { DepartmentResponse } from '@/Interfaces/Department/schema/department'
import axiosInstance from '@/Utils/axios'
import { useQuery } from '@tanstack/react-query'

const departmentApi = {
	getAll: () =>
		axiosInstance.get<DepartmentResponse>('/departments').then(res => res.data),
}

export const useGetAllDepartments = () => {
	return useQuery<DepartmentResponse>({
		queryKey: ['departments'],
		queryFn: () => departmentApi.getAll(),
	})
}
