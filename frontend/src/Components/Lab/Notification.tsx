import React from 'react'

interface NotificationProps {
	type: 'success' | 'error'
	message: string
	onClose: () => void
}

const Notification = ({ type, message, onClose }: NotificationProps) => {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			onClose()
		}
	}

	return (
		<div
			className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg text-white ${
				type === 'success' ? 'bg-green-500' : 'bg-red-500'
			}`}
			role="alert"
			aria-live="polite"
			onKeyDown={handleKeyDown}
			tabIndex={-1}
		>
			<div className='flex items-center gap-4'>
				<span>{message}</span>
				<button
					onClick={onClose}
					className='ml-4 text-white font-bold hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded'
					aria-label="Close notification"
					type="button"
				>
					×
				</button>
			</div>
		</div>
	)
}

export default Notification
