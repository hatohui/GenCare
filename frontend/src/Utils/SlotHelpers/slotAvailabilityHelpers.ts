import { Appointment } from '@/Interfaces/Appointment/Types/Appointment'
import { ScheduleListResponse } from '@/Interfaces/Schedule/Schema/schedule'
import { addHours, isSameHour, startOfDay } from 'date-fns'
import { WORKING_SLOTS, isSlotInPast } from './slotTimeHelpers'

/**
 * Check if a slot is available for assignment
 * A slot is unavailable if:
 * 1. It's in the past
 * 2. It has appointments scheduled
 * 3. It's already assigned to the maximum number of consultants
 */
export const isSlotAvailable = (
	day: Date,
	slotNo: number,
	appointments: Appointment[],
	schedules: ScheduleListResponse,
	maxConsultantsPerSlot: number = 3
): boolean => {
	const slot = WORKING_SLOTS.find(s => s.no === slotNo)
	if (!slot) return false

	if (isSlotInPast(day, slot.startTime)) {
		return false
	}

	// Use improved time handling to check for appointments
	const startTime = addHours(day, parseInt(slot.startTime.split(':')[0]))
	const endTime = addHours(day, parseInt(slot.endTime.split(':')[0]))

	const hasAppointments = appointments.some(appointment => {
		if (appointment.isDeleted) return false

		// Parse appointment time - handle both with and without timezone
		let appointmentDate: Date
		if (appointment.scheduleAt.includes('Z')) {
			appointmentDate = new Date(appointment.scheduleAt)
		} else {
			appointmentDate = new Date(appointment.scheduleAt + 'Z')
		}

		return appointmentDate >= startTime && appointmentDate < endTime
	})

	if (hasAppointments) {
		return false
	}

	// Check if slot is already at maximum capacity for consultants
	const assignedSchedules = getAssignedConsultantsForSlot(
		day,
		slotNo,
		schedules
	)
	const totalConsultants = assignedSchedules.reduce((count, schedule) => {
		return count + (schedule.accounts?.length || 0)
	}, 0)

	if (totalConsultants >= maxConsultantsPerSlot) {
		return false
	}

	return true
}

/**
 * Get consultants assigned to a specific slot
 */
export const getAssignedConsultantsForSlot = (
	day: Date,
	slotNo: number,
	schedules: ScheduleListResponse
): any[] => {
	const slot = WORKING_SLOTS.find(s => s.no === slotNo)
	if (!slot) return []

	const startTime = addHours(day, parseInt(slot.startTime.split(':')[0]))
	const endTime = addHours(day, parseInt(slot.endTime.split(':')[0]))

	return schedules.filter(schedule => {
		// Parse schedule times - handle both with and without timezone
		let scheduleStart: Date, scheduleEnd: Date

		if (schedule.startAt.includes('Z')) {
			scheduleStart = new Date(schedule.startAt)
		} else {
			scheduleStart = new Date(schedule.startAt + 'Z')
		}

		if (schedule.endAt.includes('Z')) {
			scheduleEnd = new Date(schedule.endAt)
		} else {
			scheduleEnd = new Date(schedule.endAt + 'Z')
		}

		return (
			schedule.no === slotNo &&
			isSameHour(scheduleStart, startTime) &&
			isSameHour(scheduleEnd, endTime)
		)
	})
}

/**
 * Check if a consultant is already assigned to a slot
 */
export const isConsultantAssignedToSlot = (
	day: Date,
	slotNo: number,
	consultantId: string,
	schedules: ScheduleListResponse
): boolean => {
	const assignedSchedules = getAssignedConsultantsForSlot(
		day,
		slotNo,
		schedules
	)
	return assignedSchedules.some(schedule =>
		schedule.accounts?.some((account: any) => account.id === consultantId)
	)
}

/**
 * Get all appointments for a specific slot
 */
export const getAppointmentsForSlot = (
	day: Date,
	slotNo: number,
	appointments: Appointment[]
): Appointment[] => {
	const slot = WORKING_SLOTS.find(s => s.no === slotNo)
	if (!slot) return []

	// Create the slot start and end times for the given day (in local timezone)
	const slotStartTime = addHours(
		startOfDay(day),
		parseInt(slot.startTime.split(':')[0])
	)
	const slotEndTime = addHours(
		startOfDay(day),
		parseInt(slot.endTime.split(':')[0])
	)

	const result = appointments.filter(appointment => {
		if (appointment.isDeleted) return false

		// Parse appointment time - handle both with and without timezone
		let appointmentDate: Date
		if (appointment.scheduleAt.includes('Z')) {
			appointmentDate = new Date(appointment.scheduleAt)
		} else {
			appointmentDate = new Date(appointment.scheduleAt + 'Z')
		}

		// Convert appointment date to local timezone for comparison
		const localAppointmentDate = new Date(appointmentDate.getTime())

		// Check if appointment falls within this slot's time range
		return (
			localAppointmentDate >= slotStartTime &&
			localAppointmentDate < slotEndTime
		)
	})

	return result
}

/**
 * Check if a slot has any booked appointments
 */
export const hasBookedAppointments = (
	day: Date,
	slotNo: number,
	appointments: Appointment[]
): boolean => {
	const slotAppointments = getAppointmentsForSlot(day, slotNo, appointments)
	return slotAppointments.length > 0
}

/**
 * Get slot status for display
 */
export const getSlotStatus = (
	day: Date,
	slotNo: number,
	appointments: Appointment[],
	schedules: ScheduleListResponse
): {
	status: 'available' | 'assigned' | 'booked' | 'past'
	assignedConsultants: any[]
	appointments: Appointment[]
	isAvailable: boolean
} => {
	const slot = WORKING_SLOTS.find(s => s.no === slotNo)

	if (!slot) {
		return {
			status: 'past',
			assignedConsultants: [],
			appointments: [],
			isAvailable: false,
		}
	}

	if (isSlotInPast(day, slot.startTime)) {
		return {
			status: 'past',
			assignedConsultants: [],
			appointments: [],
			isAvailable: false,
		}
	}

	const assignedSchedules = getAssignedConsultantsForSlot(
		day,
		slotNo,
		schedules
	)

	const slotAppointments = getAppointmentsForSlot(day, slotNo, appointments)
	const available = isSlotAvailable(day, slotNo, appointments, schedules)

	let status: 'available' | 'assigned' | 'booked' | 'past' = 'available'

	if (slotAppointments.length > 0) {
		status = 'booked'
	} else if (assignedSchedules.length > 0) {
		status = 'assigned'
	}

	// Extract all consultants from the schedules, preserving the scheduleId
	const assignedConsultants = assignedSchedules.flatMap(schedule =>
		(schedule.accounts || []).map((account: any) => ({
			...account,
			scheduleId: schedule.scheduleId, // Preserve the scheduleId for deletion
		}))
	)

	return {
		status,
		assignedConsultants,
		appointments: slotAppointments,
		isAvailable: available,
	}
}
