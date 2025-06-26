'use client'
import ChatArea from '@/Components/Chat/ChatArea'
import ChatControl from '@/Components/Chat/ChatControl'
import clsx from 'clsx'
import React, { useState, useRef } from 'react'

const ChatPage = () => {
	const [messages, setMessages] = useState<{ text: string; from: string }[]>([])
	const [inputValue, setInputValue] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)

	const sendMessage = () => {
		if (inputValue) {
			setMessages(prevMessages => [
				...prevMessages,
				{ text: inputValue, from: 'You' },
			])

			setInputValue('')
		}

		inputRef.current?.focus()
	}

	return (
		<div className='flex flex-col h-full justify-between rounded-lg shadow-lg overflow-hidden bg-general text-text'>
			<ChatArea messages={messages} />
			<ChatControl
				inputRef={inputRef}
				inputValue={inputValue}
				setInputValue={setInputValue}
				sendMessage={sendMessage}
			/>
		</div>
	)
}

export default ChatPage
