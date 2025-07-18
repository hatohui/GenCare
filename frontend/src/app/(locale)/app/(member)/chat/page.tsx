'use client'
import ChatArea from '@/Components/Chat/ChatArea'
import ChatControl from '@/Components/Chat/ChatControl'
import { useAiChat } from '@/Hooks/Chat/useAIChat'
import { useGetMe } from '@/Services/account-service'

const ChatPage = () => {
	const {
		history,
		inputValue,
		setInputValue,
		inputRef,
		isPending,
		isError,
		sendMessage,
	} = useAiChat()

	const { data } = useGetMe()

	return (
		<div className='flex flex-col h-full justify-between rounded-lg shadow-lg overflow-hidden bg-general text-text'>
			<ChatArea
				history={history}
				isPending={isPending}
				isError={isError}
				userIcon={data?.avatarUrl}
				consultantIcon=''
			/>
			<ChatControl
				inputRef={inputRef}
				isPending={isPending}
				inputValue={inputValue}
				setInputValue={setInputValue}
				sendMessage={sendMessage}
			/>
		</div>
	)
}

export default ChatPage
