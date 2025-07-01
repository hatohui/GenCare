import React from 'react'
import TestResultEditForm from './TestResultEditForm'

interface TestResultEditModalProps {
	isOpen: boolean
	onClose: () => void
	orderDetailId: string | null
	useMock?: boolean
}

const TestResultEditModal: React.FC<TestResultEditModalProps> = ({
	isOpen,
	onClose,
	orderDetailId,
	useMock = false,
}) => {
	if (!isOpen || !orderDetailId) return null

	return (
		<div className='fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4'>
			<div className='bg-white rounded-[30px] max-w-lg w-full shadow-2xl relative'>
				<button
					onClick={onClose}
					className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-2xl font-bold'
					aria-label='Đóng'
				>
					×
				</button>
				<div className='p-6'>
					<TestResultEditForm
						orderDetailId={orderDetailId}
						onSuccess={onClose}
						useMock={useMock}
					/>
				</div>
			</div>
		</div>
	)
}

export default TestResultEditModal
