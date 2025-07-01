export interface DashboardStats {
	totalUsers: number
	totalServices: number
	totalRevenue: number
	totalBookings: number
	activeConsultants: number
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
	totalUsers: number
}

export interface ServicePerformance {
	id: string
	name: string
	bookings: number
	revenue: number
	rating: number
}

export interface RecentActivity {
	id: string
	type: 'booking' | 'payment' | 'test' | 'user' | 'service'
	message: string
	timestamp: string
	status: 'success' | 'error' | 'warning' | 'info'
	userId?: string
	userName?: string
}

export interface TopServices {
	serviceId: string
	serviceName: string
	bookings: number
	revenue: number
	percentage: number
}

export interface PaymentStats {
	total: number
	pending: number
	completed: number
	failed: number
	monthlyRevenue: RevenueData[]
}

export interface UserStats {
	total: number
	active: number
	newThisMonth: number
	growthRate: number
	monthlyGrowth: UserGrowthData[]
}

export interface AdminStatisticsResponse {
	dashboardStats: DashboardStats
	revenueData: RevenueData[]
	userGrowth: UserGrowthData[]
	topServices: TopServices[]
	recentActivity: RecentActivity[]
	paymentStats: PaymentStats
	userStats: UserStats
	servicePerformance: ServicePerformance[]
}
