import { DEFAULT_API_URL } from '@/Constants/API'
import { useAccountStore } from '@/Hooks/useAccount'
import useToken from '@/Hooks/Auth/useToken'
import { LoginApi } from '@/Interfaces/Auth/Schema/login'
import { OauthAPI } from '@/Interfaces/Auth/Schema/oauth'
import { RegisterApi } from '@/Interfaces/Auth/Schema/register'
import { TokenData } from '@/Interfaces/Auth/Schema/token'
import axiosInstance from '@/Utils/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const authApi = {
	register: (data: RegisterApi) => {
		return axios
			.post<TokenData>(`${DEFAULT_API_URL}/api/auth/register`, data)
			.then(res => res.data)
	},
	login: (data: LoginApi) => {
		return axios
			.post<TokenData>(`${DEFAULT_API_URL}/api/auth/login`, data, {
				withCredentials: true,
			})
			.then(res => {
				return res.data
			})
	},
	Oauth: (data: OauthAPI) => {
		return axiosInstance
			.post<TokenData>(
				'/auth/google',
				{
					credential: data.credential,
				},
				{
					withCredentials: true,
				}
			)
			.then(res => res.data)
	},
	logout: (logoutHandler: () => void) => {
		return axiosInstance
			.post(
				'/auth/logout',
				{},
				{
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
	isEmailExist: (email: string) => {
		return axiosInstance
			.post<boolean>(`/auth/check-email`, {
				email,
			})
			.then(res => res.data)
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
	const queryClient = useQueryClient()

	const handleLogout = () => {
		tokenStore.removeAccessToken()
		accountStore.removeAccount()
		queryClient.invalidateQueries({ queryKey: ['me'] })
	}

	return useMutation({
		mutationFn: () => authApi.logout(handleLogout),
	})
}

export const useIsEmailExist = () => {
	return useMutation({
		mutationFn: (email: string) => authApi.isEmailExist(email),
	})
}
