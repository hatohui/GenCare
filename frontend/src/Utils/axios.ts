// /app/lib/axios.ts
import axios from 'axios'
import { DEFAULT_API_URL } from '@/Constants/API'

const axiosInstance = axios.create({
	baseURL: DEFAULT_API_URL,
	withCredentials: true,
})

axiosInstance.interceptors.response.use(
	res => res,
	async error => {
		const originalRequest = error.config

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true

			try {
				// Call refresh token API (cookie refresh_token will be sent automatically)
				await axiosInstance.post(
					'/refresh-token',
					{},
					{
						withCredentials: true,
					}
				)

				// Re-send the original failed request
				return axiosInstance(originalRequest)
			} catch (refreshError) {
				// Optional: logout the user or redirect to login
				// window.location.href = '/login'; (if you want to force re-login)
				return Promise.reject(refreshError)
			}
		}

		return Promise.reject(error)
	}
)

export default axiosInstance
