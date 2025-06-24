import { Role } from '@/Utils/Permissions/isAllowedRole'

export type RoleRs = {
	name: Role
	description?: string
}

export type Account = {
	id: string
	role: RoleRs
	email: string
	firstName: string
	lastName: string
	gender: boolean
	phoneNumber: string
	dateOfBirth: string
	avatarUrl?: string
	deletedAt?: string
	isDeleted: boolean
	deletedBy?: string
}
