export type ApiErrorResponse = {
	type: string
	title: string
	status: number
	traceId?: string
	detail?: string // used in 500
	errors?: {
		[field: string]: string[]
	} // used in 400
}
