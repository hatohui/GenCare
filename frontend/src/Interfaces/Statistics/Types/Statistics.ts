export interface DashboardStatistic {
	totalActiveUsers: number
	totalActiveManagers: number
	totalActiveStaffs: number
	totalServices: number
	totalRevenue: number
	totalBookings: number
	totalActiveConsultants: number
	pendingPayments: number
	completedPayments: number
	testResults: number
}

export interface RevenueData {
	date: string
	revenue: number
	bookings: number
}

export interface UserGrowthData {
	date: string
	newUsers: number
}

export interface TopService {
	serviceId: string
	serviceName: string
	bookings: number
	revenue: number
	rating: number | null
}

export interface PaymentStatistic {
	total: number
	pending: number
	completed: number
	failed: number
	monthlyRevenue: RevenueData[]
}

export interface UserStatistic {
	total: number
	active: number
	monthlyGrowth: UserGrowthData[]
}

export interface AdminStatisticsResponse {
	dashboardStatistic: DashboardStatistic
	revenueData: RevenueData[]
	userGrowth: UserGrowthData[]
	topServices: TopService[]
	paymentStatistic: PaymentStatistic
	userStatistic: UserStatistic
}

export interface RecentActivity {
	id: string
	type: string
	message: string
	timestamp: string
	status: string
	userName: string
}
