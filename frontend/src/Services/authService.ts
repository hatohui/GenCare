import { UserData } from '@/Interfaces/Users/UserData'
import axios, { AxiosResponse } from 'axios'

const baseUrl = 'https://66fd4486c3a184a84d19c340.mockapi.io/users'

export const registerUser = async (data: UserData): Promise<AxiosResponse> => {
	const response = await axios.post(baseUrl, data)
	return response
}
