import { Todo } from '@/Interfaces/Api'
import { stimulateLoad } from '@/Utils/LoadStimulate'
import axios, { AxiosResponse } from 'axios'

const baseURL = 'https://jsonplaceholder.typicode.com/todos'

const getAll = async (): Promise<Todo[]> => {
	try {
		const response: AxiosResponse<Todo[]> = await axios.get<Todo[]>(baseURL)
		await stimulateLoad(5000)
		return response.data
	} catch (error) {
		console.error(error)
		throw new Error('Failed to fetch todos')
	}
}

export { getAll }
