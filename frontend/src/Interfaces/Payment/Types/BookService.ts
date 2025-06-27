export type OrderDetail = {
	orderDetailId: string
	purchaseId: string
	serviceName: string
	firstName: string
	lastName: string
	phoneNumber: string
	dateOfBirth: Date
	gender: boolean
	createdAt: Date
	status: boolean
}

export type OrderDetails = OrderDetail[]

export type OrderDetailResponse = OrderDetails

export type BookedServices = {
	BookedService: Array<{
		orderDetailId: string
		serviceName: string
		firstName: string
		lastName: string
		phoneNumber: string
		dateOfBirth: Date
		gender: boolean
		createdAt: Date
	}>
	Price: number
	PurchaseId: string
}[]

export type BookedServicesResponse = BookedServices
