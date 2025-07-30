'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
	X,
	Search,
	User,
	Mail,
	Phone,
	UserCheck,
	Trash2,
	Plus,
} from 'lucide-react'
import { CldImage } from 'next-cloudinary'
import { ConsultantAccount } from '@/Services/consultant-service'
import { Appointment } from '@/Interfaces/Appointment/Types/Appointment'

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
	appointments?: Appointment[] // Add appointments prop to check if slot is booked
}

const AssignConsultantModal = ({
	isOpen,
	onClose,
	onAssign,
	slotInfo,
	consultants,
	assignedConsultants = [],
	onRemoveConsultant,
	appointments = [],
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

	// Check if there are appointments (booked slot)
	const hasAppointments = appointments.length > 0
	// Allow removal if there are no appointments OR if there are multiple consultants assigned
	const canRemoveConsultants =
		!hasAppointments || assignedConsultants.length > 1

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
					className='bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-scroll'
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
						{/* Warning for appointments */}
						{hasAppointments && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className='border rounded-lg p-4 mb-6 bg-yellow-50 border-yellow-200'
							>
								<div className='flex items-start space-x-3'>
									<div className='text-yellow-600'>
										<svg
											className='w-5 h-5'
											fill='currentColor'
											viewBox='0 0 20 20'
										>
											<path
												fillRule='evenodd'
												d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
												clipRule='evenodd'
											/>
										</svg>
									</div>
									<div>
										<h3 className='font-medium text-yellow-800'>
											Active Appointments
										</h3>
										<p className='text-sm mt-1 text-yellow-700'>
											This slot has {appointments.length} active appointment
											{appointments.length > 1 ? 's' : ''}. You can add more
											consultants but cannot remove the last consultant while
											appointments are scheduled.
										</p>
									</div>
								</div>
							</motion.div>
						)}
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
											{onRemoveConsultant && canRemoveConsultants ? (
												<button
													onClick={() => onRemoveConsultant(consultant.id)}
													className='p-1 hover:bg-red-50 rounded transition-colors group'
													title='Remove consultant'
												>
													<Trash2 className='w-4 h-4 text-gray-400 group-hover:text-red-500' />
												</button>
											) : (
												onRemoveConsultant && (
													<button
														disabled
														className='p-1 rounded transition-colors group cursor-not-allowed'
														title={
															hasAppointments &&
															assignedConsultants.length === 1
																? 'Cannot remove the last consultant when there are active appointments'
																: 'Cannot remove consultant'
														}
													>
														<Trash2 className='w-4 h-4 text-gray-300' />
													</button>
												)
											)}
										</div>
									))}
								</div>
							</div>
						)}

						{/* Add More Consultants Section */}
						{assignedConsultants.length > 0 &&
							filteredConsultants.length > 0 && (
								<div className='mb-6'>
									<div className='flex items-center justify-between mb-3'>
										<h3 className='text-sm font-medium text-gray-900 flex items-center'>
											<Plus className='w-4 h-4 mr-2 text-blue-600' />
											Add More Consultants ({filteredConsultants.length}{' '}
											available)
										</h3>
										{hasAppointments && (
											<div className='text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200'>
												✓ Can add to booked slot
											</div>
										)}
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
