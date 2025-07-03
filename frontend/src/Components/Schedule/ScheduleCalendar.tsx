'use client'
import React, { useState } from 'react'
import clsx from 'clsx'
import {
	useAllSchedules,
	useCreateSchedule,
} from '@/Services/schedule-services'
import { useAllSlotsAdmin } from '@/Services/slot-services'
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns'
import AssignSlotModal from '@/Components/Schedule/AssignSlotModal'
import toast from 'react-hot-toast'
import { formatTimeForDisplay } from '@/Utils/dateTime'

interface ScheduleCalendarProps {
	isAdminOrManager?: boolean
}

const ScheduleCalendar = ({
	isAdminOrManager = false,
}: ScheduleCalendarProps) => {
	const [currentWeek, setCurrentWeek] = useState(new Date())
	const [selectedSlot, setSelectedSlot] = useState<{
		slotId: string
		slotNo: number
		day: Date
		time: string
	} | null>(null)
	const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)

	// Get start and end of current week
	const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }) // Monday
	const weekEnd = addDays(weekStart, 6)

	// Fetch data
	const slotsQuery = useAllSlotsAdmin()
	const schedulesQuery = useAllSchedules(
		weekStart.toISOString(),
		weekEnd.toISOString()
	)
	const createScheduleMutation = useCreateSchedule()

	const slots = slotsQuery.data?.data?.slots || []
	const schedules = schedulesQuery.data || []

	// Generate week days
	const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

	// Helper function to get schedule for a specific slot and day
	const getScheduleForSlotAndDay = (slotId: string, day: Date) => {
		return schedules
			.find(schedule =>
				schedule.slots.some(
					slot =>
						slot.accounts.length > 0 && isSameDay(parseISO(slot.startAt), day)
				)
			)
			?.slots.find(slot => slot.accounts.length > 0)
	}

	// Handle slot click
	const handleSlotClick = (slot: any, day: Date) => {
		if (!isAdminOrManager) return

		const timeRange = `${formatTimeForDisplay(
			slot.startAt
		)} - ${formatTimeForDisplay(slot.endAt)}`
		setSelectedSlot({
			slotId: slot.id,
			slotNo: slot.no,
			day,
			time: timeRange,
		})
		setIsAssignModalOpen(true)
	}

	// Handle assign consultant
	const handleAssignConsultant = (consultantId: string) => {
		if (!selectedSlot) return

		createScheduleMutation.mutate(
			{
				slotId: selectedSlot.slotId,
				accountId: consultantId,
			},
			{
				onSuccess: () => {
					toast.success('Consultant assigned successfully!')
					schedulesQuery.refetch()
					setIsAssignModalOpen(false)
					setSelectedSlot(null)
				},
				onError: () => {
					toast.error('Failed to assign consultant')
				},
			}
		)
	}

	// Navigation
	const goToPreviousWeek = () => {
		setCurrentWeek(prev => addDays(prev, -7))
	}

	const goToNextWeek = () => {
		setCurrentWeek(prev => addDays(prev, 7))
	}

	const goToToday = () => {
		setCurrentWeek(new Date())
	}

	return (
		<div className='w-full h-full flex flex-col'>
			{/* Header with navigation */}
			<div className='flex items-center justify-between p-4 border-b border-gray-200 bg-white'>
				<div className='flex items-center space-x-4'>
					<h2 className='text-xl font-semibold text-gray-800'>
						Schedule Management
					</h2>
					<div className='text-sm text-gray-600'>
						{format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
					</div>
				</div>

				<div className='flex items-center space-x-2'>
					<button
						onClick={goToPreviousWeek}
						className='px-3 py-1 border border-gray-300 rounded hover:bg-gray-50'
					>
						← Previous
					</button>
					<button
						onClick={goToToday}
						className='px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700'
					>
						Today
					</button>
					<button
						onClick={goToNextWeek}
						className='px-3 py-1 border border-gray-300 rounded hover:bg-gray-50'
					>
						Next →
					</button>
				</div>
			</div>

			{/* Loading state */}
			{(slotsQuery.isLoading || schedulesQuery.isLoading) && (
				<div className='flex-1 flex items-center justify-center'>
					<div className='text-center'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2'></div>
						<p className='text-gray-600'>Loading schedule...</p>
					</div>
				</div>
			)}

			{/* Calendar Grid */}
			{!slotsQuery.isLoading && !schedulesQuery.isLoading && (
				<div className='flex-1 overflow-auto'>
					<div className='min-w-[900px] grid grid-cols-8 border-l border-t border-gray-300'>
						{/* Header Row */}
						<div className='bg-gray-100 border-b border-r border-gray-300 p-3 text-center font-semibold sticky top-0 z-10'>
							Time Slot
						</div>
						{weekDays.map(day => (
							<div
								key={day.toISOString()}
								className='bg-gray-100 border-b border-r border-gray-300 p-3 text-center font-semibold sticky top-0 z-10'
							>
								<div className='text-sm font-medium'>{format(day, 'EEE')}</div>
								<div className='text-xs text-gray-600 mt-1'>
									{format(day, 'MMM d')}
								</div>
							</div>
						))}

						{/* Time slots rows */}
						{slots.map(slot => (
							<React.Fragment key={slot.id}>
								{/* Slot Label */}
								<div className='border-b border-r border-gray-300 p-3 text-center text-gray-700 font-medium bg-gray-50'>
									<div className='text-sm'>Slot {slot.no}</div>
									<div className='text-xs text-gray-500 mt-1'>
										{formatTimeForDisplay(slot.startAt)} -{' '}
										{formatTimeForDisplay(slot.endAt)}
									</div>
								</div>

								{/* Day Columns */}
								{weekDays.map(day => {
									const schedule = getScheduleForSlotAndDay(slot.id, day)
									const hasAssignment = !!schedule

									return (
										<div
											key={`${day.toISOString()}-${slot.id}`}
											className={clsx(
												'border-b border-r border-gray-300 h-20 transition-colors relative',
												isAdminOrManager && 'cursor-pointer hover:bg-blue-50',
												hasAssignment ? 'bg-green-50' : 'bg-white'
											)}
											onClick={() =>
												isAdminOrManager && handleSlotClick(slot, day)
											}
										>
											{hasAssignment && schedule && (
												<div className='p-2 h-full flex flex-col justify-center'>
													{schedule.accounts?.map(account => (
														<div key={account.id} className='text-xs'>
															<div className='font-medium text-green-800'>
																{account.firstName} {account.lastName}
															</div>
															<div className='text-green-600 truncate'>
																{account.email}
															</div>
														</div>
													))}
												</div>
											)}
											{isAdminOrManager && !hasAssignment && (
												<div className='absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'>
													<div className='text-xs text-gray-500'>
														Click to assign
													</div>
												</div>
											)}
										</div>
									)
								})}
							</React.Fragment>
						))}
					</div>
				</div>
			)}

			{/* Empty state */}
			{!slotsQuery.isLoading && slots.length === 0 && (
				<div className='flex-1 flex items-center justify-center'>
					<div className='text-center text-gray-500'>
						<p className='text-lg mb-2'>No time slots available</p>
						<p className='text-sm'>
							Please create time slots first to manage schedules.
						</p>
					</div>
				</div>
			)}

			{/* Assign Modal */}
			{selectedSlot && (
				<AssignSlotModal
					isOpen={isAssignModalOpen}
					onClose={() => {
						setIsAssignModalOpen(false)
						setSelectedSlot(null)
					}}
					onAssign={handleAssignConsultant}
					slotInfo={{
						slotNo: selectedSlot.slotNo,
						day: format(selectedSlot.day, 'EEEE, MMMM d'),
						time: selectedSlot.time,
					}}
				/>
			)}
		</div>
	)
}

export default ScheduleCalendar
