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
				const chat = createChatSession(history)

				const response = await chat.sendMessage({ message })

				if (!response || !response.text)
					return res.status(404).json({ error: 'No response message' })

				return res.status(200).json({ message: response.text })
			default:
				return res.status(405).json({ error: 'Method not allowed' })
		}
	} catch (error) {
		return res.status(500).json({ message: 'Internal server error' })
	}
}

export default handler
