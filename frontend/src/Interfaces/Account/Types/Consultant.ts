import { Account } from '@/Interfaces/Auth/Types/Account'

export type Consultant = Account & {
	degree: string
	yearOfExperience: number
	biography?: string
	department: string
}
