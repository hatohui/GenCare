export type Consultant = {
	id: string
	role: string
	email: string
	firstName?: string
	lastName?: string
	gender: boolean // true = Male, false = Female
	phoneNumber?: string
	dateOfBirth?: string // ISO 8601 format (e.g. "1990-01-01")
	avatarUrl?: string
	degree: string
	yearOfExperience: number
	biography?: string
	department: string
}
