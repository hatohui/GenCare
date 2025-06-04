export type Account = {
	id: string
	role: string
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
