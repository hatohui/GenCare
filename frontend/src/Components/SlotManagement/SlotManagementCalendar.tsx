'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { format, addDays, isSameHour, addHours } from 'date-fns'
import clsx from 'clsx'
import {
	ChevronLeft,
	ChevronRight,
	Users,
	Clock,
	AlertCircle,
	CheckCircle,
	UserCheck,
	Settings,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
	useAllSchedules,
	useCreateSchedule,
	useDeleteSchedule,
} from '@/Services/schedule-services'
import { useAllSlotsAdmin, useCreateSlot } from '@/Services/slot-services'
import { useAppointments } from '@/Services/appointment-service'
import { useConsultants } from '@/Services/consultant-service'
import {
	getSlotWeekRange,
	getSlotWeekDays,
	formatSlotWeekRange,
	WORKING_SLOTS,
	formatSlotTimeRange,
} from '@/Utils/SlotHelpers/slotTimeHelpers'
import { getSlotStatus } from '@/Utils/SlotHelpers/slotAvailabilityHelpers'
import AssignConsultantModal from './AssignConsultantModal'
import SlotDetailsModal from './SlotDetailsModal'
import { CreateSlotRequest } from '@/Interfaces/Slot/Schema/slot'
import { CreateScheduleRequest } from '@/Interfaces/Schedule/Schema/schedule'

interface SlotManagementCalendarProps {
	isManager?: boolean
}

