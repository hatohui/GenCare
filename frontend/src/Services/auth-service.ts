import { DEFAULT_API_URL } from '@/Constants/API'
import { LoginAPI } from '@/Interfaces/Auth/Schema/login'
import { RegisterAPI } from '@/Interfaces/Auth/Schema/register'
import { TokenData } from '@/Interfaces/Auth/Schema/token'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

const authApi = {
	register: (data: RegisterAPI) =>
		axios
			.post<TokenData>(`${DEFAULT_API_URL}/register`, data)
			.then(res => res.data),

	login: (data: LoginAPI) =>
		axios
			.post<TokenData>(`${DEFAULT_API_URL}/login`, data)
			.then(res => res.data),
}

export const useRegisterAccount = (data: RegisterAPI) => {
	return useMutation({
		mutationFn: () => authApi.register(data),
	})
}

export const useLoginAccount = (credentials: LoginAPI) => {
	return useMutation({
		mutationFn: () => authApi.login(credentials),
	})
}
