'use client'
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
		<div className='flex flex-col h-full justify-between'>
			<div className='flex-1 overflow-y-auto'>
				{messages.map((message, index) => (
					<div key={index} className='flex flex-col py-2 px-4'>
						<span className='text-sm font-bold'>{message.from}:</span>
						<span className='text-sm'>{message.text}</span>
					</div>
				))}
			</div>
			<div className='flex px-4 py-2'>
				<input
					ref={inputRef}
					type='text'
					value={inputValue}
					onChange={e => setInputValue(e.target.value)}
					className='flex-1 px-4 py-2 border-t border-b border-gray-300'
					onKeyDown={e => {
						if (e.key === 'Enter') {
							sendMessage()
						}
					}}
				/>
				<button
					onClick={sendMessage}
					className='px-4 py-2 bg-blue-500 text-white rounded-md'
				>
					Send
				</button>
			</div>
		</div>
	)
}

export default ChatPage
