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
		label: 'nav.home',
		to: '/dashboard',
		svg: <HomeSVG />,
		level: PermissionLevel.staff,
	},
	{
		label: 'nav.home',
		to: '/app',
		svg: <HomeSVG />,
		level: PermissionLevel.member,
	},
	{
		label: 'nav.statistics',
		to: '/dashboard/statistics',
		svg: <ServiceSVG />,
		level: PermissionLevel.admin,
	},
	{
		label: 'nav.accounts',
		to: '/dashboard/accounts',
		svg: <AccountSVG />,
		level: PermissionLevel.manager,
	},
	{
		label: 'nav.customers',
		to: '/app/customers',
		svg: <CustomerSVG />,
		level: PermissionLevel.consultant,
	},
	{
		label: 'nav.services',
		to: '/dashboard/services',
		svg: <ServiceSVG />,
		level: PermissionLevel.manager,
	},
	{
		label: 'nav.slots',
		to: '/dashboard/slots',
		svg: <ClockSVG />,
		level: PermissionLevel.manager,
	},
	{
		label: 'nav.schedules',
		to: '/dashboard/schedules',
		svg: <ServiceSVG />,
		level: PermissionLevel.manager,
	},
	{
		label: 'nav.schedule',
		to: '/app/schedule',
		svg: <ServiceSVG />,
		level: PermissionLevel.consultant,
	},
	{
		label: 'nav.booking',
		to: '/app/booking',
		svg: <BookingListVSG />,
		level: PermissionLevel.member,
	},
	{
		label: 'nav.userServices',
		to: '/app/service',
		svg: <ServiceSVG />,
		level: PermissionLevel.member,
	},
	{
		label: 'nav.tracking',
		to: '/app/birthcontrol',
		svg: <HeartSVG />,
		level: PermissionLevel.member,
	},
	{
		label: 'nav.consultants',
		to: '/app/consultants',
		svg: <AccountSVG />,
		level: PermissionLevel.member,
	},
	{
		label: 'nav.appointments',
		to: '/app/appointments',
		svg: <CalendarSVG />,
		level: PermissionLevel.member,
	},
	{
		label: 'nav.payments',
		to: '/dashboard/payments',
		svg: <MoneySVG />,
		level: PermissionLevel.staff,
	},
	{
		label: 'nav.testResults',
		to: '/dashboard/tests',
		svg: <AccountSVG />,
		level: PermissionLevel.staff,
	},
	{
		label: 'nav.appointments',
		to: '/dashboard/appointments',
		svg: <CalendarSVG />,
		level: PermissionLevel.staff,
	},
	{
		label: 'nav.chat',
		to: '/app/chat',
		svg: <ChatSVG />,
		level: PermissionLevel.member,
	},
]
