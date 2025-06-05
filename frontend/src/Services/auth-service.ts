import { DEFAULT_API_URL } from '@/Constants/API'
import useToken from '@/Hooks/useToken'
import { LoginApi } from '@/Interfaces/Auth/Schema/login'
import { OauthAPI } from '@/Interfaces/Auth/Schema/oauth'
import { RegisterApi } from '@/Interfaces/Auth/Schema/register'
import { TokenData } from '@/Interfaces/Auth/Schema/token'
import { useAccessTokenHeader } from '@/Utils/getAccessTokenHeader'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

const AUTH_URL = `${DEFAULT_API_URL}/auth`

const authApi = {
	register: (data: RegisterApi) => {
		return axios
			.post<TokenData>(`${AUTH_URL}/register`, data)
			.then(res => res.data)
	},
	login: (data: LoginApi) => {
		return axios
			.post<TokenData>(`${AUTH_URL}/login`, data, {
				withCredentials: true,
			})
			.then(res => {
				return res.data
			})
	},
	Oauth: (data: OauthAPI) => {
		return axios
			.post<TokenData>(`${AUTH_URL}/google`, {
				credential: data.credential,
			})
			.then(res => res.data)
	},
	logout: (header: string, logoutHandler: () => void) => {
		return axios
			.post(
				`${AUTH_URL}/logout`,
				{},
				{
					headers: { Authorization: header },
					withCredentials: true,
				}
			)
			.then(res => {
				if (res.status === 204) {
					logoutHandler()
				}

				return res.data
			})
	},
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

export const useLogoutAccount = () => {
	const tokenStore = useToken()
	const header = useAccessTokenHeader()

	return useMutation({
		mutationFn: () => authApi.logout(header, tokenStore.removeAccessToken),
	})
}
