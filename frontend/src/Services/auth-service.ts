import { DEFAULT_API_URL } from '@/Constants/Service'
import { LoginData } from '@/Interfaces/Auth/Schema/login'
import { RegisterFormData } from '@/Interfaces/Auth/Schema/register'
import axios, { AxiosResponse } from 'axios'

export const registerUser = async (
	data: RegisterFormData
): Promise<AxiosResponse> => {
	const response = await axios.post(`${DEFAULT_API_URL}/users`, data)
	return response
}

export const loginUser = async (data: LoginData): Promise<AxiosResponse> => {
	const response = await axios.post(`${DEFAULT_API_URL}/login`, data)
	return response
}

export const googleLogin = async (email: string) => {}
export const googleRegister = async (email: string) => {}
