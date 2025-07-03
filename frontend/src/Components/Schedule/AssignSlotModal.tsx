'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

// Mock consultant data - replace with actual API call
const MOCK_CONSULTANTS = [
	{
		id: '1',
		firstName: 'Dr. John',
		lastName: 'Smith',
		email: 'john.smith@clinic.com',
		speciality: 'General Medicine',
	},
	{
		id: '2',
		firstName: 'Dr. Sarah',
		lastName: 'Johnson',
		email: 'sarah.johnson@clinic.com',
		speciality: 'Pediatrics',
	},
	{
		id: '3',
		firstName: 'Dr. Mike',
		lastName: 'Brown',
		email: 'mike.brown@clinic.com',
		speciality: 'Cardiology',
	},
	{
		id: '4',
		firstName: 'Dr. Lisa',
		lastName: 'Davis',
		email: 'lisa.davis@clinic.com',
		speciality: 'Dermatology',
	},
]

interface AssignSlotModalProps {
	isOpen: boolean
	onClose: () => void
	onAssign: (consultantId: string) => void
	slotInfo: {
		slotNo: number
		day: string
		time: string
	}
}

const AssignSlotModal = ({
	isOpen,
	onClose,
	onAssign,
	slotInfo,
}: AssignSlotModalProps) => {
	const [selectedConsultant, setSelectedConsultant] = useState<string>('')
	const [searchTerm, setSearchTerm] = useState('')

	const filteredConsultants = MOCK_CONSULTANTS.filter(
		consultant =>
			`${consultant.firstName} ${consultant.lastName}`
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			consultant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			consultant.speciality.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const handleAssign = () => {
		if (selectedConsultant) {
			onAssign(selectedConsultant)
			setSelectedConsultant('')
			setSearchTerm('')
		}
	}

	const handleClose = () => {
		setSelectedConsultant('')
		setSearchTerm('')
		onClose()
	}

	if (!isOpen) return null

	return (
		<>
			{/* Overlay */}
			<motion.div
				className='fixed inset-0 bg-black/30 backdrop-blur-[6px] z-40'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={handleClose}
			/>

			{/* Modal */}
			<motion.div
				className='fixed inset-0 z-50 flex items-center justify-center px-4'
				initial={{ opacity: 0, scale: 0.95, y: -20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.95, y: -20 }}
				transition={{ duration: 0.2, ease: 'easeOut' }}
			>
				<div
					className='relative bg-white w-full max-w-md rounded-xl p-6 shadow-2xl border border-gray-200 max-h-[80vh] overflow-hidden flex flex-col'
					onClick={e => e.stopPropagation()}
				>
					{/* Close Button */}
					<button
						onClick={handleClose}
						className='absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold'
						aria-label='Close'
					>
						×
					</button>

					{/* Header */}
					<div className='mb-6'>
						<h2 className='text-xl font-semibold text-gray-800 mb-2'>
							Assign Consultant
						</h2>
						<div className='text-sm text-gray-600 space-y-1'>
							<div>
								<strong>Slot:</strong> {slotInfo.slotNo}
							</div>
							<div>
								<strong>Day:</strong> {slotInfo.day}
							</div>
							<div>
								<strong>Time:</strong> {slotInfo.time}
							</div>
						</div>
					</div>

					{/* Search */}
					<div className='mb-4'>
						<input
							type='text'
							placeholder='Search consultants...'
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
						/>
					</div>

					{/* Consultant List */}
					<div className='flex-1 overflow-y-auto mb-6 space-y-2'>
						{filteredConsultants.length === 0 ? (
							<div className='text-center text-gray-500 py-8'>
								No consultants found
							</div>
						) : (
							filteredConsultants.map(consultant => (
								<div
									key={consultant.id}
									className={clsx(
										'p-3 border rounded-lg cursor-pointer transition-colors',
										selectedConsultant === consultant.id
											? 'border-blue-500 bg-blue-50'
											: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
									)}
									onClick={() => setSelectedConsultant(consultant.id)}
								>
									<div className='font-medium text-gray-900'>
										{consultant.firstName} {consultant.lastName}
									</div>
									<div className='text-sm text-gray-600'>
										{consultant.email}
									</div>
									<div className='text-sm text-blue-600'>
										{consultant.speciality}
									</div>
								</div>
							))
						)}
					</div>

					{/* Actions */}
					<div className='flex space-x-3'>
						<button
							onClick={handleClose}
							className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors'
						>
							Cancel
						</button>
						<button
							onClick={handleAssign}
							disabled={!selectedConsultant}
							className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
						>
							Assign
						</button>
					</div>
				</div>
			</motion.div>
		</>
	)
}

export default AssignSlotModal
