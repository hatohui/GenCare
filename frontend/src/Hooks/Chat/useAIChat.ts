'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
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

		setHistory(prev => [...prev, userMessage])

		const query: GeminiQuery = {
			message: inputValue,
			history,
		}

		mutation.mutate(query)
		setInputValue('')
		inputRef.current?.focus()
	}, [inputValue, history, mutation])

	useEffect(() => {
		if (mutation.data) {
			const response = mutation.data as GoogleAiResponse
			if ('message' in response) {
				setHistory(prev => [
					...prev,
					{ role: 'model', parts: [{ text: response.message }] },
				])
			}
		}
	}, [mutation.data])

	useEffect(() => {
		if (mutation.isError) {
			setHistory(prev => [
				...prev,
				{
					role: 'model',
					parts: [{ text: 'Error: Failed to get response from AI' }],
				},
			])
		}
	}, [mutation.isError])

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
