import {
	AccountSVG,
	BookingListVSG,
	CalendarSVG,
	ChatSVG,
	ClockSVG,
	CustomerSVG,
	HeartSVG,
	HomeSVG,
	MoneySVG,
	ServiceSVG,
} from '@/Components/SVGs'
import { RouterButtonProps } from '@/Components/NavBar/RouterButton'
import { PermissionLevel } from '@/Utils/Permissions/isAllowedRole'

export type SideNavButtonProp = RouterButtonProps & {
	svg: React.ReactNode
	level: PermissionLevel
}

export const SIDE_NAV_OPTIONS: SideNavButtonProp[] = [
	{
		label: 'Home',
		to: '/dashboard',
		svg: <HomeSVG />,
		level: PermissionLevel.staff,
	},
	{
		label: 'Home',
		to: '/app',
		svg: <HomeSVG />,
		level: PermissionLevel.member,
	},
	{
		label: 'Statistics',
		to: '/dashboard/statistics',
		svg: <ServiceSVG />,
		level: PermissionLevel.admin,
	},
	{
		label: 'Accounts',
		to: '/dashboard/accounts',
		svg: <AccountSVG />,
		level: PermissionLevel.manager,
	},
	{
		label: 'Customers',
		to: '/app/customers',
		svg: <CustomerSVG />,
		level: PermissionLevel.consultant,
	},
	{
		label: 'Services',
		to: '/dashboard/services',
		svg: <ServiceSVG />,
		level: PermissionLevel.manager,
	},
	{
		label: 'Slots',
		to: '/dashboard/slots',
		svg: <ClockSVG />,
		level: PermissionLevel.manager,
	},
	{
		label: 'Schedules',
		to: '/dashboard/schedules',
		svg: <ServiceSVG />,
		level: PermissionLevel.manager,
	},
	{
		label: 'Analytics',
		to: '/dashboard/analytics',
		svg: <ServiceSVG />,
		level: PermissionLevel.admin,
	},
	{
		label: 'Schedule',
		to: '/app/schedule',
		svg: <ServiceSVG />,
		level: PermissionLevel.consultant,
	},
	{
		label: 'Booking',
		to: '/app/booking',
		svg: <BookingListVSG />,
		level: PermissionLevel.member,
	},
	{
		label: 'User Services',
		to: '/app/service',
		svg: <ServiceSVG />,
		level: PermissionLevel.member,
	},
	{
		label: 'Tracking',
		to: '/app/birthcontrol',
		svg: <HeartSVG />,
		level: PermissionLevel.member,
	},
	{
		label: 'Consultants',
		to: '/app/consultants',
		svg: <AccountSVG />,
		level: PermissionLevel.member,
	},
	{
		label: 'Appointments',
		to: '/app/appointments',
		svg: <CalendarSVG />,
		level: PermissionLevel.member,
	},
	{
		label: 'Payments',
		to: '/dashboard/payments',
		svg: <MoneySVG />,
		level: PermissionLevel.staff,
	},
	{
		label: 'Test Results',
		to: '/dashboard/tests',
		svg: <AccountSVG />,
		level: PermissionLevel.staff,
	},
	{
		label: 'Appointments',
		to: '/dashboard/appointments',
		svg: <CalendarSVG />,
		level: PermissionLevel.staff,
	},
	{
		label: 'Chat with us',
		to: '/app/chat',
		svg: <ChatSVG />,
		level: PermissionLevel.member,
	},
]
