'use client'
import { useState, useRef, useCallback } from 'react'
import { Content } from '@google/genai'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

export type GeminiQuery = {
	history?: Content[]
	message: string
}

export type GoogleAiResponse =
	| {
			message: string
	  }
	| {
			error: string | unknown
	  }

const GEMINI_CHAT_API_URL = '/api/gemini/chat'

export const useAiChat = () => {
	const [history, setHistory] = useState<Content[]>([])
	const [inputValue, setInputValue] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)

	const mutation = useGeminiChatApi()

	const sendMessage = useCallback(() => {
		if (!inputValue.trim()) return

		const userMessage: Content = {
			role: 'user',
			parts: [{ text: inputValue }],
		}

		const query: GeminiQuery = {
			message: inputValue,
			history: [...history, userMessage],
		}

		mutation.mutate(query, {
			onSuccess: (response: GoogleAiResponse) => {
				setHistory(prev => {
					const newHistory = [...prev, userMessage]
					if ('message' in response) {
						return [
							...newHistory,
							{ role: 'model', parts: [{ text: response.message }] },
						]
					}
					return newHistory
				})
			},
			onError: () => {
				setHistory(prev => [
					...prev,
					userMessage,
					{
						role: 'model',
						parts: [{ text: 'Error: Failed to get response from AI' }],
					},
				])
			},
		})
		setInputValue('')
		inputRef.current?.focus()
	}, [inputValue, history, mutation])

	return {
		history,
		inputValue,
		setInputValue,
		inputRef,
		isPending: mutation.isPending,
		isError: mutation.isError,
		sendMessage,
	}
}

const useGeminiChatApi = () => {
	return useMutation({
		mutationFn: async (data: GeminiQuery) => {
			const response = await axios.post<GoogleAiResponse>(
				GEMINI_CHAT_API_URL,
				data
			)
			return response.data
		},
	})
}
