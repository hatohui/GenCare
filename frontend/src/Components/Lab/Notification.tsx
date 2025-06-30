import React from 'react'

interface NotificationProps {
	type: 'success' | 'error'
	message: string
	onClose: () => void
}

const Notification = ({ type, message, onClose }: NotificationProps) => {
	return (
		<div
			className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg text-white ${
				type === 'success' ? 'bg-green-500' : 'bg-red-500'
			}`}
		>
			<div className='flex items-center gap-4'>
				<span>{message}</span>
				<button onClick={onClose} className='ml-4 text-white font-bold'>
					×
				</button>
			</div>
		</div>
	)
}

export default Notification
