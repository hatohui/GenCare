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
		<div className='fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[9999] p-4'>
			<div className='bg-white rounded-xl shadow-lg border border-gray-200 w-[80%] relative max-h-[95vh] overflow-y-auto'>
				<button
					onClick={onClose}
					className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-2xl font-bold z-10'
					aria-label='Đóng'
				>
					×
				</button>
				<div className='h-full '>
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
