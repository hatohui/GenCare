import { DEFAULT_API_URL } from '@/Constants/API'
import { useAccountStore } from '@/Hooks/useAccount'
import useToken from '@/Hooks/Auth/useToken'
import { LoginApi } from '@/Interfaces/Auth/Schema/login'
import { OauthAPI } from '@/Interfaces/Auth/Schema/oauth'
import { RegisterApi } from '@/Interfaces/Auth/Schema/register'
import { TokenData } from '@/Interfaces/Auth/Schema/token'
import axiosInstance from '@/Utils/axios'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
		return axiosInstance
			.post<TokenData>(
				`${AUTH_URL}/google`,
				{
					credential: data.credential,
				},
				{
					withCredentials: true,
				}
			)
			.then(res => res.data)
	},
	logout: (header: string | undefined, logoutHandler: () => void) => {
		if (!header || header?.endsWith('undefined')) {
			logoutHandler()
			return Promise.resolve()
		}

		return axiosInstance
			.post(
				`${AUTH_URL}/logout`,
				{},
				{
					withCredentials: true,
					headers: { Authorization: header },
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
	const accountStore = useAccountStore()
	const header = useAccessTokenHeader()
	const queryClient = useQueryClient()

	const handleLogout = () => {
		tokenStore.removeAccessToken()
		accountStore.removeAccount()
		queryClient.invalidateQueries({ queryKey: ['me'] })
	}

	return useMutation({
		mutationFn: () => authApi.logout(header, handleLogout),
	})
}
