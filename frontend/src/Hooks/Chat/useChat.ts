import { useConnection } from '@/Services/chat-service'
import { useEffect } from 'react'

const useChat = (consultantId: string) => {
	const connection = useConnection(consultantId)

	useEffect(() => {
		const startConnection = async () => {
			if (connection) {
				await connection.start()
			}
		}

		startConnection()
	}, [])

	const sendMessage = (message: string) => {
		connection?.send('SendMessage', message)
	}

	return { connection, sendMessage }
}

export default useChat
