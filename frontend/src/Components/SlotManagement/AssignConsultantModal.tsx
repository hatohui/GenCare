'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Search, User, Mail, Phone, UserCheck, Trash2 } from 'lucide-react'
import { CldImage } from 'next-cloudinary'
import { ConsultantAccount } from '@/Services/consultant-service'

interface AssignConsultantModalProps {
	isOpen: boolean
	onClose: () => void
	onAssign: (consultantIds: string[]) => void // Changed to accept multiple IDs
	slotInfo: {
		slotNo: number
		day: string
		time: string
	}
	consultants: ConsultantAccount[]
	assignedConsultants?: any[] // Already assigned consultants to show for reference
	onRemoveConsultant?: (consultantId: string) => void // New prop for removing consultants
}

const AssignConsultantModal = ({
	isOpen,
	onClose,
	onAssign,
	slotInfo,
	consultants,
	assignedConsultants = [],
	onRemoveConsultant,
}: AssignConsultantModalProps) => {
	const [selectedConsultants, setSelectedConsultants] = useState<string[]>([])
	const [searchTerm, setSearchTerm] = useState('')

	// Filter consultants based on search term
	const filteredConsultants = consultants.filter(
		consultant =>
			!consultant.isDeleted &&
			(consultant.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				consultant.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				consultant.email?.toLowerCase().includes(searchTerm.toLowerCase()))
	)

	const handleAssign = () => {
		if (selectedConsultants.length > 0) {
			onAssign(selectedConsultants)
			setSelectedConsultants([])
			setSearchTerm('')
		}
	}

	const handleCancel = () => {
		setSelectedConsultants([])
		setSearchTerm('')
		onClose()
	}

	const toggleConsultantSelection = (consultantId: string) => {
		setSelectedConsultants(prev =>
			prev.includes(consultantId)
				? prev.filter(id => id !== consultantId)
				: [...prev, consultantId]
		)
	}

	if (!isOpen) return null

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className='fixed inset-0 bg-black/30 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4'
				onClick={e => {
					if (e.target === e.currentTarget) {
						handleCancel()
					}
				}}
			>
				<motion.div
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.95, opacity: 0 }}
					className='bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden'
				>
					{/* Header */}
					<div className='bg-main px-6 py-4 border-b border-blue-100'>
						<div className='flex items-center justify-between'>
							<div>
								<h2 className='text-xl font-semibold text-general'>
									Assign Consultant
								</h2>
								<p className='text-sm text-general mt-1'>
									Slot {slotInfo.slotNo} • {slotInfo.day} • {slotInfo.time}
								</p>
							</div>
							<button
								onClick={handleCancel}
								className='p-2 hover:bg-blue-100 rounded-lg transition-colors'
							>
								<X className='w-5 h-5 text-gray-500' />
							</button>
						</div>
					</div>

					{/* Content */}
					<div className='p-6'>
						{/* Currently Assigned Consultants */}
						{assignedConsultants.length > 0 && (
							<div className='mb-6'>
								<h3 className='text-sm font-medium text-gray-900 mb-3'>
									Currently Assigned ({assignedConsultants.length})
								</h3>
								<div className='space-y-2 p-3 bg-gray-50 rounded-lg border'>
									{assignedConsultants.map(consultant => (
										<div
											key={consultant.id}
											className='flex items-center justify-between text-sm'
										>
											<div className='flex items-center space-x-3'>
												{consultant.avatarUrl ? (
													<CldImage
														src={consultant.avatarUrl}
														alt={`${consultant.firstName} ${consultant.lastName}`}
														width={24}
														height={24}
														className='w-6 h-6 rounded-full object-cover'
													/>
												) : (
													<div className='w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center'>
														<User className='w-3 h-3 text-gray-500' />
													</div>
												)}
												<div>
													<span className='text-gray-700'>
														{consultant.firstName} {consultant.lastName}
													</span>
													<span className='text-gray-500 text-xs ml-2'>
														({consultant.email})
													</span>
												</div>
											</div>
											{onRemoveConsultant && (
												<button
													onClick={() => onRemoveConsultant(consultant.id)}
													className='p-1 hover:bg-red-50 rounded transition-colors group'
													title='Remove consultant'
												>
													<Trash2 className='w-4 h-4 text-gray-400 group-hover:text-red-500' />
												</button>
											)}
										</div>
									))}
								</div>
							</div>
						)}

						{/* Search */}
						<div className='relative mb-4'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
							<input
								type='text'
								placeholder='Search consultants...'
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
								className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							/>
						</div>

						{/* Consultants List */}
						<div className='max-h-96 overflow-y-auto'>
							{filteredConsultants.length === 0 ? (
								<div className='text-center py-8 text-gray-500'>
									<User className='w-12 h-12 mx-auto mb-2 text-gray-300' />
									<p>
										{consultants.length === 0
											? 'No consultants found'
											: 'No available consultants to assign'}
									</p>
									{consultants.length > 0 &&
										filteredConsultants.length === 0 &&
										searchTerm === '' && (
											<p className='text-sm mt-1'>
												All consultants are already assigned to this slot
											</p>
										)}
								</div>
							) : (
								<div className='space-y-2'>
									<div className='text-sm text-gray-600 mb-3'>
										{filteredConsultants.length} available consultant
										{filteredConsultants.length !== 1 ? 's' : ''}
										{selectedConsultants.length > 0 && (
											<span className='ml-2 text-blue-600 font-medium'>
												({selectedConsultants.length} selected)
											</span>
										)}
									</div>
									{filteredConsultants.map(consultant => {
										const isSelected = selectedConsultants.includes(
											consultant.id
										)
										return (
											<motion.div
												key={consultant.id}
												whileHover={{ scale: 1.01 }}
												whileTap={{ scale: 0.99 }}
												className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
													isSelected
														? 'border-blue-500 bg-blue-50'
														: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
												}`}
												onClick={() => toggleConsultantSelection(consultant.id)}
											>
												<div className='flex items-center justify-between'>
													<div className='flex items-center space-x-3'>
														{consultant.avatarUrl ? (
															<CldImage
																src={consultant.avatarUrl}
																alt={`${consultant.firstName} ${consultant.lastName}`}
																width={40}
																height={40}
																className='w-10 h-10 rounded-full object-cover'
															/>
														) : (
															<div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center'>
																<User className='w-5 h-5 text-gray-500' />
															</div>
														)}
														<div>
															<h3 className='font-medium text-gray-900'>
																{consultant.firstName} {consultant.lastName}
															</h3>
															<div className='flex items-center space-x-4 text-sm text-gray-500'>
																<div className='flex items-center space-x-1'>
																	<Mail className='w-3 h-3' />
																	<span>{consultant.email}</span>
																</div>
																{consultant.phoneNumber && (
																	<div className='flex items-center space-x-1'>
																		<Phone className='w-3 h-3' />
																		<span>{consultant.phoneNumber}</span>
																	</div>
																)}
															</div>
														</div>
													</div>
													{selectedConsultants.includes(consultant.id) && (
														<UserCheck className='w-5 h-5 text-blue-600' />
													)}
												</div>
											</motion.div>
										)
									})}
								</div>
							)}
						</div>
					</div>

					{/* Footer */}
					<div className='bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3'>
						<button
							onClick={handleCancel}
							className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors'
						>
							Cancel
						</button>
						<button
							onClick={handleAssign}
							disabled={selectedConsultants.length === 0}
							className='px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
						>
							Assign{' '}
							{selectedConsultants.length > 0 &&
								`(${selectedConsultants.length})`}{' '}
							Consultant{selectedConsultants.length !== 1 ? 's' : ''}
						</button>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	)
}

export default AssignConsultantModal
