import axios from 'axios'
import { DEFAULT_API_URL } from '@/Constants/API'
import useToken from '@/Hooks/Auth/useToken'

const axiosInstance = axios.create({
	baseURL: DEFAULT_API_URL + '/api',
	withCredentials: true,
})

axiosInstance.interceptors.request.use(
	config => {
		const token = useToken.getState().accessToken
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	error => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
	res => res,
	async error => {
		const originalRequest = error.config

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true

			try {
				// Call refresh token API (cookie refresh_token will be sent automatically)
				const data = await axiosInstance.post(
					'/refresh-token',
					{},
					{
						withCredentials: true,
					}
				)

				useToken.getState().setAccessToken(data.data.accessToken)

				originalRequest.headers = originalRequest.headers || {}
				originalRequest.headers[
					'Authorization'
				] = `Bearer ${data.data.accessToken}`

				return axiosInstance(originalRequest)
			} catch (refreshError) {
				window.location.href = '/login'
				return Promise.reject(refreshError)
			}
		}

		return Promise.reject(error)
	}
)

export default axiosInstance
