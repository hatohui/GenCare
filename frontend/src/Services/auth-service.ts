import { DEFAULT_API_URL } from '@/Constants/API'
import { LoginApi } from '@/Interfaces/Auth/Schema/login'
import { OauthAPI } from '@/Interfaces/Auth/Schema/oauth'
import { RegisterApi } from '@/Interfaces/Auth/Schema/register'
import { TokenData } from '@/Interfaces/Auth/Schema/token'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

const AUTH_URL = `${DEFAULT_API_URL}/auth`

const authApi = {
	register: (data: RegisterApi) =>
		axios.post<TokenData>(`${AUTH_URL}/register`, data).then(res => res.data),
	login: (data: LoginApi) =>
		axios.post<TokenData>(`${AUTH_URL}/login`, data).then(res => res.data),
	Oauth: (data: OauthAPI) =>
		axios
			.post<TokenData>(`${AUTH_URL}/google`, {
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
