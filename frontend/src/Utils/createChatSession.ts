import { ChatSessionPrompt } from '@/Constants/ChatSessionPrompt'
import { Content, GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
	apiKey: process.env.GOOGLE_AI_API_KEY || '',
})

export const createChatSession = (conversationHistory?: Content[]) => {
	const fullHistory =
		conversationHistory && conversationHistory.length > 0
			? [...ChatSessionPrompt, ...conversationHistory]
			: ChatSessionPrompt

	return ai.chats.create({
		model: 'gemini-2.5-flash',
		history: fullHistory,
	})
}
