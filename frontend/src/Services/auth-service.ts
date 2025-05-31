import { DEFAULT_API_URL } from '@/Constants/API'
import { LoginAPI } from '@/Interfaces/Auth/Schema/login'
import { OauthAPI } from '@/Interfaces/Auth/Schema/oauth'
import { RegisterAPI } from '@/Interfaces/Auth/Schema/register'
import { TokenData } from '@/Interfaces/Auth/Schema/token'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

const AUTH_URL = `${DEFAULT_API_URL}/auth`

const authApi = {
	register: (data: RegisterAPI) =>
		axios.post<TokenData>(`${AUTH_URL}/register`, data).then(res => res.data),

	login: (data: LoginAPI) =>
		axios.post<TokenData>(`${AUTH_URL}/login`, data).then(res => res.data),
	Oauth: (data: OauthAPI) =>
		axios
			.post<TokenData>(`${AUTH_URL}/oauth`, {
				credential: data.credential,
			})
			.then(res => res.data),
}

export const useRegisterAccount = () => {
	return useMutation({
		mutationFn: authApi.register,
	})
}

export const useLoginAccount = () => {
	return useMutation({
		mutationFn: authApi.login,
	})
}

export const useOauthAccount = () => {
	return useMutation({
		mutationFn: authApi.Oauth,
	})
}