const SlotManagementCalendar = ({
	isManager = false,
}: SlotManagementCalendarProps) => {
	const [currentWeek, setCurrentWeek] = useState(new Date())
	const [selectedSlot, setSelectedSlot] = useState<{
		day: Date
		slotNo: number
		slot: (typeof WORKING_SLOTS)[0]
	} | null>(null)
	const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
	const { startOfWeek, endOfWeek } = getSlotWeekRange(currentWeek)
	const weekDays = getSlotWeekDays(startOfWeek)

	const schedulesQuery = useAllSchedules(
		startOfWeek.toISOString(),
		endOfWeek.toISOString()
	)
	const appointmentsQuery = useAppointments()
	const consultantsQuery = useConsultants()
	const slotsQuery = useAllSlotsAdmin()

	const createScheduleMutation = useCreateSchedule()
	const deleteScheduleMutation = useDeleteSchedule()
	const createSlotMutation = useCreateSlot()

	const schedules = schedulesQuery.data || []
	const appointments = appointmentsQuery.data || []
	const consultants = consultantsQuery.data?.consultants || []
	const slots = slotsQuery.data?.slots || []

	const goToPreviousWeek = () => {
		setCurrentWeek(prev => addDays(prev, -7))
	}

	const goToNextWeek = () => {
		setCurrentWeek(prev => addDays(prev, 7))
	}

	const goToToday = () => {
		setCurrentWeek(new Date())
	}

	const handleSlotClick = (day: Date, slotNo: number) => {
		if (!isManager) return

		const slot = WORKING_SLOTS.find(s => s.no === slotNo)
		if (!slot) return

		const slotStatus = getSlotStatus(day, slotNo, appointments, schedules)
		const availableConsultants = getAvailableConsultants(day, slotNo)

		setSelectedSlot({ day, slotNo, slot })

		// If slot has appointments, only show details (can't modify)
		if (slotStatus.appointments.length > 0) {
			setIsDetailsModalOpen(true)
		}
		// If no available consultants left, show details to manage existing ones
		else if (availableConsultants.length === 0) {
			if (slotStatus.assignedConsultants.length > 0) {
				setIsDetailsModalOpen(true)
			} else {
				toast.error('No available consultants to assign to this slot')
			}
		}
		// If there are available consultants, allow assignment (even if some already assigned)
		else {
			setIsAssignModalOpen(true)
		}
	}

	const handleAssignConsultant = async (consultantIds: string[]) => {
		if (!selectedSlot) return

		const { day, slotNo, slot } = selectedSlot
		const startTime = addHours(day, parseInt(slot.startTime.split(':')[0]))
		const endTime = addHours(day, parseInt(slot.endTime.split(':')[0]))

		// Check for duplicates before assignment
		const currentAssignedConsultants = getSlotStatus(
			day,
			slotNo,
			appointments,
			schedules
		).assignedConsultants
		const currentAssignedIds = currentAssignedConsultants.map(c => c.id)

		const duplicateIds = consultantIds.filter(id =>
			currentAssignedIds.includes(id)
		)
		if (duplicateIds.length > 0) {
			const duplicateNames = duplicateIds
				.map(id => {
					const consultant = consultants.find(c => c.id === id)
					return `${consultant?.firstName} ${consultant?.lastName}`
				})
				.join(', ')
			toast.error(
				`Consultant(s) ${duplicateNames} are already assigned to this slot`
			)
			return
		}

		const targetSlot = slots.find(
			slotItem =>
				slotItem.no === slotNo &&
				isSameHour(new Date(slotItem.startAt + 'Z'), startTime) &&
				isSameHour(new Date(slotItem.endAt + 'Z'), endTime)
		)

		let slotIdToUse = targetSlot?.id

		// Create slot if it doesn't exist
		if (!targetSlot) {
			const newSlot: CreateSlotRequest = {
				no: slotNo,
				startTime: startTime.toISOString(),
				endTime: endTime.toISOString(),
				isDeleted: false,
			}

			try {
				const slotResult = await createSlotMutation.mutateAsync(newSlot)
				slotIdToUse = slotResult.slotId
			} catch (error: any) {
				toast.error(error?.response?.data?.message || 'Failed to create slot')
				return
			}
		}

		// Create schedules for each consultant
		const promises = consultantIds.map(consultantId => {
			const newSchedule: CreateScheduleRequest = {
				slotId: slotIdToUse || '',
				accountId: consultantId,
			}
			return createScheduleMutation.mutateAsync(newSchedule)
		})

		try {
			await Promise.all(promises)
			toast.success(
				`${consultantIds.length} consultant${
					consultantIds.length > 1 ? 's' : ''
				} assigned successfully!`
			)
			schedulesQuery.refetch()
		} catch (error: any) {
			toast.error(
				error?.response?.data?.message || 'Failed to assign some consultants'
			)
		}

		setIsAssignModalOpen(false)
	}

	const handleRemoveConsultant = (consultantId: string) => {
		if (!selectedSlot) return

		// Get the assigned consultants with their scheduleIds
		const slotStatus = getSlotStatus(
			selectedSlot.day,
			selectedSlot.slotNo,
			appointments,
			schedules
		)

		// Check if this is the last consultant and there are appointments
		const hasAppointments = slotStatus.appointments.length > 0
		const isLastConsultant = slotStatus.assignedConsultants.length === 1

		if (hasAppointments && isLastConsultant) {
			toast.error(
				'Cannot remove the last consultant when there are active appointments'
			)
			return
		}

		const targetConsultant = slotStatus.assignedConsultants.find(
			(consultant: any) => consultant.id === consultantId
		)

		if (!targetConsultant || !targetConsultant.scheduleId) {
			toast.error('Schedule not found for this consultant')
			return
		}

		// Delete the schedule using the scheduleId
		deleteScheduleMutation.mutate(targetConsultant.scheduleId, {
			onSuccess: () => {
				const remainingConsultants = slotStatus.assignedConsultants.length - 1
				toast.success(
					`Consultant removed successfully! ${remainingConsultants} consultant${
						remainingConsultants !== 1 ? 's' : ''
					} remaining in this slot.`
				)
				schedulesQuery.refetch()
			},
			onError: error => {
				console.error('Error removing consultant:', error)
				toast.error('Failed to remove consultant')
			},
		})
	}

	const handleAddMoreConsultants = () => {
		setIsDetailsModalOpen(false)
		setIsAssignModalOpen(true)
	}

	// Get available consultants (those not already assigned to this slot)
	const getAvailableConsultants = (day: Date, slotNo: number) => {
		const slotStatus = getSlotStatus(day, slotNo, appointments, schedules)
		const assignedConsultantIds = slotStatus.assignedConsultants.map(c => c.id)
		return consultants.filter(
			consultant => !assignedConsultantIds.includes(consultant.id)
		)
	}

	const getSlotStyle = (day: Date, slotNo: number) => {
		const slotStatus = getSlotStatus(day, slotNo, appointments, schedules)

		switch (slotStatus.status) {
			case 'booked':
				return 'bg-red-100 border-red-300 text-red-800'
			case 'assigned':
				return 'bg-green-100 border-green-300 text-green-800'
			case 'past':
				return 'bg-gray-100 border-gray-300 text-gray-500'
			default:
				return 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
		}
	}

	const getSlotIcon = (day: Date, slotNo: number) => {
		const slotStatus = getSlotStatus(day, slotNo, appointments, schedules)

		switch (slotStatus.status) {
			case 'booked':
				return <AlertCircle className='w-4 h-4 text-red-600' />
			case 'assigned':
				return <CheckCircle className='w-4 h-4 text-green-600' />
			case 'past':
				return <Clock className='w-4 h-4 text-gray-400' />
			default:
				return <Users className='w-4 h-4 text-gray-400' />
		}
	}

	const isLoading =
		schedulesQuery.isLoading ||
		appointmentsQuery.isLoading ||
		consultantsQuery.isLoading ||
		slotsQuery.isLoading

	return (
		<div className='w-full h-full flex flex-col bg-gray-50'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className='bg-white shadow-sm border-b border-gray-200 p-6'
			>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-4'>
						<div className='flex items-center space-x-2'>
							<Settings className='w-6 h-6 text-blue-600' />
							<h1 className='text-2xl font-bold text-gray-900'>
								Slot Management
							</h1>
						</div>
						<div className='text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full'>
							{formatSlotWeekRange(startOfWeek, endOfWeek)}
						</div>
					</div>

					{/* Navigation Controls */}
					<div className='flex items-center space-x-2'>
						<button
							onClick={goToPreviousWeek}
							className='p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
							title='Previous Week'
						>
							<ChevronLeft className='w-4 h-4' />
						</button>
						<button
							onClick={goToToday}
							className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'
						>
							Today
						</button>
						<button
							onClick={goToNextWeek}
							className='p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
							title='Next Week'
						>
							<ChevronRight className='w-4 h-4' />
						</button>
					</div>
				</div>

				{/* Status Legend */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className='mt-4 flex flex-wrap items-center gap-4 text-sm'
				>
					<div className='flex items-center space-x-2'>
						<div className='w-3 h-3 bg-white border border-gray-200 rounded'></div>
						<span className='text-gray-600'>Available</span>
					</div>
					<div className='flex items-center space-x-2'>
						<div className='w-3 h-3 bg-green-100 border border-green-300 rounded'></div>
						<span className='text-gray-600'>Assigned</span>
					</div>
					<div className='flex items-center space-x-2'>
						<div className='w-3 h-3 bg-red-100 border border-red-300 rounded'></div>
						<span className='text-gray-600'>Booked</span>
					</div>
					<div className='flex items-center space-x-2'>
						<div className='w-3 h-3 bg-gray-100 border border-gray-300 rounded'></div>
						<span className='text-gray-600'>Past</span>
					</div>
				</motion.div>
			</motion.div>

			{/* Loading State */}
			{isLoading && (
				<div className='flex-1 flex items-center justify-center'>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='text-center'
					>
						<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
						<p className='text-gray-600'>Loading schedule...</p>
					</motion.div>
				</div>
			)}

			{/* Calendar Grid */}
			{!isLoading && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className='flex-1 overflow-auto p-6'
				>
					<div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
						<div className='min-w-[1000px]'>
							{/* Header Row */}
							<div className='grid grid-cols-8 border-b border-gray-200'>
								<div className='p-4 bg-gray-50 font-semibold text-gray-700 border-r border-gray-200'>
									Time Slot
								</div>
								{weekDays.map(day => (
									<div
										key={day.toISOString()}
										className='p-4 bg-gray-50 text-center font-semibold text-gray-700 border-r border-gray-200 last:border-r-0'
									>
										<div className='text-sm'>{format(day, 'EEE')}</div>
										<div className='text-lg font-bold mt-1'>
											{format(day, 'd')}
										</div>
										<div className='text-xs text-gray-500 mt-1'>
											{format(day, 'MMM')}
										</div>
									</div>
								))}
							</div>

							{/* Slot Rows */}
							{WORKING_SLOTS.map((slot, slotIndex) => (
								<motion.div
									key={slot.no}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.4 + slotIndex * 0.1 }}
									className='grid grid-cols-8 border-b border-gray-200 last:border-b-0'
								>
									{/* Slot Info */}
									<div className='p-4 bg-gray-50 border-r border-gray-200 flex flex-col justify-center'>
										<div className='font-semibold text-gray-800'>
											Slot {slot.no}
										</div>
										<div className='text-sm text-gray-600 mt-1'>
											{formatSlotTimeRange(slot.startTime, slot.endTime)}
										</div>
									</div>

									{/* Day Columns */}
									{weekDays.map(day => {
										const slotStatus = getSlotStatus(
											day,
											slot.no,
											appointments,
											schedules
										)

										const isClickable =
											isManager && slotStatus.status !== 'past'

										return (
											<motion.div
												key={`${day.toISOString()}-${slot.no}`}
												whileHover={isClickable ? { scale: 1.02 } : {}}
												whileTap={isClickable ? { scale: 0.98 } : {}}
												className={clsx(
													'p-3 h-20 border-r border-gray-200 last:border-r-0 transition-all duration-200 relative',
													getSlotStyle(day, slot.no),
													isClickable && 'cursor-pointer'
												)}
												onClick={() =>
													isClickable && handleSlotClick(day, slot.no)
												}
											>
												<div className='flex items-start justify-between h-full'>
													<div className='flex-1'>
														{getSlotIcon(day, slot.no)}

														{/* Assigned Consultants */}
														{slotStatus.assignedConsultants.length > 0 && (
															<div className='mt-2'>
																<div className='text-xs font-medium mb-1'>
																	{slotStatus.assignedConsultants.length}{' '}
																	consultant
																	{slotStatus.assignedConsultants.length > 1
																		? 's'
																		: ''}
																</div>

																{slotStatus.assignedConsultants.length <= 3 ? (
																	<div className='space-y-1'>
																		{slotStatus.assignedConsultants.map(
																			consultant => (
																				<div
																					key={consultant.id}
																					className='inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200 max-w-full cursor-pointer hover:bg-blue-200 transition-colors'
																					title={`${consultant.firstName} ${consultant.lastName} - Click to view details`}
																					onClick={e => {
																						e.stopPropagation()
																						setSelectedSlot({
																							day,
																							slotNo: slot.no,
																							slot,
																						})
																						setIsDetailsModalOpen(true)
																					}}
																				>
																					<span className='truncate'>
																						{consultant.firstName}{' '}
																						{consultant.lastName}
																					</span>
																				</div>
																			)
																		)}
																	</div>
																) : (
																	<div className='space-y-1'>
																		{slotStatus.assignedConsultants
																			.slice(0, 2)
																			.map((consultant, index) => (
																				<div
																					key={`${consultant.id}-${index}`}
																					className='inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200 max-w-full cursor-pointer hover:bg-blue-200 transition-colors'
																					title={`${consultant.firstName} ${consultant.lastName} - Click to view details`}
																					onClick={e => {
																						e.stopPropagation()
																						setSelectedSlot({
																							day,
																							slotNo: slot.no,
																							slot,
																						})
																						setIsDetailsModalOpen(true)
																					}}
																				>
																					<span className='truncate'>
																						{consultant.firstName}{' '}
																						{consultant.lastName}
																					</span>
																				</div>
																			))}
																		<div
																			className='inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors'
																			title={`View all ${slotStatus.assignedConsultants.length} consultants`}
																			onClick={e => {
																				e.stopPropagation()
																				setSelectedSlot({
																					day,
																					slotNo: slot.no,
																					slot,
																				})
																				setIsDetailsModalOpen(true)
																			}}
																		>
																			+
																			{slotStatus.assignedConsultants.length -
																				2}{' '}
																			more
																		</div>
																	</div>
																)}
															</div>
														)}

														{/* Appointments Count */}
														{slotStatus.appointments.length > 0 && (
															<div className='mt-2'>
																<div className='text-xs font-medium text-red-600'>
																	{slotStatus.appointments.length} appointment
																	{slotStatus.appointments.length > 1
																		? 's'
																		: ''}
																</div>
															</div>
														)}
													</div>

													{/* Status Indicator */}
													<div className='flex items-center space-x-1'>
														{slotStatus.status === 'assigned' && (
															<UserCheck className='w-3 h-3 text-green-600' />
														)}
													</div>
												</div>
											</motion.div>
										)
									})}
								</motion.div>
							))}
						</div>
					</div>
				</motion.div>
			)}

			{/* Assign Consultant Modal */}
			<AnimatePresence>
				{isAssignModalOpen && selectedSlot && (
					<AssignConsultantModal
						isOpen={isAssignModalOpen}
						onClose={() => {
							setIsAssignModalOpen(false)
							setSelectedSlot(null)
						}}
						onAssign={handleAssignConsultant}
						onRemoveConsultant={handleRemoveConsultant}
						slotInfo={{
							slotNo: selectedSlot.slotNo,
							day: format(selectedSlot.day, 'EEEE, MMMM d'),
							time: formatSlotTimeRange(
								selectedSlot.slot.startTime,
								selectedSlot.slot.endTime
							),
						}}
						consultants={getAvailableConsultants(
							selectedSlot.day,
							selectedSlot.slotNo
						)}
						assignedConsultants={
							getSlotStatus(
								selectedSlot.day,
								selectedSlot.slotNo,
								appointments,
								schedules
							).assignedConsultants
						}
					/>
				)}
			</AnimatePresence>

			{/* Slot Details Modal */}
			<AnimatePresence>
				{isDetailsModalOpen && selectedSlot && (
					<SlotDetailsModal
						isOpen={isDetailsModalOpen}
						onClose={() => {
							setIsDetailsModalOpen(false)
							setSelectedSlot(null)
						}}
						slotInfo={{
							day: selectedSlot.day,
							slotNo: selectedSlot.slotNo,
							slot: selectedSlot.slot,
						}}
						assignedConsultants={
							getSlotStatus(
								selectedSlot.day,
								selectedSlot.slotNo,
								appointments,
								schedules
							).assignedConsultants
						}
						appointments={
							getSlotStatus(
								selectedSlot.day,
								selectedSlot.slotNo,
								appointments,
								schedules
							).appointments
						}
						onRemoveConsultant={handleRemoveConsultant}
						onAddMoreConsultants={handleAddMoreConsultants}
						availableConsultantsCount={
							getAvailableConsultants(selectedSlot.day, selectedSlot.slotNo)
								.length
						}
					/>
				)}
			</AnimatePresence>
		</div>
	)
}

export default SlotManagementCalendar
