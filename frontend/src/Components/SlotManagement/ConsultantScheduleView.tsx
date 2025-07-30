'use client'
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { addDays } from 'date-fns'
import clsx from 'clsx'
import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	Clock,
	User,
	Users,
	CheckCircle,
	Eye,
	X,
} from 'lucide-react'
import { useSchedulesByConsultant } from '@/Services/schedule-services'
import { useConsultantAppointments } from '@/Services/appointment-service'
import { useLocale } from '@/Hooks/useLocale'
import {
	getSlotWeekRange,
	getSlotWeekDays,
	formatSlotWeekRange,
	WORKING_SLOTS,
	formatSlotTimeRange,
	generateSlotDateTime,
} from '@/Utils/SlotHelpers/slotTimeHelpers'
import { getAppointmentsForSlot } from '@/Utils/SlotHelpers/slotAvailabilityHelpers'
import { Appointment } from '@/Interfaces/Appointment/Types/Appointment'

interface ConsultantScheduleViewProps {
	consultantId: string
}

const ConsultantScheduleView = ({
	consultantId,
}: ConsultantScheduleViewProps) => {
	const { t, locale } = useLocale()
	const [currentWeek, setCurrentWeek] = useState(new Date())
	const [selectedSlot, setSelectedSlot] = useState<{
		day: Date
		slotNo: number
		appointments: Appointment[]
	} | null>(null)

	// Get week range
	const { startOfWeek, endOfWeek } = getSlotWeekRange(currentWeek)
	const weekDays = getSlotWeekDays(startOfWeek)

	// Fetch data
	const scheduleQuery = useSchedulesByConsultant(
		consultantId,
		startOfWeek.toISOString(),
		endOfWeek.toISOString()
	)
	const appointmentsQuery = useConsultantAppointments(consultantId)

	const schedule = scheduleQuery.data
	const consultantAppointments = appointmentsQuery.data || []

	const assignedSlots = useMemo(() => {
		const slots = new Set<string>()

		if (schedule?.slots) {
			schedule.slots.forEach(slot => {
				// Parse slot date - handle both with and without timezone
				let slotDate: Date
				if (slot.startAt.includes('Z')) {
					slotDate = new Date(slot.startAt)
				} else {
					slotDate = new Date(slot.startAt + 'Z')
				}

				// Convert to local date for consistent key generation
				const localYear = slotDate.getFullYear()
				const localMonth = (slotDate.getMonth() + 1).toString().padStart(2, '0')
				const localDay = slotDate.getDate().toString().padStart(2, '0')
				const dayKey = `${localYear}-${localMonth}-${localDay}`
				const slotKey = `${dayKey}-${slot.no}`
				slots.add(slotKey)
			})
		}

		return slots
	}, [schedule])

	// Navigation functions
	const goToPreviousWeek = () => {
		setCurrentWeek(prev => addDays(prev, -7))
	}

	const goToNextWeek = () => {
		setCurrentWeek(prev => addDays(prev, 7))
	}

	const goToToday = () => {
		setCurrentWeek(new Date())
	}

	// Check if consultant is assigned to a slot
	const isAssignedToSlot = (day: Date, slotNo: number): boolean => {
		// Use local date to match the assignedSlots format
		const year = day.getFullYear()
		const month = (day.getMonth() + 1).toString().padStart(2, '0')
		const dayStr = day.getDate().toString().padStart(2, '0')
		const dayKey = `${year}-${month}-${dayStr}`
		const slotKey = `${dayKey}-${slotNo}`
		return assignedSlots.has(slotKey)
	}

	// Get slot status
	const getSlotStatus = (day: Date, slotNo: number) => {
		const isAssigned = isAssignedToSlot(day, slotNo)

		const slotAppointments = getAppointmentsForSlot(
			day,
			slotNo,
			consultantAppointments
		)

		const slot = WORKING_SLOTS.find(s => s.no === slotNo)
		if (!slot) return { status: 'not-assigned', appointments: [] }

		// Check if slot is in the past
		const slotDateTime = generateSlotDateTime(day, slot.startTime)
		const isPast = new Date(slotDateTime) < new Date()

		if (isPast) {
			return {
				status: 'past' as const,
				appointments: slotAppointments,
				isAssigned,
			}
		}

		if (!isAssigned) {
			return {
				status: 'not-assigned' as const,
				appointments: [],
				isAssigned: false,
			}
		}

		if (slotAppointments.length > 0) {
			return {
				status: 'booked' as const,
				appointments: slotAppointments,
				isAssigned,
			}
		}

		return {
			status: 'available' as const,
			appointments: [],
			isAssigned,
		}
	}

	// Handle slot click to view details
	const handleSlotClick = (day: Date, slotNo: number) => {
		const slotStatus = getSlotStatus(day, slotNo)
		if (slotStatus.isAssigned) {
			setSelectedSlot({
				day,
				slotNo,
				appointments: slotStatus.appointments,
			})
		}
	}

	// Get slot style based on status
	const getSlotStyle = (day: Date, slotNo: number) => {
		const slotStatus = getSlotStatus(day, slotNo)

		switch (slotStatus.status) {
			case 'booked':
				return 'bg-blue-100 border-blue-300 text-blue-800 cursor-pointer hover:bg-blue-200'
			case 'available':
				return 'bg-green-100 border-green-300 text-green-800 cursor-pointer hover:bg-green-200'
			case 'past':
				return slotStatus.isAssigned
					? 'bg-gray-200 border-gray-300 text-gray-600'
					: 'bg-gray-50 border-gray-200 text-gray-400'
			default:
				return 'bg-gray-50 border-gray-200 text-gray-400'
		}
	}

	// Get slot icon based on status
	const getSlotIcon = (day: Date, slotNo: number) => {
		const slotStatus = getSlotStatus(day, slotNo)

		switch (slotStatus.status) {
			case 'booked':
				return <Users className='w-4 h-4 text-blue-600' />
			case 'available':
				return <CheckCircle className='w-4 h-4 text-green-600' />
			case 'past':
				return <Clock className='w-4 h-4 text-gray-400' />
			default:
				return null
		}
	}

	const isLoading = scheduleQuery.isLoading || appointmentsQuery.isLoading

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
							<Eye className='w-6 h-6 text-green-600' />
							<h1 className='text-2xl font-bold text-gray-900'>
								{t('schedule.my_schedule')}
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
							title={t('schedule.previous_week')}
						>
							<ChevronLeft className='w-4 h-4' />
						</button>
						<button
							onClick={goToToday}
							className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium'
						>
							{t('schedule.today')}
						</button>
						<button
							onClick={goToNextWeek}
							className='p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
							title={t('schedule.next_week')}
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
						<div className='w-3 h-3 bg-green-100 border border-green-300 rounded'></div>
						<span className='text-gray-600'>{t('schedule.available')}</span>
					</div>
					<div className='flex items-center space-x-2'>
						<div className='w-3 h-3 bg-blue-100 border border-blue-300 rounded'></div>
						<span className='text-gray-600'>{t('schedule.booked')}</span>
					</div>
					<div className='flex items-center space-x-2'>
						<div className='w-3 h-3 bg-gray-50 border border-gray-200 rounded'></div>
						<span className='text-gray-600'>{t('schedule.not_assigned')}</span>
					</div>
					<div className='flex items-center space-x-2'>
						<div className='w-3 h-3 bg-gray-200 border border-gray-300 rounded'></div>
						<span className='text-gray-600'>{t('schedule.past')}</span>
					</div>
				</motion.div>

				{/* Consultant Info */}
				{schedule?.account && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
						className='mt-4 bg-green-50 rounded-lg p-4 border border-green-200'
					>
						<div className='flex items-center space-x-3'>
							<User className='w-5 h-5 text-green-600' />
							<div>
								<h3 className='font-medium text-green-800'>
									{schedule.account.firstName} {schedule.account.lastName}
								</h3>
								<p className='text-sm text-green-600'>
									{schedule.account.email}
								</p>
							</div>
						</div>
					</motion.div>
				)}
			</motion.div>

			{/* Loading State */}
			{isLoading && (
				<div className='flex-1 flex items-center justify-center'>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='text-center'
					>
						<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4'></div>
						<p className='text-gray-600'>{t('schedule.loading')}</p>
					</motion.div>
				</div>
			)}

			{/* No Data State */}
			{!isLoading && assignedSlots.size === 0 && (
				<div className='flex-1 flex items-center justify-center'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='text-center max-w-md mx-auto p-8'
					>
						<Calendar className='w-16 h-16 text-gray-300 mx-auto mb-4' />
						<h3 className='text-xl font-semibold text-gray-700 mb-2'>
							{t('schedule.no_schedule_assigned')}
						</h3>
						<p className='text-gray-500 mb-4'>
							{t('schedule.no_schedule_description')}
						</p>
						<div className='text-sm text-gray-400'>
							Week: {formatSlotWeekRange(startOfWeek, endOfWeek)}
						</div>
					</motion.div>
				</div>
			)}

			{/* Schedule Grid */}
			{!isLoading && assignedSlots.size > 0 && (
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
										<div className='text-sm'>
											{day
												.toLocaleDateString(
													locale === 'vi' ? 'vi-VN' : 'en-US',
													{ weekday: 'short' }
												)
												.toUpperCase()}
										</div>
										<div className='text-lg font-bold mt-1'>
											{day.toLocaleDateString(
												locale === 'vi' ? 'vi-VN' : 'en-US',
												{ day: '2-digit' }
											)}
										</div>
										<div className='text-xs text-gray-500 mt-1'>
											{day.toLocaleDateString(
												locale === 'vi' ? 'vi-VN' : 'en-US',
												{ month: 'short' }
											)}
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
										const slotStatus = getSlotStatus(day, slot.no)
										const isClickable =
											slotStatus.isAssigned && slotStatus.status !== 'past'

										return (
											<motion.div
												key={`${day.toISOString()}-${slot.no}`}
												whileHover={isClickable ? { scale: 1.02 } : {}}
												whileTap={isClickable ? { scale: 0.98 } : {}}
												className={clsx(
													'p-3 h-20 border-r border-gray-200 last:border-r-0 transition-all duration-200 relative',
													getSlotStyle(day, slot.no)
												)}
												onClick={() =>
													isClickable && handleSlotClick(day, slot.no)
												}
											>
												<div className='flex items-start justify-between h-full'>
													<div className='flex-1'>
														{getSlotIcon(day, slot.no)}

														{/* Slot Status */}
														{slotStatus.isAssigned && (
															<div className='mt-2'>
																<div className='text-xs font-medium'>
																	{slotStatus.status === 'booked' &&
																		`${
																			slotStatus.appointments.length
																		} appointment${
																			slotStatus.appointments.length > 1
																				? 's'
																				: ''
																		}`}
																	{slotStatus.status === 'available' &&
																		t('schedule.available')}
																	{slotStatus.status === 'past' &&
																		slotStatus.appointments.length > 0 &&
																		`${slotStatus.appointments.length} completed`}
																	{slotStatus.status === 'past' &&
																		slotStatus.appointments.length === 0 &&
																		'No appointments'}
																</div>

																{/* Show first appointment */}
																{slotStatus.appointments.length > 0 && (
																	<div className='text-xs mt-1 truncate'>
																		{slotStatus.appointments[0].memberName}
																	</div>
																)}
															</div>
														)}

														{!slotStatus.isAssigned && (
															<div className='mt-2 text-xs text-gray-400'>
																Not assigned
															</div>
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

			{/* Slot Details Modal */}
			<AnimatePresence>
				{selectedSlot && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 bg-black/30 z-50 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4'
						onClick={e => {
							if (e.target === e.currentTarget) {
								setSelectedSlot(null)
							}
						}}
					>
						<motion.div
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							className='bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden'
						>
							{/* Header */}
							<div className='bg-blue-50 px-6 py-4 border-b border-blue-200'>
								<div className='flex items-center justify-between'>
									<div>
										<h3 className='text-lg font-semibold text-gray-900'>
											{t('schedule.slot_details', {
												0: selectedSlot.slotNo.toString(),
											})}
										</h3>
										<p className='text-sm text-gray-600'>
											{selectedSlot.day.toLocaleDateString(
												locale === 'vi' ? 'vi-VN' : 'en-US',
												{
													weekday: 'long',
													year: 'numeric',
													month: 'long',
													day: 'numeric',
												}
											)}
										</p>
									</div>
									<button
										onClick={() => setSelectedSlot(null)}
										className='p-2 hover:bg-blue-100 rounded-lg transition-colors'
									>
										<X className='w-5 h-5 text-gray-500' />
									</button>
								</div>
							</div>

							{/* Content */}
							<div className='p-6'>
								{selectedSlot.appointments.length === 0 ? (
									<div className='text-center py-8 text-gray-500'>
										<CheckCircle className='w-12 h-12 mx-auto mb-2 text-green-400' />
										<p className='font-medium'>
											{t('schedule.no_appointments_scheduled')}
										</p>
										<p className='text-sm'>
											{t('schedule.available_for_slot')}
										</p>
									</div>
								) : (
									<div>
										<h4 className='font-medium text-gray-900 mb-4'>
											{t('schedule.appointments_count', {
												0: selectedSlot.appointments.length.toString(),
											})}
										</h4>
										<div className='space-y-3'>
											{selectedSlot.appointments.map(appointment => (
												<div
													key={appointment.id}
													className='bg-gray-50 rounded-lg p-4 border border-gray-200'
												>
													<div className='flex items-center justify-between'>
														<div>
															<h5 className='font-medium text-gray-900'>
																{appointment.memberName}
															</h5>
															<p className='text-sm text-gray-600'>
																{(() => {
																	// Parse as UTC, then display in local time
																	const d = new Date(
																		appointment.scheduleAt.endsWith('Z')
																			? appointment.scheduleAt
																			: appointment.scheduleAt + 'Z'
																	)
																	return d.toLocaleTimeString(
																		locale === 'vi' ? 'vi-VN' : 'en-US',
																		{ hour: '2-digit', minute: '2-digit' }
																	)
																})()}
															</p>
														</div>
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
															{t(`appointment.status.${appointment.status}`)}
														</span>
													</div>
													{appointment.joinUrl && (
														<div className='mt-2'>
															<a
																href={appointment.joinUrl}
																target='_blank'
																rel='noopener noreferrer'
																className='text-blue-600 hover:text-blue-800 text-sm underline'
															>
																Join Meeting
															</a>
														</div>
													)}
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default ConsultantScheduleView
