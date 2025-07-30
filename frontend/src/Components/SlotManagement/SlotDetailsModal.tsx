'use client'
import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
	X,
	User,
	Mail,
	Phone,
	Calendar,
	Clock,
	Users,
	AlertCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import { Appointment } from '@/Interfaces/Appointment/Types/Appointment'
import {
	WORKING_SLOTS,
	formatSlotTimeRange,
} from '@/Utils/SlotHelpers/slotTimeHelpers'
import { CldImage } from 'next-cloudinary'

interface SlotDetailsModalProps {
	isOpen: boolean
	onClose: () => void
	slotInfo: {
		day: Date
		slotNo: number
		slot: (typeof WORKING_SLOTS)[0]
	}
	assignedConsultants: any[]
	appointments: Appointment[]
	onRemoveConsultant: (consultantId: string) => void
	onAddMoreConsultants?: () => void // New prop to allow adding more
	availableConsultantsCount?: number // Show how many can still be added
}

const SlotDetailsModal = ({
	isOpen,
	onClose,
	slotInfo,
	assignedConsultants,
	appointments,
	onRemoveConsultant,
	onAddMoreConsultants,
	availableConsultantsCount = 0,
}: SlotDetailsModalProps) => {
	if (!isOpen) return null

	const hasAppointments = appointments.length > 0

	// Function to check if a consultant can be removed
	const canRemoveConsultant = (consultantId: string) => {
		// If there are no appointments, consultant can be removed
		if (!hasAppointments) return true

		// If there are appointments, check if this specific consultant has any appointments
		const consultantHasAppointments = appointments.some(
			appointment => appointment.staffId === consultantId
		)

		// If consultant has appointments, they cannot be removed
		if (consultantHasAppointments) return false

		// If consultant has no appointments but there are other appointments,
		// only allow removal if there are multiple consultants assigned
		return assignedConsultants.length > 1
	}

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className='fixed inset-0 bg-black/30 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4'
				onClick={e => {
					if (e.target === e.currentTarget) {
						onClose()
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
									Slot Details
								</h2>
								<div className='flex items-center space-x-4 text-sm text-general mt-1'>
									<div className='flex items-center space-x-1'>
										<Calendar className='w-4 h-4' />
										<span>{format(slotInfo.day, 'EEEE, MMMM d, yyyy')}</span>
									</div>
									<div className='flex items-center space-x-1'>
										<Clock className='w-4 h-4' />
										<span>
											Slot {slotInfo.slotNo} •{' '}
											{formatSlotTimeRange(
												slotInfo.slot.startTime,
												slotInfo.slot.endTime
											)}
										</span>
									</div>
								</div>
							</div>
							<button
								onClick={onClose}
								className='p-2 hover:bg-blue-100 rounded-lg transition-colors'
							>
								<X className='w-5 h-5 text-gray-500' />
							</button>
						</div>
					</div>

					{/* Content */}
					<div className='p-6 max-h-96 overflow-y-auto'>
						{/* Warning for appointments */}
						{hasAppointments && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className='border rounded-lg p-4 mb-6 bg-yellow-50 border-yellow-200'
							>
								<div className='flex items-start space-x-3'>
									<AlertCircle className='w-5 h-5 mt-0.5 text-yellow-600' />
									<div>
										<h3 className='font-medium text-yellow-800'>
											Active Appointments
										</h3>
										<p className='text-sm mt-1 text-yellow-700'>
											This slot has {appointments.length} active appointment
											{appointments.length > 1 ? 's' : ''}. Consultants with
											appointments cannot be removed.
										</p>
									</div>
								</div>
							</motion.div>
						)}

						{/* Assigned Consultants Section */}
						<div className='mb-6'>
							<div className='flex items-center space-x-2 mb-4'>
								<Users className='w-5 h-5 text-gray-700' />
								<h3 className='text-lg font-semibold text-gray-900'>
									Assigned Consultants ({assignedConsultants.length})
								</h3>
							</div>

							{assignedConsultants.length === 0 ? (
								<div className='text-center py-8 text-gray-500'>
									<Users className='w-12 h-12 mx-auto mb-2 text-gray-300' />
									<p>No consultants assigned to this slot</p>
								</div>
							) : (
								<div className='space-y-3'>
									{assignedConsultants.map((consultant, index) => (
										<motion.div
											key={consultant.id || `consultant-${index}`}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: index * 0.1 }}
											className='bg-gray-50 rounded-lg p-4 border border-gray-200'
										>
											<div className='flex items-center justify-between'>
												<div className='flex items-center space-x-3'>
													{consultant.avatarUrl ? (
														<CldImage
															width={40}
															height={40}
															src={consultant.avatarUrl}
															alt={`${consultant.firstName} ${consultant.lastName}`}
															className='w-10 h-10 rounded-full object-cover'
														/>
													) : (
														<div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center'>
															<User className='w-5 h-5 text-gray-500' />
														</div>
													)}
													<div>
														<h4 className='font-medium text-gray-900'>
															{consultant.firstName} {consultant.lastName}
														</h4>
														<div className='flex items-center space-x-4 text-sm text-gray-500'>
															<div className='flex items-center space-x-1'>
																<Mail className='w-3 h-3' />
																<span>{consultant.email}</span>
															</div>
															{consultant.phone && (
																<div className='flex items-center space-x-1'>
																	<Phone className='w-3 h-3' />
																	<span>{consultant.phone}</span>
																</div>
															)}
														</div>
													</div>
												</div>
												{canRemoveConsultant(consultant.id) ? (
													<button
														onClick={() => {
															console.log(
																'Remove button clicked for consultant:',
																consultant
															)
															console.log(
																'Consultant scheduleId:',
																consultant.scheduleId
															)
															onRemoveConsultant(consultant.id)
														}}
														className='px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200'
													>
														Remove
													</button>
												) : (
													<button
														disabled
														className='px-3 py-1 text-sm text-gray-400 bg-gray-100 rounded-lg border border-gray-200 cursor-not-allowed'
														title={
															appointments.some(
																app => app.staffId === consultant.id
															)
																? 'Cannot remove consultant with active appointments'
																: 'Cannot remove consultant'
														}
													>
														Remove
													</button>
												)}
											</div>
										</motion.div>
									))}
								</div>
							)}
						</div>

						{/* Appointments Section */}
						{appointments.length > 0 && (
							<div>
								<div className='flex items-center space-x-2 mb-4'>
									<Calendar className='w-5 h-5 text-gray-700' />
									<h3 className='text-lg font-semibold text-gray-900'>
										Appointments ({appointments.length})
									</h3>
								</div>

								<div className='space-y-3'>
									{appointments.map((appointment, index) => (
										<motion.div
											key={appointment.id}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: index * 0.1 }}
											className='bg-blue-50 rounded-lg p-4 border border-blue-200'
										>
											<div className='flex items-center justify-between'>
												<div>
													<h4 className='font-medium text-gray-900'>
														{appointment.memberName}
													</h4>
													<p className='text-sm text-gray-600'>
														with {appointment.staffName}
													</p>
													<p className='text-sm text-gray-500 mt-1'>
														{format(new Date(appointment.scheduleAt), 'h:mm a')}
													</p>
												</div>
												<div className='text-right'>
													<span
														className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
															appointment.status === 'confirmed' ||
															appointment.status === 'booked'
																? 'bg-green-100 text-green-800'
																: appointment.status === 'pending'
																? 'bg-yellow-100 text-yellow-800'
																: 'bg-red-100 text-red-800'
														}`}
													>
														{appointment.status}
													</span>
												</div>
											</div>
										</motion.div>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Footer */}
					<div className='bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between'>
						<div>
							{onAddMoreConsultants &&
								availableConsultantsCount > 0 &&
								!hasAppointments && (
									<button
										onClick={onAddMoreConsultants}
										className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
									>
										Add More Consultants ({availableConsultantsCount} available)
									</button>
								)}
						</div>
						<button
							onClick={onClose}
							className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors'
						>
							Close
						</button>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	)
}

export default SlotDetailsModal
