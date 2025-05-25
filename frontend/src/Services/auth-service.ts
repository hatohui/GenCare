import { LoginData } from '@/Interfaces/Auth/Schema/login'
import { RegisterFormData } from '@/Interfaces/Auth/Schema/register'
import axios, { AxiosResponse } from 'axios'

const baseUrl = 'https://66fd4486c3a184a84d19c340.mockapi.io/users'

export const registerUser = async (
	data: RegisterFormData
): Promise<AxiosResponse> => {
	const response = await axios.post(baseUrl, data)
	return response
}

export const loginUser = async (data: LoginData): Promise<AxiosResponse> => {
	const response = await axios.post(`someApi`, data)
	return response
}
