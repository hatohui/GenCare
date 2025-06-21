import { DEFAULT_API_URL } from '@/Constants/API'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'
import axios from 'axios'

const BOOKING_URL = `${DEFAULT_API_URL}/services`

const bookingApi = {
	BookServices: (data: any, header: string) => {
		return axios
			.post(`${BOOKING_URL}/book`, data, { headers: { Authorization: header } })
			.then(res => res.data)
			.catch(error => {
				console.error('Error booking services:', error)
				throw error
			})
	},
}

export const useBookServices = () => {
	const header = useAccessTokenHeader()

	return {
		mutate: (data: any) => bookingApi.BookServices(data, header),
	}
}
