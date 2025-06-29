import { ChatSessionPrompt } from '@/Constants/ChatSessionPrompt'
import { Content, GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({})

export const createChatSession = (history?: Content[]) => {
	const prompt = ChatSessionPrompt

	return ai.chats.create({
		model: 'gemini-2.5-flash',
		history: history ? [...prompt, ...history] : prompt,
	})
}
