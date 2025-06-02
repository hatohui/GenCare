import { DEFAULT_API_URL } from '@/Constants/API'
import {
	ACCESS_TOKEN_COOKIE_STRING,
	REFRESH_TOKEN_COOKIE_STRING,
} from '@/Constants/Auth'
import { LoginApi } from '@/Interfaces/Auth/Schema/login'
import { LogoutRequest } from '@/Interfaces/Auth/Schema/logout'
import { OauthAPI } from '@/Interfaces/Auth/Schema/oauth'
import { RegisterApi } from '@/Interfaces/Auth/Schema/register'
import { TokenData } from '@/Interfaces/Auth/Schema/token'
import { removeTokens } from '@/Utils/removeTokens'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { getCookie } from 'cookies-next/client'

const AUTH_URL = `${DEFAULT_API_URL}/auth`

const getRefreshToken = () => getCookie(ACCESS_TOKEN_COOKIE_STRING)

const authApi = {
	register: (data: RegisterApi) => {
		return axios
			.post<TokenData>(`${AUTH_URL}/register`, data)
			.then(res => res.data)
	},
	login: (data: LoginApi) => {
		return axios
			.post<TokenData>(`${AUTH_URL}/login`, data)
			.then(res => res.data)
	},
	Oauth: (data: OauthAPI) => {
		return axios
			.post<TokenData>(`${AUTH_URL}/google`, {
				credential: data.credential,
			})
			.then(res => res.data)
	},
	logout: () => {
		const data: LogoutRequest = {
			refreshToken: getCookie(REFRESH_TOKEN_COOKIE_STRING),
		}
		return axios
			.post(`${AUTH_URL}/logout`, data, {
				headers: { Authorization: getRefreshToken() },
			})
			.then(res => {
				if (res) removeTokens()
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
	return useMutation({
		mutationFn: authApi.logout,
	})
}
