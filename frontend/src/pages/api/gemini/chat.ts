import { NextApiHandler } from 'next'
import { createChatSession } from '@/Utils/createChatSession'
import { GoogleAiResponse } from '@/Hooks/Chat/useAIChat'

const handler: NextApiHandler<GoogleAiResponse> = async (req, res) => {
	const { history, message } = req.body

	if (!message) return res.status(400).json({ error: 'No message provided' })

	if (!message || typeof message !== 'string' || message.trim().length === 0) {
		return res.status(400).json({ error: 'Valid message is required' })
	}

	if (history && !Array.isArray(history)) {
		return res.status(400).json({ error: 'History must be an array' })
	}

	try {
		switch (req.method) {
			case 'POST':
				// Create a chat session with the system prompt + conversation history
				console.log('Received history:', history)

				const chat = createChatSession(history)

				// Send the current user message
				// The sendMessage method expects a string parameter
				const response = await chat.sendMessage(message)

				if (!response || !response.text)
					return res.status(404).json({ error: 'No response message' })

				return res.status(200).json({ message: response.text })
			default:
				return res.status(405).json({ error: 'Method not allowed' })
		}
	} catch (error) {
		console.error('Chat API Error:', error)
		return res.status(500).json({
			error: 'Internal server error',
			details: error instanceof Error ? error.message : 'Unknown error',
		})
	}
}

export default handler
