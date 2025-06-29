import { NextApiHandler } from 'next'
import { createChatSession } from '@/Utils/createChatSession'
import { GoogleAiResponse } from '@/Interfaces/Chat/schemas/GoogleAiResponse'

const handler: NextApiHandler<GoogleAiResponse> = async (req, res) => {
	const { history, message } = req.body

	if (!message) return res.status(400).json({ error: 'No message provided' })

	try {
		const chat = createChatSession(history)

		const response = await chat.sendMessage({ message })

		if (!response || !response.text)
			return res.status(404).json({ error: 'No response message' })

		return res.status(200).json({ message: response.text })
	} catch (error) {
		return res.status(500).json({ error })
	}
}

export default handler
