import { DEFAULT_API_URL } from '@/Constants/API'
import axios from 'axios'

const BOOKING_URL = `${DEFAULT_API_URL}/services`

const bookingApi = {
	BookServices: (data: any) => {
		return axios
			.post(`${BOOKING_URL}/book`, data)
			.then(res => res.data)
			.catch(error => {
				console.error('Error booking services:', error)
				throw error
			})
	},
}
