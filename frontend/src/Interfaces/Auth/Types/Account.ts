import { Role } from '@/Enums/Role'

export type Account = {
	id: string
	role: Role
	email: string
	firstName: string
	lastName: string
	phoneNumber: string
	dateOfBirth: string
	avatarUrl: string
	deletedAt?: string
	isDeleted: boolean
}
