export interface Appointment {
	id: string
	memberName: string
	memberId: string
	staffName: string
	staffId: string
	scheduleAt: string // ISO string
	joinUrl?: string
	isDeleted: boolean
	status: string
}
