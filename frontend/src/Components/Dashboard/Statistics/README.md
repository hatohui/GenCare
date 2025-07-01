# Admin Statistics Dashboard

A comprehensive statistics dashboard for admin users with real-time data visualization and analytics.

## Features

### 📊 Key Metrics

- **Total Users**: Number of registered users with growth trends
- **Revenue**: Total revenue with currency formatting (VND)
- **Bookings**: Total booking count with trend analysis
- **Services**: Active services count
- **Consultants**: Active consultants count
- **Pending Payments**: Payments awaiting processing
- **Test Results**: Completed test results

### 📈 Interactive Charts

- **Revenue Chart**: Bar chart showing revenue and booking trends
- **User Growth Chart**: Area chart displaying user growth over time
- **Period Selection**: Toggle between week, month, and year views

### 🎯 Additional Features

- **Top Services**: Performance ranking of services
- **Recent Activity**: Real-time activity feed
- **Export Functionality**: Data export capabilities
- **Responsive Design**: Mobile-friendly interface
- **Loading States**: Smooth loading animations
- **Error Handling**: Graceful error states

## Components

### StatsCard

Reusable card component for displaying key metrics with icons, trends, and color coding.

```tsx
<StatsCard
	title='Total Users'
	value='1,247'
	subtitle='Registered accounts'
	icon={Users}
	color='blue'
	trend={{ value: 12.5, isPositive: true, label: 'vs last month' }}
/>
```

### RevenueChart

Interactive chart showing revenue and booking data with customizable time periods.

```tsx
<RevenueChart data={revenueData} period='month' />
```

### UserGrowthChart

Area chart displaying user growth trends with tooltips and legends.

```tsx
<UserGrowthChart data={userGrowthData} period='month' />
```

### RecentActivity

Activity feed showing recent system events with status indicators.

```tsx
<RecentActivity activities={recentActivityData} />
```

## Data Structure

### AdminStatisticsResponse

```typescript
interface AdminStatisticsResponse {
	dashboardStats: DashboardStats
	revenueData: RevenueData[]
	userGrowth: UserGrowthData[]
	topServices: TopServices[]
	recentActivity: RecentActivity[]
	paymentStats: PaymentStats
	userStats: UserStats
	servicePerformance: ServicePerformance[]
}
```

## API Integration

The dashboard uses the `useAdminStatistics` hook to fetch data:

```tsx
const { data, isLoading, isError, refetch } = useAdminStatistics()
```

### API Endpoints

- `GET /statistics/admin` - Main statistics data
- `GET /statistics/revenue?period=month` - Revenue data
- `GET /statistics/users/growth?period=month` - User growth data

## Styling

The dashboard uses:

- **Tailwind CSS** for styling
- **Motion** for animations
- **Lucide React** for icons
- **Recharts** for data visualization

## Customization

### Colors

The dashboard supports 6 color themes:

- `blue` - Primary metrics
- `green` - Revenue/success metrics
- `yellow` - Warning/attention metrics
- `purple` - Booking metrics
- `red` - Error/pending metrics
- `indigo` - Service metrics

### Periods

Charts support three time periods:

- `week` - Weekly data
- `month` - Monthly data (default)
- `year` - Yearly data

## Usage

```tsx
import AdminStatisticsPage from '@/app/(private)/dashboard/(admin)/statistics/page'

// The page is automatically accessible at /dashboard/statistics
// for users with admin role
```

## Dependencies

- `recharts` - Chart library
- `lucide-react` - Icon library
- `motion` - Animation library
- `@tanstack/react-query` - Data fetching
- `axios` - HTTP client

## Mock Data

The dashboard includes comprehensive mock data for development and demonstration purposes. Replace with real API calls when backend is ready.

## Data Fetching Hooks

### useRevenueData

Fetches revenue data for the admin dashboard charts.

```tsx
import { useRevenueData } from '@/Services/statistics-service'

const { data, isLoading, isError, refetch } = useRevenueData('month')
```

- **Parameters:**
  - `period`: `'week' | 'month' | 'year'` (default: `'month'`)
- **Returns:**
  - `data`: Array of revenue data objects (`{ date: string, revenue: number, bookings: number }`)
  - `isLoading`: Boolean
  - `isError`: Boolean
  - `refetch`: Function

### useUserGrowth

Fetches user growth data for the admin dashboard charts.

```tsx
import { useUserGrowth } from '@/Services/statistics-service'

const { data, isLoading, isError, refetch } = useUserGrowth('month')
```

- **Parameters:**
  - `period`: `'week' | 'month' | 'year'` (default: `'month'`)
- **Returns:**
  - `data`: Array of user growth data objects (`{ date: string, newUsers: number, totalUsers: number }`)
  - `isLoading`: Boolean
  - `isError`: Boolean
  - `refetch`: Function
