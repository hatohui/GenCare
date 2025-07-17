export type ResultData = {
	[key: string]: {
		value: number
		unit: string
		referenceRange: string
		flag: 'normal' | 'high' | 'low'
	}
}

export interface Result {
	orderDetailId: string
	orderDate: Date
	sampleDate?: Date
	resultDate?: Date
	status: boolean
	resultData?: ResultData
	updatedAt?: Date
}

export interface AllResult {
	orderDetailId: string
	serviceName: string
	firstName: string
	lastName: string
	phoneNumber: string
	dateOfBirth: string
	gender: boolean
	createdAt: string
	status: boolean
	updatedAt?: Date
}

export type AllResultArray = {
	result: AllResult[]
	totalCount: number
}
