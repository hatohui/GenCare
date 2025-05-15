export interface UserData {
	firstName: string
	lastName: string
	dateOfBirth: string // format: dd/mm/yyyy
	email: string
	address: string

	username: string
	password: string
	confirmPassword: string

	agreeToTerms: boolean
	timestamp: string
}

export interface UserLoginData {
	username: string
	password: string
}
