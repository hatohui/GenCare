import { Gender } from '@/Enums/Gender'

export type Account = {
	id: string
	role: string
	email: string
	firstName: string
	lastName: string
	gender: Gender
	phoneNumber: string
	dateOfBirth: string
	avatarUrl: string
	deletedAt: string
	isDeleted: boolean
}
