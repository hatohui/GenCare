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
	sampleDate: Date
	resultDate: Date
	status: boolean
	resultData: ResultData
	updatedAt: Date
}
