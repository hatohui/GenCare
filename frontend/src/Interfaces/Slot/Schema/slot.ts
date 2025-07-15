import { Slot } from '../Types/Slot'

export type CreateSlotRequest = {
	no: number
	startTime: string
	endTime: string
	isDeleted: boolean
}

export type CreateSlotResponse = {
	success: boolean
	message: string
}
export type GetSlotResponse = {
	slots: Array<{
		id: string
		no: number
		startAt: string
		endAt: string
		isDeleted: boolean
		accounts: Array<{
			id: string
			roleId: string
			email: string
			passwordHash: string | null
			firstName: string | null
			lastName: string | null
			phone: string | null
			dateOfBirth: string | null
			gender: boolean
			avatarUrl: string | null
			schedules: Array<{
				id: string
				slotId: string
			}>
		}>
	}>
}
export type UpdateSlotRequest = {
	no?: number
	startTime?: string
	endTime?: string
	isDeleted?: boolean
}

export type UpdateSlotResponse = CreateSlotResponse
