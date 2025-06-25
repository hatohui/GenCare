import {
	AccountSVG,
	BookingListVSG,
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
		label: 'Invoices',
		to: '/dashboard/invoices',
		svg: <MoneySVG />,
		level: PermissionLevel.consultant,
	},
	{
		label: 'Account Management',
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
]
