import { Role } from '@/Enums/Role'

export type Account = {
	id: string
	email: string
	firstName: string
	lastName: string
	phoneNumber: string
	address: string
	dateOfBirth: Date | string
	avatarUrl: string
	deletedAt: string
	deletedBy: string
	isDeleted: boolean
	role: Role
}
