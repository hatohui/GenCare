import { Schedule } from '../Types/Schedule'

export type CreateScheduleRequest = Omit<Schedule, 'id'> //201

// Create returns just status 201, no body
export type CreateScheduleResponse = void

export type UpdateScheduleRequest = {
	scheduleId: string
	slotId?: string
	accountId?: string
} //204

// Update returns just status 204, no body
export type UpdateScheduleResponse = void

// Delete returns just status, no body
export type DeleteScheduleResponse = void

//view by id : /api/schedules/{consultantid}?startAt={}&endAt={}
export type ScheduleByConsultantResponse = {
	account: {
		id: string
		email: string
		firstName?: string
		lastName?: string
		phoneNumber?: string
	}
	slots: Array<{
		no: number
		startAt: string // ISO Date string
		endAt: string // ISO Date string
	}>
}

//view all /api/schedules?startAt={str}&endAt={str}
export type ScheduleListResponse = Array<{
	slots: Array<{
		accounts: Array<{
			id: string
			email: string
			firstName?: string
			lastName?: string
			phoneNumber?: string
		}>
		no: number
		startAt: string // ISO Date string
		endAt: string // ISO Date string
	}>
}>
