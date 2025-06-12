export type Role = {
	name: string
	description?: string
}

export type Account = {
	id: string
	role: Role
	email: string
	firstName: string
	lastName: string
	gender: boolean
	phoneNumber: string
	dateOfBirth: string
	avatarUrl?: string
	deletedAt?: string
	isDeleted?: boolean
	deletedBy?: string
}
