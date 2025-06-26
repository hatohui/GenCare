import React from 'react'

const ChatControl = ({
	inputRef,
	inputValue,
	setInputValue,
	sendMessage,
}: {
	inputRef: React.RefObject<HTMLInputElement | null>
	inputValue: string
	setInputValue: React.Dispatch<React.SetStateAction<string>>
	sendMessage: () => void
}) => {
	return (
		<div className='flex p-4 gap-2'>
			<input
				ref={inputRef}
				type='text'
				value={inputValue}
				onChange={e => setInputValue(e.target.value)}
				className='flex-1 px-4 py-2 rounded-md border border-secondary bg-general'
				onKeyDown={e => {
					if (e.key === 'Enter') {
						sendMessage()
					}
				}}
			/>
			<button
				onClick={sendMessage}
				className='px-4 py-2 rounded-md bg-main text-white'
			>
				Send
			</button>
		</div>
	)
}

export default ChatControl
