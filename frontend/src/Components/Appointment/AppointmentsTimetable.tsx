'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAppointments } from '@/Services/appointment-service'
import { AppointmentCell } from './AppointmentCell'
import { CurrentTimeLine } from './CurrentTimeLine'
import { Appointment } from '@/Interfaces/Appointment/Types/Appointment'
import {
	Clock,
	Briefcase,
	BarChart3,
	TrendingUp,
	Calendar,
	Search,
	ChevronLeft,
	ChevronRight,
	Eye,
} from 'lucide-react'
import {
	getWeekRange,
	getWeekDays,
	generateTimeSlots,
	groupAppointmentsByDateTime,
	filterAppointmentsForWeek,
	formatWeekRange,
	parseUTCToLocal,
} from '@/Utils/Appointment/timeSlotHelpers'
import { useLocale } from '@/Hooks/useLocale'

export const AppointmentsTimetable = () => {
	const { t, locale } = useLocale()
	const [currentWeek, setCurrentWeek] = useState(new Date())
	const { data, isLoading, error, refetch } = useAppointments()
	const [pastTimeSlots, setPastTimeSlots] = useState<Set<string>>(new Set())
	const [highlightedSlot, setHighlightedSlot] = useState<string | null>(null)
	const cellRefs = useRef<{ [key: string]: HTMLTableCellElement | null }>({})

	const { startOfWeek, endOfWeek } = getWeekRange(currentWeek)

	// Memoize weekDays to prevent recreation on every render
	const weekDays = useMemo(() => getWeekDays(startOfWeek), [startOfWeek])

	// Filter appointments for current week
	const weekAppointments = useMemo(
		() => (data ? filterAppointmentsForWeek(data, startOfWeek, endOfWeek) : []),
		[data, startOfWeek, endOfWeek]
	)

	// Generate all time slots and group appointments - memoize to prevent recreation
	const timeSlots = useMemo(() => generateTimeSlots(), [])
	const groupedAppointments = useMemo(
		() => groupAppointmentsByDateTime(weekAppointments),
		[weekAppointments]
	)

	// Helper để tạo local date key
	const getLocalDateKey = useCallback((date: Date) => {
		const year = date.getFullYear()
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const day = date.getDate().toString().padStart(2, '0')
		return `${year}-${month}-${day}`
	}, [])

	// Handle time slot status changes from CurrentTimeLine - optimized to prevent unnecessary updates
	const handleTimeSlotStatusChange = useCallback(
		(day: Date, timeSlot: string, isPast: boolean) => {
			const dateKey = getLocalDateKey(day)
			const slotKey = `${dateKey}-${timeSlot}`

			setPastTimeSlots(prev => {
				// Only update if the status actually changed
				const currentStatus = prev.has(slotKey)
				if (currentStatus === isPast) {
					return prev // No change needed
				}

				const newSet = new Set(prev)
				if (isPast) {
					newSet.add(slotKey)
				} else {
					newSet.delete(slotKey)
				}
				return newSet
			})
		},
		[getLocalDateKey]
	)

	// Check if a specific time slot is past
	const isTimeSlotPast = useCallback(
		(day: Date, timeSlot: string): boolean => {
			const dateKey = getLocalDateKey(day)
			const slotKey = `${dateKey}-${timeSlot}`
			return pastTimeSlots.has(slotKey)
		},
		[pastTimeSlots]
	)

	// Helper function to check if an appointment is in the future (properly handling UTC)
	const isAppointmentInFuture = useCallback(
		(appointment: Appointment): boolean => {
			const now = new Date()
			// Parse UTC time and compare with current local time
			const appointmentDate = parseUTCToLocal(appointment.scheduleAt)
			return appointmentDate > now
		},
		[]
	)

	// Filter to get only future appointments
	const futureAppointments = useMemo(
		() => (data ? data.filter(isAppointmentInFuture) : []),
		[data, isAppointmentInFuture]
	)
	const futureWeekAppointments = useMemo(
		() => weekAppointments.filter(isAppointmentInFuture),
		[weekAppointments, isAppointmentInFuture]
	)

	const goToPreviousWeek = useCallback(() => {
		const prevWeek = new Date(currentWeek)
		prevWeek.setDate(currentWeek.getDate() - 7)
		setCurrentWeek(prevWeek)
	}, [currentWeek])

	const goToNextWeek = useCallback(() => {
		const nextWeek = new Date(currentWeek)
		nextWeek.setDate(currentWeek.getDate() + 7)
		setCurrentWeek(nextWeek)
	}, [currentWeek])

	const goToCurrentWeek = useCallback(() => {
		setCurrentWeek(new Date())
	}, [])

	const goToFirstAppointmentWeek = useCallback(() => {
		if (futureAppointments && futureAppointments.length > 0) {
			// Find the earliest future appointment date (properly handling UTC)
			const earliest = futureAppointments.reduce(
				(min: Appointment, curr: Appointment) => {
					const minDate = parseUTCToLocal(min.scheduleAt)
					const currDate = parseUTCToLocal(curr.scheduleAt)
					return currDate < minDate ? curr : min
				}
			)
			const earliestDate = parseUTCToLocal(earliest.scheduleAt)
			setCurrentWeek(earliestDate)

			// Highlight the slot for a few seconds
			const dateKey = getLocalDateKey(earliestDate)
			const hour = earliestDate.getHours().toString().padStart(2, '0')
			const slotKey = `${dateKey}-${hour}:00`
			setHighlightedSlot(slotKey)
			setTimeout(() => setHighlightedSlot(null), 4000)
		}
	}, [futureAppointments])

	useEffect(() => {
		if (highlightedSlot && cellRefs.current[highlightedSlot]) {
			cellRefs.current[highlightedSlot]?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center',
			})
		}
	}, [highlightedSlot])

	if (isLoading) {
		return (
			<div className='flex-1 flex items-center justify-center'>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='text-center'
				>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600'>{t('schedule.loading')}</p>
				</motion.div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex-1 flex items-center justify-center'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='text-center max-w-md mx-auto p-8'
				>
					<div className='text-red-600 mb-4'>
						<svg
							className='w-16 h-16 mx-auto'
							fill='currentColor'
							viewBox='0 0 24 24'
						>
							<path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
						</svg>
					</div>
					<h3 className='text-xl font-semibold text-gray-700 mb-2'>
						{t('appointment.error_occurred')}
					</h3>
					<p className='text-gray-500 mb-4'>{error.message}</p>
					<button
						onClick={() => refetch()}
						className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2 mx-auto'
					>
						<svg
							className='w-5 h-5'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
							/>
						</svg>
						<span>{t('appointment.retry')}</span>
					</button>
				</motion.div>
			</div>
		)
	}

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
							<Eye className='w-6 h-6 text-blue-600' />
							<h1 className='text-2xl font-bold text-gray-900'>
								{t('appointment.my_appointments')}
							</h1>
						</div>
						<div className='text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full'>
							{formatWeekRange(startOfWeek, endOfWeek)}
						</div>
					</div>

					{/* Navigation Controls */}
					<div className='flex items-center space-x-2'>
						<button
							onClick={goToPreviousWeek}
							className='p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
							title={t('appointment.previous_week')}
						>
							<ChevronLeft className='w-4 h-4' />
						</button>
						<button
							onClick={goToCurrentWeek}
							className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'
						>
							{t('appointment.current')}
						</button>
						<button
							onClick={goToNextWeek}
							className='p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
							title={t('appointment.next_week')}
						>
							<ChevronRight className='w-4 h-4' />
						</button>
						<AnimatePresence>
							{futureAppointments && futureAppointments.length > 0 && (
								<motion.button
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{
										opacity: 1,
										scale: 1,
										...(futureWeekAppointments.length === 0
											? {
													boxShadow: [
														'0 0 0 0 rgba(34, 197, 94, 0.7)',
														'0 0 0 10px rgba(34, 197, 94, 0)',
														'0 0 0 0 rgba(34, 197, 94, 0)',
													],
													scale: [1, 1.05, 1],
											  }
											: {}),
									}}
									exit={{ opacity: 0, scale: 0.8 }}
									whileTap={{ scale: 0.95 }}
									onClick={goToFirstAppointmentWeek}
									transition={{
										duration: futureWeekAppointments.length === 0 ? 2 : 0.3,
										repeat: futureWeekAppointments.length === 0 ? Infinity : 0,
										repeatType: 'reverse',
									}}
									className={`px-4 py-2 rounded-lg transition-all duration-200 shadow-sm text-sm font-medium flex items-center space-x-2 ${
										futureWeekAppointments.length === 0
											? 'bg-green-600 text-white animate-pulse'
											: 'bg-green-600 text-white hover:bg-green-700'
									}`}
								>
									<Search className='w-4 h-4' />
									<span>
										{futureWeekAppointments.length === 0
											? t('appointment.find_appointment')
											: t('appointment.find_appointment')}
									</span>
								</motion.button>
							)}
						</AnimatePresence>
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
						<span className='text-gray-600'>
							{t('appointment.status.confirmed')}
						</span>
					</div>
					<div className='flex items-center space-x-2'>
						<div className='w-3 h-3 bg-yellow-100 border border-yellow-300 rounded'></div>
						<span className='text-gray-600'>
							{t('appointment.status.pending')}
						</span>
					</div>
					<div className='flex items-center space-x-2'>
						<div className='w-3 h-3 bg-red-100 border border-red-300 rounded'></div>
						<span className='text-gray-600'>
							{t('appointment.status.cancelled')}
						</span>
					</div>
					<div className='flex items-center space-x-2'>
						<div className='w-3 h-3 bg-gray-200 border border-gray-300 rounded'></div>
						<span className='text-gray-600'>{t('schedule.past')}</span>
					</div>
				</motion.div>

				{/* No appointments in current week message */}
				{futureAppointments &&
					futureAppointments.length > 0 &&
					futureWeekAppointments.length === 0 && (
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							className='mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg'
						>
							<div className='flex items-center space-x-3'>
								<Calendar className='w-6 h-6 text-yellow-600' />
								<div>
									<h3 className='text-yellow-800 font-semibold'>
										{t('appointment.no_appointments_this_week')}
									</h3>
									<p className='text-yellow-700 text-sm mt-1'>
										{t('appointment.upcoming_appointments_info', {
											0: futureAppointments.length.toString(),
										})}{' '}
										<span className='font-semibold text-green-600 flex items-center gap-1'>
											<Search className='w-4 h-4' />
											{t('appointment.find_appointment')}
										</span>{' '}
										{t('appointment.go_to_first_appointment')}
									</p>
								</div>
							</div>
						</motion.div>
					)}
			</motion.div>

			{/* Timetable */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className='flex-1 overflow-auto p-6'
			>
				<div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
					<div className='overflow-x-auto max-h-[70vh] sm:max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-200 relative scroll-container'>
						{/* Current Time Line Overlay */}
						<CurrentTimeLine
							timeSlots={timeSlots}
							weekDays={weekDays}
							onTimeSlotStatusChange={handleTimeSlotStatusChange}
						/>

						<table
							className='w-full min-w-[320px] sm:min-w-[800px] table-fixed'
							style={{
								tableLayout: 'fixed',
								minWidth: '800px',
							}}
						>
							{/* Header with days */}
							<thead className='sticky top-0 z-50 sticky-header'>
								<tr className='bg-gray-50 border-b border-gray-200'>
									<th
										className='w-16 sm:w-24 px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200 sticky left-0 z-40 bg-gray-50 shadow-lg sticky-time-col'
										style={{
											width: '100px',
											minWidth: '100px',
											maxWidth: '100px',
										}}
									>
										<div className='flex items-center space-x-2'>
											<Clock className='w-4 h-4' />
											<span>Time</span>
										</div>
									</th>
									{weekDays.map(day => (
										<th
											key={day.toISOString()}
											className='px-2 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-200 min-w-[100px] sm:min-w-[150px] bg-gray-50 relative z-30'
											style={{
												width: `calc((100% - 100px) / 7)`,
												minWidth: '120px',
											}}
										>
											<div className='flex flex-col items-center space-y-1'>
												<span className='text-xs text-gray-600'>
													{new Date(day)
														.toLocaleDateString(
															locale === 'vi' ? 'vi-VN' : 'en-US',
															{ weekday: 'short' }
														)
														.toUpperCase()}
												</span>
												<span className='font-bold text-gray-900'>
													{new Date(day).toLocaleDateString(
														locale === 'vi' ? 'vi-VN' : 'en-US',
														{
															day: '2-digit',
															month: '2-digit',
														}
													)}
												</span>
											</div>
										</th>
									))}
								</tr>
							</thead>

							{/* Body with time slots */}
							<tbody>
								{timeSlots.map(timeSlot => {
									// All time slots shown are now business hours
									return (
										<tr
											key={timeSlot}
											className='border-b border-gray-200 group'
										>
											<td
												className='px-4 py-3 text-sm font-semibold border-r border-gray-200 sticky left-0 z-20 transition-all duration-200 shadow-md sticky-time-col bg-gray-50 text-gray-800'
												style={{
													width: '100px',
													minWidth: '100px',
													maxWidth: '100px',
												}}
											>
												<div className='flex items-center space-x-2'>
													<Briefcase className='w-4 h-4' />
													<span>{timeSlot}</span>
												</div>
											</td>
											{weekDays.map(day => {
												const dateKey = getLocalDateKey(day)
												const appointmentsForSlot =
													groupedAppointments[dateKey]?.[timeSlot] || []
												const isSlotPast = isTimeSlotPast(day, timeSlot)
												const isSlotHighlighted =
													highlightedSlot === `${dateKey}-${timeSlot}`
												return (
													<td
														key={`${dateKey}-${timeSlot}`}
														ref={el => {
															cellRefs.current[`${dateKey}-${timeSlot}`] = el
														}}
														className={`p-0 relative z-10 appointment-cell ${
															isSlotPast ? 'bg-gray-100' : ''
														}`}
														style={{
															width: `calc((100% - 100px) / 7)`,
															minWidth: '120px',
														}}
													>
														<AppointmentCell
															appointments={appointmentsForSlot}
															isHighlighted={isSlotHighlighted}
														/>
													</td>
												)
											})}
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</div>
			</motion.div>

			{/* Summary */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4, duration: 0.5 }}
				className='bg-white border-t border-gray-200 p-4'
			>
				<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
					<div className='flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm'>
						<div className='flex items-center space-x-3'>
							<BarChart3 className='w-5 h-5 text-blue-600' />
							<span className='text-gray-700'>
								{t('appointment.this_week')}:{' '}
								<span className='font-bold text-blue-600'>
									{futureWeekAppointments.length}
								</span>{' '}
								{t('appointment.appointments_count')}
							</span>
						</div>
						<div className='flex items-center space-x-3'>
							<TrendingUp className='w-5 h-5 text-purple-600' />
							<span className='text-gray-700'>
								{t('appointment.upcoming')}:{' '}
								<span className='font-bold text-purple-600'>
									{futureAppointments?.length || 0}
								</span>{' '}
								{t('appointment.appointments_count')}
							</span>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	)
}
